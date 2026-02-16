import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useWebSocket } from './useWebSocket';
import type {
  RealtimeAnalyticsState,
  VoiceTelemetryEvent,
  VoiceStageStatusEvent,
  TranscriptPartial,
  TranscriptFinal,
  AnalyticsSummaryEvent,
  StageType,
  StageStatus,
  StageTelemetry,
} from '@shared/voiceAnalytics';

/**
 * VoiceHandshakeStore - Module-level singleton to persist handshake state across HMR
 * This prevents Fast Refresh from breaking active voice sessions during development
 */
interface VoiceHandshakeState {
  pendingStream: MediaStream | null;
  pendingAudioConfig: { format: 'webm-opus' | 'pcm16'; sampleRate: number; channels: number } | null;
  pendingStartToken: number;
  pendingTokenForStream: number | null;
  isStarting: boolean;
  sessionId: string | null;
}

const STORE_KEY = '__voicely_handshake_store__';

class VoiceHandshakeStore {
  private store: Map<string, VoiceHandshakeState>;

  constructor() {
    // Initialize or reuse existing store from globalThis
    if (!(globalThis as any)[STORE_KEY]) {
      (globalThis as any)[STORE_KEY] = new Map<string, VoiceHandshakeState>();
    }
    this.store = (globalThis as any)[STORE_KEY];
  }

  private getKey(agentId: string, voiceId?: string): string {
    return `${agentId}:${voiceId || 'default'}`;
  }

  get(agentId: string, voiceId?: string): VoiceHandshakeState {
    const key = this.getKey(agentId, voiceId);
    if (!this.store.has(key)) {
      this.store.set(key, {
        pendingStream: null,
        pendingAudioConfig: null,
        pendingStartToken: 0,
        pendingTokenForStream: null,
        isStarting: false,
        sessionId: null,
      });
    }
    return this.store.get(key)!;
  }

  set(agentId: string, voiceId: string | undefined, updates: Partial<VoiceHandshakeState>): void {
    const key = this.getKey(agentId, voiceId);
    const current = this.get(agentId, voiceId);
    this.store.set(key, { ...current, ...updates });
  }

  clear(agentId: string, voiceId?: string): void {
    const key = this.getKey(agentId, voiceId);
    const state = this.get(agentId, voiceId);
    // Stop any pending stream tracks
    if (state.pendingStream) {
      state.pendingStream.getTracks().forEach(track => track.stop());
    }
    this.store.delete(key);
  }
}

const handshakeStore = new VoiceHandshakeStore();

/**
 * MicController - Manages microphone state for natural interruptions
 * Uses browser echo cancellation instead of hard muting for seamless conversation
 * Note: Browser's built-in echo cancellation prevents feedback loops
 */
class MicController {
  private stream: MediaStream | null = null;
  private isPcmMode: boolean = false;

  constructor() {}

  /**
   * Initialize with microphone stream
   */
  setStream(stream: MediaStream, isPcmMode: boolean = false) {
    this.stream = stream;
    this.isPcmMode = isPcmMode;
    console.log('[MIC_CTRL] Initialized with stream, PCM mode:', isPcmMode);
    console.log('[MIC_CTRL] Echo cancellation enabled - mic stays active for interruptions');
  }

  /**
   * Cleanup and reset controller
   */
  cleanup() {
    this.stream = null;
    this.isPcmMode = false;
    console.log('[MIC_CTRL] Cleaned up');
  }
}

export interface TranscriptEntry {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: Date;
  isFinal?: boolean;
}

export interface VoiceChatState {
  isActive: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
  hasAgentSpoken: boolean; // True after first agent output (prevents "listening" before greeting)
  transcript: TranscriptEntry[];
  error: string | null;
  sessionId: string | null;
  // Real-time Analytics
  analytics: RealtimeAnalyticsState | null;
  // Quick-reply suggestions
  suggestions: string[];
}

export interface UseVoiceChatOptions {
  agentId: string;
  voiceId?: string;
  inlineConfig?: {
    systemPrompt?: string;
    personality?: string;
    voiceId?: string;
    greeting?: string;
  };
  onTranscript?: (entry: TranscriptEntry) => void;
  onTransfer?: (targetAgentId: string, targetAgentName: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceChat(options: UseVoiceChatOptions) {
  const { agentId, voiceId, inlineConfig, onTranscript, onTransfer, onError } = options;
  const { socket, isConnected } = useWebSocket();
  
  const [state, setState] = useState<VoiceChatState>({
    isActive: false,
    isRecording: false,
    isSpeaking: false,
    hasAgentSpoken: false,
    transcript: [],
    error: null,
    sessionId: null,
    analytics: null,
    suggestions: [],
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Uint8Array[][]>([]);
  const currentAudioChunksRef = useRef<Uint8Array[]>([]);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioDeviceIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const hasInterimRef = useRef(false);
  const isEndingRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const audioUnlockedRef = useRef(false);
  const persistentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // iOS Safari fallback - Web Audio API refs
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isPcmModeRef = useRef(false);
  
  // CRITICAL: Initialize refs directly from store (not in useEffect!)
  // This prevents the refs from being reset to 0 after session starts
  const storedState = handshakeStore.get(agentId, voiceId);
  
  // Pending stream storage and session state - hold stream until sessionId is received
  // Initialize from store to survive HMR
  const pendingStreamRef = useRef<MediaStream | null>(storedState.pendingStream);
  const pendingAudioConfigRef = useRef<{ format: 'webm-opus' | 'pcm16'; sampleRate: number; channels: number } | null>(storedState.pendingAudioConfig);
  const pendingStartTokenRef = useRef<number>(storedState.pendingStartToken);
  const pendingTokenForStreamRef = useRef<number | null>(storedState.pendingTokenForStream);
  const isStartingRef = useRef(storedState.isStarting);
  const sessionIdRef = useRef<string | null>(storedState.sessionId);
  
  // Microphone controller - prevents feedback loops by muting mic during agent speech
  const micControllerRef = useRef<MicController>(new MicController());
  
  // Log rehydration for debugging
  useEffect(() => {
    console.log('[VOICE] Initialized from store:', {
      token: storedState.pendingStartToken,
      tokenForStream: storedState.pendingTokenForStream,
      hasStream: !!storedState.pendingStream,
      isStarting: storedState.isStarting,
      sessionId: storedState.sessionId,
    });
  }, []); // Only log once on mount
  
  // Helper to sync refs to store (called after updates)
  // Note: Don't use useCallback - we want this to always use current agentId/voiceId
  const syncToStore = () => {
    handshakeStore.set(agentId, voiceId, {
      pendingStream: pendingStreamRef.current,
      pendingAudioConfig: pendingAudioConfigRef.current,
      pendingStartToken: pendingStartTokenRef.current,
      pendingTokenForStream: pendingTokenForStreamRef.current,
      isStarting: isStartingRef.current,
      sessionId: sessionIdRef.current,
    });
    console.log('[VOICE] Synced to store - token:', pendingStartTokenRef.current, 'tokenForStream:', pendingTokenForStreamRef.current);
  };

  // CRITICAL iOS Fix: Use microphone permission to unlock audio (industry standard)
  // iOS Safari unlocks audio context when getUserMedia() is granted
  // This is more reliable than silent audio playback
  const unlockAudioWithMicrophone = useCallback(async (): Promise<MediaStream | null> => {
    if (audioUnlockedRef.current && pendingStreamRef.current) {
      console.log('[AUDIO] Already unlocked with active stream');
      return pendingStreamRef.current;
    }

    console.log('[AUDIO] Unlocking audio via microphone permission (iOS Safari compatible)...');
    
    try {
      // SYNCHRONOUS: Create AudioContext in user gesture
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('[AUDIO] Created AudioContext:', audioContextRef.current.state);
      }
      
      // SYNCHRONOUS: Create persistent audio element for playback
      if (!persistentAudioRef.current) {
        const audio = new Audio();
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        audio.preload = 'auto';
        persistentAudioRef.current = audio;
        document.body.appendChild(audio);
        console.log('[AUDIO] Created persistent audio element');
      }
      
      // CRITICAL: Request microphone SYNCHRONOUSLY in user gesture
      // This unlocks audio playback on iOS Safari
      console.log('[AUDIO] Requesting microphone access...');
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1,
        },
        video: false,
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[AUDIO] ✅ Microphone granted!');
      
      // Resume AudioContext (now that we have user gesture via mic permission)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('[AUDIO] ✅ AudioContext resumed');
      }
      
      // Mark as unlocked
      audioUnlockedRef.current = true;
      console.log('[AUDIO] ✅ Audio unlocked via microphone permission');
      
      return stream;
      
    } catch (error: any) {
      console.error('[AUDIO] ❌ Microphone permission denied or failed:', error?.message || error);
      console.error('[AUDIO] Error:', { name: error?.name, message: error?.message });
      
      // User denied microphone - provide helpful message
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return null; // Caller will show appropriate error
      }
      
      return null;
    }
  }, []);

  // Start voice session (with optional text-only mode)
  const startSession = useCallback(async (textOnly: boolean = false) => {
    console.log('[VOICE] ===== START SESSION CALLED =====');
    console.log('[VOICE] Socket connected:', !!socket, 'isConnected:', isConnected);
    console.log('[VOICE] textOnly:', textOnly);
    
    // SINGLE-FLIGHT GUARD: Prevent multiple simultaneous session starts
    if (isStartingRef.current) {
      console.log('[VOICE] ⚠️ Session already starting, ignoring duplicate call');
      return;
    }
    
    if (!socket || !isConnected) {
      const errorMsg = 'Please wait for connection to establish';
      console.error('[VOICE] ❌ Cannot start - not connected!');
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
      return;
    }

    isStartingRef.current = true;
    
    // Generate unique token for this start attempt
    const startToken = ++pendingStartTokenRef.current;
    syncToStore(); // Sync AFTER incrementing token to survive HMR
    console.log('[VOICE] Starting session for agent:', agentId, 'with token:', startToken);

    try {
      let stream: MediaStream | null = null;

      // Detect audio format and sample rate BEFORE starting session
      let audioFormat: 'webm-opus' | 'pcm16' | undefined;
      let actualSampleRate = 16000;
      let actualChannels = 1;

      // CRITICAL iOS Fix: Request microphone first (unlocks audio on iOS Safari)
      if (!textOnly) {
        try {
          console.log('[VOICE] Requesting microphone to unlock audio...');
          
          // This function requests mic and unlocks audio context (iOS Safari compatible)
          stream = await unlockAudioWithMicrophone();
          
          if (!stream) {
            const errorMsg = 'Microphone permission denied. Please allow microphone access to use voice chat.';
            console.error('[VOICE] ❌ Microphone permission denied');
            setState(prev => ({ ...prev, error: errorMsg }));
            onError?.(errorMsg);
            return;
          }
          
          console.log('[VOICE] ✅ Microphone granted and audio unlocked!');
          
          // Capture audio device ID for output routing (Bluetooth AirPods support)
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack) {
            const settings = audioTrack.getSettings();
            if (settings.deviceId) {
              audioDeviceIdRef.current = settings.deviceId;
              console.log('[VOICE] Audio device ID captured:', settings.deviceId);
            }
          }

          // CRITICAL FIX: Force PCM16 format for ALL systems
          // WebM Opus from MediaRecorder produces silent/corrupted audio that Deepgram cannot transcribe
          // PCM16 via Web Audio API is universally compatible with Deepgram's STT
          audioFormat = 'pcm16';
          
          // CRITICAL: Detect browser's actual sample rate and tell Deepgram the TRUTH
          // macOS often uses 48kHz - we MUST tell Deepgram or it will hear garbled noise!
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const tempContext = new AudioContextClass();
          actualSampleRate = tempContext.sampleRate; // Use ACTUAL rate, don't force 16kHz!
          actualChannels = 1;
          
          console.log(`[VOICE] ⚠️ CRITICAL: Browser AudioContext running at ${actualSampleRate}Hz (NOT forced 16kHz)`);
          console.log(`[VOICE] Deepgram will be told the CORRECT rate: ${actualSampleRate}Hz`);
          
          // Close temporary context - we'll create a new one later
          await tempContext.close();
        } catch (micError: any) {
          console.warn('[VOICE] Microphone access failed, falling back to text-only mode:', micError);
          
          // Continue in text-only mode when mic fails
          console.log('[VOICE] Continuing session in text-only mode (no voice input/output)');
          // stream remains null, audioFormat remains undefined
        }
      }

      // Store stream and config in pending refs - recording will start when sessionId arrives
      if (stream && audioFormat) {
        pendingStreamRef.current = stream;
        pendingAudioConfigRef.current = {
          format: audioFormat,
          sampleRate: actualSampleRate,
          channels: actualChannels,
        };
        pendingTokenForStreamRef.current = startToken; // Associate token with this stream
        
        // CRITICAL: Sync to global store IMMEDIATELY after setting token
        // This must happen BEFORE emit to ensure store is ready when session-started arrives
        syncToStore();
        
        // Initialize MicController with stream (enables feedback prevention)
        const isPcmMode = audioFormat === 'pcm16';
        micControllerRef.current.setStream(stream, isPcmMode);
        
        console.log('[VOICE] Stream and config stored with token:', startToken, 'waiting for sessionId...');
      }

      // Emit start session event with detected audio format and sample rate
      console.log('[VOICE] Emitting voice:start-session with audioFormat:', audioFormat, 'sampleRate:', actualSampleRate);
      socket.emit('voice:start-session', { 
        agentId, 
        voiceId, 
        inlineConfig,
        audioFormat,
        sampleRate: actualSampleRate,
        channels: actualChannels,
      });

      // Don't set isActive yet - wait for voice:session-started event
      // BUT: Keep isStartingRef true until session-started arrives (prevents HMR cleanup)
      setState(prev => ({ 
        ...prev, 
        error: null,
      }));
      
      // NOTE: isStartingRef stays true until session-started handler sets it to false
      console.log('[VOICE] Start event emitted, waiting for session-started (isStartingRef: true)');

      // Recording setup moved to voice:session-started handler to ensure sessionId exists
      // This prevents sending audio chunks with sessionId=null
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to start session';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
      isStartingRef.current = false; // Release guard on error
      syncToStore(); // Sync after error cleanup
    }
  }, [socket, isConnected, agentId, voiceId, inlineConfig, onError, unlockAudioWithMicrophone]);

  // Complete cleanup of all audio resources
  const cleanupAudioResources = useCallback(() => {
    console.log('[VOICE] Cleaning up audio resources');
    
    // Stop and clear MediaRecorder
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.requestData();
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      } catch (error) {
        console.error('Error stopping media recorder:', error);
      }
    }

    // Clean up Web Audio API nodes (iOS Safari fallback)
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current.onaudioprocess = null;
        scriptProcessorRef.current = null;
      } catch (error) {
        console.error('Error stopping script processor:', error);
      }
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current.mediaStream.getTracks().forEach(track => track.stop());
        sourceNodeRef.current = null;
      } catch (error) {
        console.error('Error stopping source node:', error);
      }
    }

    if (audioWorkletNodeRef.current) {
      try {
        audioWorkletNodeRef.current.disconnect();
        audioWorkletNodeRef.current = null;
      } catch (error) {
        console.error('Error stopping audio worklet:', error);
      }
    }

    // Stop currently playing audio element
    if (currentAudioElementRef.current) {
      try {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current.src = '';
        // Don't destroy persistent audio element - keep for reuse
        if (currentAudioElementRef.current !== persistentAudioRef.current) {
          currentAudioElementRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping audio element:', error);
      }
    }

    // Stop legacy audio source (if any)
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
        currentSourceRef.current = null;
      } catch (error) {
        console.error('Error stopping audio source:', error);
      }
    }

    // Close AudioContext
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
      } catch (error) {
        console.error('Error closing AudioContext:', error);
      }
    }

    // Clear audio queues
    audioQueueRef.current = [];
    currentAudioChunksRef.current = [];
    isPlayingRef.current = false;
    hasInterimRef.current = false;
    
    // Cleanup MicController
    micControllerRef.current.cleanup();
  }, []);

  // End voice session
  const endSession = useCallback(() => {
    console.log('[VOICE] Ending session:', sessionIdRef.current || '(pending)');
    isEndingRef.current = true;
    
    // Increment token to invalidate any pending handshakes
    pendingStartTokenRef.current++;
    console.log('[VOICE] Bumped token to invalidate pending handshakes:', pendingStartTokenRef.current);
    
    // Clean up pending stream if exists (handshake not yet complete)
    if (pendingStreamRef.current) {
      console.log('[VOICE] Stopping pending stream tracks');
      pendingStreamRef.current.getTracks().forEach(track => track.stop());
      pendingStreamRef.current = null;
    }
    pendingAudioConfigRef.current = null;
    pendingTokenForStreamRef.current = null; // Clear token association
    isStartingRef.current = false;
    
    // Sync to global store (survives HMR)
    syncToStore();

    // Send end session event
    if (socket && sessionIdRef.current) {
      socket.emit('voice:end-session', { sessionId: sessionIdRef.current });
    }

    // Complete audio cleanup
    cleanupAudioResources();

    // Clear session ID after a brief delay to ensure late-arriving transcript events are still processed
    setTimeout(() => {
      if (isEndingRef.current) {
        sessionIdRef.current = null;
        isEndingRef.current = false;
        syncToStore(); // Sync after delayed cleanup
      }
    }, 200);

    // Clear state immediately (synchronously) - especially transcript to prevent duplicates
    setState(prev => ({ 
      ...prev, 
      isActive: false, 
      isRecording: false,
      isSpeaking: false,
      sessionId: null,
      transcript: [], // Clear transcript immediately to prevent duplicates across sessions
      error: null, // Clear any errors when ending session
    }));
  }, [socket, cleanupAudioResources]);

  // Play complete audio response (all chunks combined)
  const playAudioResponse = useCallback(async (audioChunks: Uint8Array[]) => {
    if (audioChunks.length === 0) {
      console.log('[AUDIO] No chunks to play');
      isPlayingRef.current = false;
      // If no audio, don't pause mic - just process next in queue
      processAudioQueue();
      return;
    }

    console.log('[AUDIO] Starting playback of', audioChunks.length, 'chunks');

    try {
      // Combine all chunks into single buffer
      const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of audioChunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // Create audio blob with proper MIME type
      const audioBlob = new Blob([combined], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Reuse persistent audio element (created during unlock) for iOS Safari
      const audio = persistentAudioRef.current || new Audio();
      audio.src = audioUrl;
      if (audio !== persistentAudioRef.current) {
        audio.setAttribute('playsinline', ''); // Ensure playsinline for new elements
      }
      currentAudioElementRef.current = audio;
      
      // Route to specific audio device if available (AirPods, Bluetooth headphones)
      if (audioDeviceIdRef.current && 'setSinkId' in audio) {
        try {
          await (audio as any).setSinkId(audioDeviceIdRef.current);
          console.log('[AUDIO] Routed to device:', audioDeviceIdRef.current);
        } catch (err) {
          console.warn('[AUDIO] Could not set sink device, using default:', err);
        }
      }
      
      setState(prev => ({ ...prev, isSpeaking: true }));
      
      // Handle playback end
      audio.onended = async () => {
        URL.revokeObjectURL(audioUrl);
        currentAudioElementRef.current = null;
        setState(prev => ({ ...prev, isSpeaking: false }));
        isPlayingRef.current = false;
        
        // CRITICAL FIX: Resume AudioContext after playback to ensure microphone stays active
        // Some browsers suspend the AudioContext after playing audio which kills mic input
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
            console.log('[AUDIO] ✅ Resumed AudioContext after playback - mic should be active');
          } catch (resumeError) {
            console.warn('[AUDIO] Could not resume AudioContext after playback:', resumeError);
          }
        }
        
        // CRITICAL FIX: Use sessionIdRef.current (always current) instead of state.sessionId (stale closure)
        // This was causing conversations to stop after 2-3 exchanges because playback-finished wasn't being sent
        const currentSessionId = sessionIdRef.current;
        if (socket && currentSessionId) {
          console.log('[VOICE] ✅ Playback finished, notifying server:', currentSessionId);
          socket.emit('voice:playback-finished', { sessionId: currentSessionId });
        } else {
          console.warn('[VOICE] ⚠️ Cannot notify server - missing socket or sessionId:', { hasSocket: !!socket, sessionId: currentSessionId });
        }
        
        processAudioQueue();
      };
      
      audio.onerror = async (err) => {
        console.error('[AUDIO] Playback error:', err);
        URL.revokeObjectURL(audioUrl);
        currentAudioElementRef.current = null;
        
        // Don't show error if session is ending (normal cleanup scenario)
        if (!isEndingRef.current) {
          setState(prev => ({ ...prev, isSpeaking: false, error: 'Audio playback failed' }));
        } else {
          setState(prev => ({ ...prev, isSpeaking: false }));
        }
        
        isPlayingRef.current = false;
        
        // Resume AudioContext to keep mic active
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
            console.log('[AUDIO] ✅ Resumed AudioContext after error');
          } catch (resumeError) {
            console.warn('[AUDIO] Could not resume AudioContext:', resumeError);
          }
        }
        
        // CRITICAL FIX: Use sessionIdRef.current to ensure we always notify server
        const currentSessionId = sessionIdRef.current;
        if (socket && currentSessionId) {
          console.log('[VOICE] Playback error, notifying server:', currentSessionId);
          socket.emit('voice:playback-finished', { sessionId: currentSessionId });
        }
        
        processAudioQueue();
      };
      
      // Resume AudioContext before playing (critical for iOS Safari)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log('[AUDIO] Resumed AudioContext before playback');
        } catch (resumeError) {
          console.warn('[AUDIO] Could not resume AudioContext:', resumeError);
        }
      }
      
      // Start playback with autoplay error handling
      try {
        await audio.play();
        console.log('[AUDIO] Playback started successfully');
      } catch (playError: any) {
        console.error('[AUDIO] Autoplay blocked or failed:', playError);
        // Handle autoplay blocking
        if (playError.name === 'NotAllowedError' || playError.name === 'NotSupportedError') {
          console.warn('[AUDIO] Autoplay blocked - trying to resume AudioContext:', playError);
          
          // Audio should already be unlocked (via mic permission), just try resuming
          try {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
              console.log('[AUDIO] Resumed AudioContext, retrying playback...');
            }
            await audio.play();
            console.log('[AUDIO] ✅ Playback started after resume');
            return;  // Success - return early
          } catch (retryError) {
            console.error('[AUDIO] ❌ Playback still failed after resume:', retryError);
            // Show error to user
            URL.revokeObjectURL(audioUrl);
            currentAudioElementRef.current = null;
            setState(prev => ({ 
              ...prev, 
              isSpeaking: false, 
              error: 'Audio playback blocked. Tap screen to enable audio.' 
            }));
            isPlayingRef.current = false;
            
            // CRITICAL FIX: Use sessionIdRef.current to ensure we always notify server
            const currentSessionId = sessionIdRef.current;
            if (socket && currentSessionId) {
              console.log('[VOICE] Autoplay retry failed, notifying server:', currentSessionId);
              socket.emit('voice:playback-finished', { sessionId: currentSessionId });
            }
            
            onError?.('Tap screen to enable audio');
            processAudioQueue();
          }
        } else {
          throw playError;
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      currentAudioElementRef.current = null;
      setState(prev => ({ ...prev, isSpeaking: false }));
      isPlayingRef.current = false;
      processAudioQueue();
    }
  }, []);

  // Stop current audio playback and clear queue (for interruptions)
  const stopCurrentPlayback = useCallback(async () => {
    console.log('[INTERRUPTION] Stopping current playback');
    
    // Stop current audio element
    if (currentAudioElementRef.current) {
      try {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current.currentTime = 0;
        console.log('[INTERRUPTION] Stopped audio element');
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
    
    // Clear all queued audio
    audioQueueRef.current = [];
    currentAudioChunksRef.current = [];
    isPlayingRef.current = false;
    
    setState(prev => ({ ...prev, isSpeaking: false }));
    console.log('[INTERRUPTION] Cleared audio queue and reset state');
    
    // CRITICAL FIX: Resume AudioContext after interruption to ensure mic stays active
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('[INTERRUPTION] ✅ Resumed AudioContext after interruption - mic active');
      } catch (resumeError) {
        console.warn('[INTERRUPTION] Could not resume AudioContext:', resumeError);
      }
    }
    
    // CRITICAL FIX: Always emit playback-finished when stopping audio
    // This ensures the server clears its processing flag immediately
    if (socket && sessionIdRef.current) {
      console.log('[INTERRUPTION] Emitting playback-finished from stopCurrentPlayback');
      socket.emit('voice:playback-finished', { sessionId: sessionIdRef.current });
    }
  }, [socket]);

  // Pause session - Stop agent audio playback without ending session
  const pauseSession = useCallback(() => {
    console.log('[VOICE] Pausing agent audio');
    stopCurrentPlayback();
    
    // Update UI state
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, [stopCurrentPlayback]);

  // Stop session - Alias for endSession with clearer naming
  const stopSession = useCallback(() => {
    console.log('[VOICE] Stopping session (alias for endSession)');
    endSession();
  }, [endSession]);

  // Process audio queue - plays next queued response
  const processAudioQueue = useCallback(() => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    const nextChunks = audioQueueRef.current.shift()!;
    playAudioResponse(nextChunks);
  }, [playAudioResponse]);

  // Cleanup when component unmounts (NOT when agentId/voiceId changes)
  useEffect(() => {
    return () => {
      // Only cleanup on unmount, not on agent change
      console.log('[VOICE] Component unmounting, cleaning up resources');
      
      // If a session is active OR starting, use stopSession for orderly cleanup
      if (isStartingRef.current || sessionIdRef.current) {
        console.log('[VOICE] Ending active session on unmount');
        endSession();
        return;
      }
      
      // Inline cleanup of all audio resources
      if (mediaRecorderRef.current) {
        try {
          if (mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.requestData();
            mediaRecorderRef.current.stop();
          }
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
        } catch (error) {
          console.error('Error stopping media recorder:', error);
        }
      }

      if (currentAudioElementRef.current) {
        try {
          currentAudioElementRef.current.pause();
          currentAudioElementRef.current.src = '';
          currentAudioElementRef.current = null;
        } catch (error) {
          console.error('Error stopping audio element:', error);
        }
      }

      if (currentSourceRef.current) {
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
          currentSourceRef.current = null;
        } catch (error) {
          console.error('Error stopping audio source:', error);
        }
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
          audioContextRef.current = null;
        } catch (error) {
          console.error('Error closing AudioContext:', error);
        }
      }

      audioQueueRef.current = [];
      currentAudioChunksRef.current = [];
      isPlayingRef.current = false;
      hasInterimRef.current = false;
      
      // Clear session ID
      sessionIdRef.current = null;
      isEndingRef.current = false;
      syncToStore(); // Sync after cleanup
      
      // Clear mic controller
      micControllerRef.current.cleanup();
    };
  }, []); // Only cleanup on unmount, not on agent/voice changes

  // Listen to WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Session started - now start recording
    socket.on('voice:session-started', async (data: { sessionId: string }) => {
      console.log('[VOICE] Session started event received, sessionId:', data.sessionId);
      
      // CRITICAL: Read from store instead of refs to get latest values
      // Refs might be stale if component remounted after starting session
      const storeState = handshakeStore.get(agentId, voiceId);
      const currentPendingToken = storeState.pendingTokenForStream;
      const latestToken = storeState.pendingStartToken;
      const hasPendingStream = !!storeState.pendingStream;
      
      console.log('[VOICE] Token validation - pending:', currentPendingToken, 'latest:', latestToken);
      
      // Ignore if no pending stream (handshake cancelled)
      if (!hasPendingStream) {
        console.log('[VOICE] ⚠️ Ignoring stale session-started - no pending stream');
        return;
      }
      
      // Ignore if token mismatch (this is a response to an old start attempt)
      if (currentPendingToken !== latestToken) {
        console.log('[VOICE] ⚠️ Ignoring stale session-started - token mismatch (old session)');
        // Don't clean up stream - it belongs to the new attempt
        return;
      }
      
      // NOW update refs from store to ensure they're in sync
      pendingStreamRef.current = storeState.pendingStream;
      pendingAudioConfigRef.current = storeState.pendingAudioConfig;
      pendingStartTokenRef.current = storeState.pendingStartToken;
      pendingTokenForStreamRef.current = storeState.pendingTokenForStream;
      isStartingRef.current = storeState.isStarting;
      
      // CRITICAL: Reset isEndingRef immediately to prevent delayed cleanup from endSession
      // from nulling out this new sessionId if rapid end/start cycles occur
      isEndingRef.current = false;
      
      const oldSessionId = sessionIdRef.current;
      sessionIdRef.current = data.sessionId;
      syncToStore(); // Sync immediately after setting sessionId
      
      // CRITICAL: Clear transcript immediately when new session starts
      // This prevents old messages from previous agent sessions from bleeding through
      if (oldSessionId !== data.sessionId) {
        setState(prev => ({ ...prev, transcript: [] }));
        hasInterimRef.current = false;
      }
      
      // Initialize analytics state
      const now = new Date().toISOString();
      const initialAnalytics: RealtimeAnalyticsState = {
        sessionId: data.sessionId,
        startedAt: now,
        durationSeconds: 0,
        stageStatus: {
          deepgram: 'idle',
          deepseek: 'idle',
          elevenlabs: 'idle',
        },
        aiSpeaking: false,
        userSpeaking: false,
        transcriptPartials: [],
        transcriptFinals: [],
        latencyByStage: {
          deepgram: [],
          deepseek: [],
          elevenlabs: [],
        },
        confidenceByStage: {
          deepgram: [],
          deepseek: [],
          elevenlabs: [],
        },
        talkListenRatio: {
          userSeconds: 0,
          agentSeconds: 0,
        },
        interruptionCount: 0,
        audioWaveform: [],
      };
      
      setState(prev => ({ 
        ...prev, 
        isActive: true,  // NOW we can set isActive - session is confirmed
        sessionId: data.sessionId,
        hasAgentSpoken: false, // Reset - agent hasn't spoken yet in this new session
        analytics: initialAnalytics,
      }));
      
      // Release single-flight guard - session successfully started
      isStartingRef.current = false;
      console.log('[VOICE] Session started successfully, isStartingRef set to false');
      
      // Acknowledge client is ready - server can now send greeting
      console.log('[VOICE] Client ready, acking to server:', data.sessionId);
      socket.emit('voice:client-ready', { sessionId: data.sessionId });
      
      // NOW start recording with the pending stream (sessionId is guaranteed to exist)
      const pendingStream = pendingStreamRef.current;
      const pendingConfig = pendingAudioConfigRef.current;
      
      if (pendingStream && pendingConfig) {
        console.log('[VOICE] Starting recording with sessionId:', data.sessionId);
        
        if (pendingConfig.format === 'webm-opus') {
          // MediaRecorder for Chrome/Firefox
          mediaRecorderRef.current = new MediaRecorder(pendingStream, {
            mimeType: 'audio/webm;codecs=opus',
          });

          let chunkCount = 0;
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0 && socket && sessionIdRef.current) {
              chunkCount++;
              // Log first chunk details for debugging
              if (chunkCount === 1) {
                event.data.arrayBuffer().then(buf => {
                  const bytes = new Uint8Array(buf);
                  const headerBytes = Array.from(bytes.slice(0, 4));
                  const header = String.fromCharCode(...headerBytes);
                  console.log('[VOICE] ⚡ FIRST CHUNK - size:', event.data.size, 'type:', event.data.type, 'header:', header);
                  
                  // Re-encode for sending (since we consumed the buffer)
                  const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
                  socket.emit('voice:audio-chunk', {
                    sessionId: sessionIdRef.current,
                    chunk: base64,
                    format: 'webm-opus',
                  });
                });
                return;
              }
              
              console.log('[VOICE] Sending audio chunk:', event.data.size, 'bytes');
              event.data.arrayBuffer().then(buffer => {
                const uint8Array = new Uint8Array(buffer);
                const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
                
                socket.emit('voice:audio-chunk', {
                  sessionId: sessionIdRef.current,
                  chunk: base64,
                  format: 'webm-opus',
                });
              });
            } else {
              console.log('[VOICE] Skipping empty audio chunk');
            }
          };

          // Add error handlers
          mediaRecorderRef.current.onerror = (event) => {
            console.error('[VOICE] MediaRecorder error:', event);
            setState(prev => ({ ...prev, error: 'Microphone recording failed' }));
          };
          
          mediaRecorderRef.current.onstart = () => {
            console.log('[VOICE] MediaRecorder started successfully');
            setState(prev => ({ ...prev, isRecording: true }));
          };
          
          mediaRecorderRef.current.onstop = () => {
            console.log('[VOICE] MediaRecorder stopped');
          };
          
          // Verify stream is active
          const audioTracks = pendingStream.getAudioTracks();
          if (audioTracks.length === 0) {
            console.error('[VOICE] No audio tracks in stream!');
            setState(prev => ({ ...prev, error: 'No audio input detected' }));
            return;
          }
          
          console.log('[VOICE] Audio tracks:', audioTracks.map(t => ({ 
            label: t.label, 
            enabled: t.enabled, 
            muted: t.muted,
            readyState: t.readyState 
          })));
          
          mediaRecorderRef.current.start(40); // ZERO-LAG: 40ms chunks for instant transmission (was 100ms)
          console.log('[VOICE] MediaRecorder start() called with 40ms chunks');
          
        } else {
          // Web Audio API for PCM (all browsers)
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!audioContextRef.current) {
            // CRITICAL: Use AudioContext's default sample rate (browser decides: 44.1kHz or 48kHz on Mac)
            // Deepgram will be told the ACTUAL rate - no resampling needed!
            audioContextRef.current = new AudioContextClass();
            console.log(`[VOICE] AudioContext created at ${audioContextRef.current.sampleRate}Hz (browser default)`);
          }
          
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          
          sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(pendingStream);
          
          const bufferSize = 4096; // Increased from 1024 to prevent iOS Safari underruns/crackling
          scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);
          
          let chunkCounter = 0;
          scriptProcessorRef.current.onaudioprocess = (e) => {
            if (!sessionIdRef.current || !socket) return;
            
            const inputData = e.inputBuffer.getChannelData(0);
            const length = inputData.length;
            
            // DIAGNOSTIC: Check if microphone is picking up any sound
            chunkCounter++;
            if (chunkCounter % 50 === 0) { // Log every 50 chunks (~2 seconds)
              const maxVolume = Math.max(...Array.from(inputData).map(Math.abs));
              const avgVolume = Array.from(inputData).reduce((sum, val) => sum + Math.abs(val), 0) / length;
              console.log(`[PCM16] Audio level check - Max: ${(maxVolume * 100).toFixed(2)}%, Avg: ${(avgVolume * 100).toFixed(2)}%`);
              
              if (maxVolume < 0.001) {
                console.warn('[PCM16] ⚠️ MICROPHONE IS SILENT! Check System Settings → Sound → Input volume');
              }
            }
            
            const pcmBuffer = new ArrayBuffer(length * 2);
            const dataView = new DataView(pcmBuffer);
            
            for (let i = 0, offset = 0; i < length; i++, offset += 2) {
              let sample = inputData[i];
              sample = sample > 1.0 ? 1.0 : sample < -1.0 ? -1.0 : sample;
              const int16Value = (sample * (sample < 0 ? 32768 : 32767)) | 0;
              dataView.setInt16(offset, int16Value, true);
            }
            
            const bytes = new Uint8Array(pcmBuffer);
            const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
            
            socket.emit('voice:audio-chunk', {
              sessionId: sessionIdRef.current,
              chunk: base64,
              format: 'pcm16',
              sampleRate: audioContextRef.current?.sampleRate || 48000, // CRITICAL: Send ACTUAL rate!
              channels: 1,
            });
          };
          
          sourceNodeRef.current.connect(scriptProcessorRef.current);
          scriptProcessorRef.current.connect(audioContextRef.current.destination);
          
          setState(prev => ({ ...prev, isRecording: true }));
          console.log('[VOICE] PCM audio pipeline started');
        }
        
        // Clear pending refs after successful setup
        pendingStreamRef.current = null;
        pendingAudioConfigRef.current = null;
        pendingTokenForStreamRef.current = null;
        console.log('[VOICE] Cleared pending stream refs after successful setup');
        
        // Sync to global store (survives HMR)
        syncToStore();
      } else {
        console.log('[VOICE] No pending stream - text-only mode');
      }
    });

    // Transcript received
    socket.on('voice:transcript', (data: { sessionId: string; speaker: string; text: string; isFinal: boolean }) => {
      console.log('[TRANSCRIPT] Received:', {
        speaker: data.speaker,
        text: data.text?.substring(0, 50) + (data.text?.length > 50 ? '...' : ''),
        isFinal: data.isFinal,
        sessionMatch: data.sessionId === sessionIdRef.current
      });

      // Guard: Ignore transcript updates if session doesn't match current session
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) {
        console.log('[TRANSCRIPT] Ignoring - session mismatch');
        return;
      }

      // TRANSFER DETECTION: Check for [TRANSFER:agent-id] pattern in agent responses
      let textToDisplay = data.text;
      if (data.speaker === 'assistant' && data.isFinal && data.text) {
        const transferMatch = data.text.match(/\[TRANSFER:(demo-\w+-agent)\]/);
        if (transferMatch && onTransfer) {
          const targetAgentId = transferMatch[1];
          const agentNames: Record<string, string> = {
            'demo-sales-agent': 'Sarah',
            'demo-followup-agent': 'Maya',
            'demo-support-agent': 'Alice',
            'demo-receptionist-agent': 'Emma',
          };
          const targetAgentName = agentNames[targetAgentId] || targetAgentId;
          
          console.log('[TRANSFER] Detected transfer to:', targetAgentId, targetAgentName);
          
          // Remove the transfer command from the displayed text
          textToDisplay = data.text.replace(/\[TRANSFER:[^\]]+\]\s*/g, '').trim();
          
          // Trigger transfer callback after a brief delay
          setTimeout(() => {
            onTransfer(targetAgentId, targetAgentName);
          }, 2000); // 2 second delay to let user see the message
        }
      }

      // Map server speaker values: 'user' stays 'user', 'assistant' becomes 'agent'
      const entry: TranscriptEntry = {
        speaker: data.speaker === 'user' ? 'user' : 'agent',
        text: textToDisplay,
        timestamp: new Date(),
        isFinal: data.isFinal,
      };

      // INTERRUPTION DETECTION: If user speaks while agent is talking, interrupt!
      if (entry.speaker === 'user' && isPlayingRef.current) {
        console.log('[INTERRUPTION] User interrupted agent:', entry.text);
        stopCurrentPlayback();
        // Signal server about interruption
        socket.emit('voice:user-interrupt', { sessionId: sessionIdRef.current });
        // CRITICAL FIX: Notify server that playback finished (even though interrupted)
        // This allows server to clear processing flag and accept new speech immediately
        console.log('[INTERRUPTION] Notifying server playback finished after interruption');
        socket.emit('voice:playback-finished', { sessionId: sessionIdRef.current });
      }

      setState(prev => {
        const updates: Partial<VoiceChatState> = {};
        
        // Set hasAgentSpoken to true on first agent message (greeting)
        if (entry.speaker === 'agent' && !prev.hasAgentSpoken) {
          updates.hasAgentSpoken = true;
        }
        
        if (data.isFinal) {
          // Add new final entry, remove interim if exists
          const newTranscript = hasInterimRef.current
            ? [...prev.transcript.slice(0, -1), entry]
            : [...prev.transcript, entry];
          hasInterimRef.current = false;
          console.log('[TRANSCRIPT] Added final entry, total count:', newTranscript.length);
          return { ...prev, ...updates, transcript: newTranscript };
        } else {
          // Replace interim entry or add new one
          const newTranscript = hasInterimRef.current
            ? [...prev.transcript.slice(0, -1), entry]
            : [...prev.transcript, entry];
          hasInterimRef.current = true;
          console.log('[TRANSCRIPT] Updated interim entry, total count:', newTranscript.length);
          return { ...prev, ...updates, transcript: newTranscript };
        }
      });

      onTranscript?.(entry);
    });

    // Audio chunk received - collect chunks for complete MP3 playback
    socket.on('voice:audio-chunk', (data: { sessionId: string; audioData: number[] }) => {
      // Guard: Ignore audio if session doesn't match current session
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) {
        return;
      }
      
      const audioData = new Uint8Array(data.audioData);
      currentAudioChunksRef.current.push(audioData);
    });

    // Audio complete - queue complete MP3 for playback
    socket.on('voice:audio-complete', (data: { sessionId: string }) => {
      // Guard: Ignore audio if session doesn't match current session
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) {
        return;
      }
      
      const chunks = currentAudioChunksRef.current;
      currentAudioChunksRef.current = [];
      
      console.log('[AUDIO] Complete - queuing', chunks.length, 'chunks for playback');
      
      if (chunks.length > 0) {
        audioQueueRef.current.push(chunks);
        processAudioQueue();
      }
    });

    // Error
    socket.on('voice:error', (data: { error: string }) => {
      setState(prev => ({ ...prev, error: data.error }));
      onError?.(data.error);
    });

    // Telemetry update - Real-time metrics from processing stages
    socket.on('voice:telemetry-update', (data: VoiceTelemetryEvent) => {
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) return;
      
      setState(prev => {
        if (!prev.analytics) return prev;
        
        const telemetry = data.telemetry;
        const stage = telemetry.stage;
        
        // Update latency (keep rolling window of last 50 data points)
        const updatedLatencies = [...prev.analytics.latencyByStage[stage], telemetry.latencyMs].slice(-50);
        
        // Update confidence if available (keep rolling window of last 50 data points)
        const updatedConfidences = telemetry.confidence !== null
          ? [...prev.analytics.confidenceByStage[stage], telemetry.confidence].slice(-50)
          : prev.analytics.confidenceByStage[stage];
        
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            latencyByStage: {
              ...prev.analytics.latencyByStage,
              [stage]: updatedLatencies,
            },
            confidenceByStage: {
              ...prev.analytics.confidenceByStage,
              [stage]: updatedConfidences,
            },
          },
        };
      });
    });

    // Stage status update - Track processing pipeline state
    socket.on('voice:stage-status', (data: VoiceStageStatusEvent) => {
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) return;
      
      setState(prev => {
        if (!prev.analytics) return prev;
        
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            stageStatus: {
              ...prev.analytics.stageStatus,
              [data.stage]: data.status,
            },
          },
        };
      });
    });

    // Analytics summary - Periodic comprehensive metrics update
    socket.on('voice:analytics-summary', (data: AnalyticsSummaryEvent) => {
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) return;
      
      setState(prev => {
        if (!prev.analytics) return prev;
        
        const summary = data.summary;
        
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            durationSeconds: summary.durationSeconds,
            talkListenRatio: summary.talkListenRatio,
            interruptionCount: summary.interruptionCount,
            conversionProbability: summary.conversionProbability,
            currentSentiment: summary.sentimentTrajectory.length > 0
              ? {
                  label: summary.sentimentTrajectory[summary.sentimentTrajectory.length - 1].label,
                  score: summary.sentimentTrajectory[summary.sentimentTrajectory.length - 1].score,
                  confidence: 0.8, // Default confidence
                }
              : prev.analytics.currentSentiment,
            currentIntent: summary.intentTimeline.length > 0
              ? {
                  label: summary.intentTimeline[summary.intentTimeline.length - 1].intent,
                  confidence: summary.intentTimeline[summary.intentTimeline.length - 1].confidence,
                }
              : prev.analytics.currentIntent,
          },
        };
      });
    });

    // Session ended - Clear analytics
    socket.on('voice:session-ended', (data: { sessionId: string }) => {
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) return;
      
      setState(prev => ({
        ...prev,
        analytics: null,
      }));
    });

    // Quick-reply suggestions received
    socket.on('voice:suggestions', (data: { sessionId: string; suggestions: string[] }) => {
      if (!sessionIdRef.current || data.sessionId !== sessionIdRef.current) return;
      
      setState(prev => ({
        ...prev,
        suggestions: data.suggestions,
      }));
    });

    return () => {
      socket.off('voice:session-started');
      socket.off('voice:transcript');
      socket.off('voice:audio-chunk');
      socket.off('voice:audio-complete');
      socket.off('voice:error');
      socket.off('voice:telemetry-update');
      socket.off('voice:stage-status');
      socket.off('voice:analytics-summary');
      socket.off('voice:session-ended');
      socket.off('voice:suggestions');
    };
  }, [socket, agentId, voiceId, onTranscript, onTransfer, onError, processAudioQueue]);

  // Send text message (for typing instead of speaking)
  const sendTextMessage = useCallback((text: string, generateAudio: boolean = true) => {
    if (!socket || !sessionIdRef.current) {
      console.error('[VOICE] Cannot send text message - no active session');
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    socket.emit('voice:text-message', {
      sessionId: sessionIdRef.current,
      text: trimmedText,
      generateAudio,
    });
  }, [socket]);

  // Reset transcript (for agent switching)
  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: [] }));
    hasInterimRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isActive) {
        endSession();
      }
    };
  }, []);

  // Send a suggestion as a quick response
  const sendSuggestion = useCallback((suggestion: string) => {
    // Use sendTextMessage to handle the suggestion - generates audio by default
    sendTextMessage(suggestion, true);
    // Clear suggestions after sending
    setState(prev => ({ ...prev, suggestions: [] }));
  }, [sendTextMessage]);

  return useMemo(() => ({
    ...state,
    startSession,
    endSession,
    pauseSession,
    stopSession,
    sendTextMessage,
    sendSuggestion,
    resetTranscript,
    isReady: isConnected && !!socket,
  }), [
    state,
    startSession,
    endSession,
    pauseSession,
    stopSession,
    sendTextMessage,
    sendSuggestion,
    resetTranscript,
    isConnected,
    socket,
  ]);
}
