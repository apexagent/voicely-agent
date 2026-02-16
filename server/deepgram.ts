import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { logger } from "./utils/logger";

// Initialize Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export interface TranscriptResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  speaker?: number;
}

export interface DeepgramStreamOptions {
  onTranscript: (result: TranscriptResult) => void;
  onUtteranceEnd?: (completeText: string) => void; // Fires only once per complete user turn
  onError?: (error: Error) => void;
  onClose?: () => void;
  onReconnect?: () => void; // Called when stream automatically reconnects
  // Audio format options for iOS Safari PCM fallback
  audioFormat?: 'webm-opus' | 'pcm16';
  sampleRate?: number;
  channels?: number;
}

/**
 * Create a live transcription stream for real-time speech-to-text
 */
export function createDeepgramStream(options: DeepgramStreamOptions) {
  const { onTranscript, onUtteranceEnd, onError, onClose, onReconnect, audioFormat = 'webm-opus', sampleRate = 16000, channels = 1 } = options;

  let connection: any = null;
  let chunkCount = 0;
  let isClosed = false;
  let isReconnecting = false;
  let reconnectAttempts = 0;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let isConnectionReady = false; // Track when WebSocket is truly open
  let pendingChunks: Buffer[] = []; // Buffer chunks while waiting for connection

  const createConnection = () => {
    try {
      isConnectionReady = false; // Reset ready state for new connection
      
      // Configure Deepgram based on audio format
      const deepgramConfig: any = {
        model: "nova-2",
        language: "en",
        smart_format: true,
        punctuate: true,
        interim_results: true,
        endpointing: 500, // Quick: 500ms silence before ending utterance
        utterance_end_ms: 1000, // Responsive threshold for complete thoughts
        utterances: true,
        vad_events: true,
        filler_words: false,
        profanity_filter: false,
        no_delay: true,
        keep_alive: true,
      };

      if (audioFormat === 'pcm16') {
        deepgramConfig.encoding = 'linear16';
        deepgramConfig.sample_rate = sampleRate;
        deepgramConfig.channels = channels;
        logger.info(`Creating Deepgram stream with PCM16: ${sampleRate}Hz, ${channels} channel(s)`);
      } else {
        logger.info('Creating Deepgram stream with WebM Opus');
      }

      const newConnection = deepgram.listen.live(deepgramConfig);
      
      // Handle Open event - connection is truly ready now
      newConnection.on(LiveTranscriptionEvents.Open, () => {
        logger.info('[DEEPGRAM] ✅ WebSocket connection OPEN and ready for audio');
        isConnectionReady = true;
        reconnectAttempts = 0; // Reset on successful open
        
        // Flush any pending chunks that arrived before connection was ready
        if (pendingChunks.length > 0) {
          logger.info(`[DEEPGRAM] Flushing ${pendingChunks.length} buffered audio chunks`);
          for (const chunk of pendingChunks) {
            try {
              newConnection.send(chunk);
              chunkCount++;
            } catch (e) {
              logger.error('[DEEPGRAM] Error flushing buffered chunk', e);
            }
          }
          pendingChunks = [];
        }
      });
      
      // Log when metadata is received (confirms connection is working)
      newConnection.on(LiveTranscriptionEvents.Metadata, (data: any) => {
        logger.info('[DEEPGRAM] 📊 Metadata received - connection confirmed working');
      });

      // Handle transcript events
      newConnection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        const confidence = data.channel?.alternatives?.[0]?.confidence || 0;
        const isFinal = data.is_final || false;

        // DEBUG: Log ALL transcript events to diagnose silence
        logger.info(`[DEEPGRAM] Transcript event - isFinal: ${isFinal}, confidence: ${confidence.toFixed(2)}, text: "${transcript || '(empty)'}"`);

        // BACKGROUND NOISE FILTERING: Stricter thresholds to ignore ambient noise
        // Interim: 0.8 threshold filters out low-quality background sounds
        // Final: 0.0 threshold trusts Deepgram's validated final transcripts completely
        const minConfidence = isFinal ? 0.0 : 0.8; // High bar for interim, trust finals
        
        // Additional noise filtering: require at least 2 words for interim transcripts
        // Prevents random one-word noise ("uh", "oh", etc.) from triggering responses
        const wordCount = transcript ? transcript.trim().split(/\s+/).length : 0;
        const meetsWordRequirement = isFinal || wordCount >= 2;
        
        if (transcript && transcript.trim() && confidence >= minConfidence && meetsWordRequirement) {
          logger.info(`[DEEPGRAM] ✅ Accepted transcript (isFinal: ${isFinal}, conf: ${confidence.toFixed(2)}, words: ${wordCount}): "${transcript}"`);
          onTranscript({
            transcript,
            confidence,
            isFinal,
            speaker: data.speaker,
          });
        } else {
          logger.warn(`[DEEPGRAM] ❌ Filtered transcript (isFinal: ${isFinal}, conf: ${confidence.toFixed(2)}, words: ${wordCount}): "${transcript || '(empty)'}"`);
        }
      });

      // Handle utterance end events
      newConnection.on(LiveTranscriptionEvents.UtteranceEnd, (data: any) => {
        const completeText = data.channel?.alternatives?.[0]?.transcript;
        
        if (completeText && completeText.trim() && onUtteranceEnd) {
          logger.info(`[Deepgram] UtteranceEnd: "${completeText.substring(0, 50)}..."`);
          onUtteranceEnd(completeText.trim());
        }
      });

      // Handle errors - auto-reconnect
      newConnection.on(LiveTranscriptionEvents.Error, (error: any) => {
        logger.error("Deepgram error, attempting reconnection", error);
        isConnectionReady = false; // Mark as not ready on error
        if (!isReconnecting && !isClosed) {
          reconnect();
        }
        if (onError) {
          onError(new Error(error.message || "Deepgram error"));
        }
      });

      // Handle close - auto-reconnect unless manually closed
      newConnection.on(LiveTranscriptionEvents.Close, () => {
        logger.info("Deepgram connection closed");
        isConnectionReady = false; // Mark as not ready
        if (!isClosed && !isReconnecting) {
          logger.info("Deepgram closed unexpectedly, auto-reconnecting");
          reconnect();
        }
        if (onClose) {
          onClose();
        }
      });

      return newConnection;
    } catch (error) {
      logger.error("Error creating Deepgram connection", error);
      throw error;
    }
  };

  const reconnect = () => {
    if (isReconnecting || isClosed) return;
    
    isReconnecting = true;
    reconnectAttempts++;
    
    // EXPONENTIAL BACKOFF: Prevent hitting Deepgram rate limits
    // 1st retry: 1s, 2nd: 2s, 3rd: 4s, 4th: 8s, max: 30s
    const delayMs = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000);
    
    logger.info(`[DEEPGRAM] Reconnecting stream in ${delayMs}ms (attempt ${reconnectAttempts})...`);
    
    // Clear any existing timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    
    reconnectTimer = setTimeout(() => {
      try {
        // Close old connection safely
        if (connection && connection.getReadyState() === 1) {
          connection.finish();
        }
        
        // Create new connection (Open event will set isConnectionReady = true)
        connection = createConnection();
        chunkCount = 0;
        
        logger.info('[DEEPGRAM] Stream reconnection initiated, waiting for Open event...');
        
        // Reset reconnect counter and flag on success
        reconnectAttempts = 0;
        isReconnecting = false;
        
        if (onReconnect) {
          onReconnect();
        }
      } catch (error) {
        logger.error('[DEEPGRAM] Reconnection failed', error);
        
        // Clear flag BEFORE attempting next retry to prevent guard from blocking
        isReconnecting = false;
        
        // Don't retry infinitely - max 5 attempts
        if (reconnectAttempts < 5 && !isClosed) {
          reconnect();
        }
      }
    }, delayMs);
  };

  // Initialize first connection
  connection = createConnection();

  return {
    connection,
    send: (audioChunk: Buffer) => {
      if (isClosed) {
        return;
      }
      
      // If connection not ready yet, buffer the chunk instead of dropping it
      if (!isConnectionReady) {
        // Limit buffer to prevent memory issues (keep last 50 chunks = ~2 seconds)
        if (pendingChunks.length < 50) {
          pendingChunks.push(audioChunk);
          if (pendingChunks.length === 1) {
            logger.info('[DEEPGRAM] ⏳ Buffering audio while waiting for connection...');
          }
        }
        return;
      }
      
      // Auto-reconnect if connection died, but only if not already reconnecting
      if (!connection || connection.getReadyState() !== 1) {
        if (!isReconnecting) {
          logger.warn('[DEEPGRAM] Connection closed unexpectedly, reconnecting...');
          isConnectionReady = false;
          reconnect();
        }
        // Buffer the chunk for when reconnection completes
        if (pendingChunks.length < 50) {
          pendingChunks.push(audioChunk);
        }
        return;
      }

      chunkCount++;
      if (chunkCount % 100 === 0) {
        console.log(`[DEEPGRAM] Sent ${chunkCount} audio chunks`);
      }
      
      try {
        connection.send(audioChunk);
      } catch (error) {
        logger.error('[DEEPGRAM] Error sending audio chunk', error);
        // Don't trigger reconnect here - let the error/close handlers deal with it
      }
    },
    close: () => {
      if (isClosed) {
        return;
      }
      isClosed = true;
      console.log(`[DEEPGRAM] Closing connection after ${chunkCount} chunks`);
      
      if (connection && connection.getReadyState() === 1) {
        connection.finish();
      }
    },
  };
}

/**
 * Transcribe a pre-recorded audio file
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  options?: { language?: string }
): Promise<string> {
  try {
    const { result } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: options?.language || "en",
        smart_format: true,
        punctuate: true,
      }
    );

    if (!result) {
      throw new Error("No result from Deepgram");
    }

    const transcript =
      result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    return transcript;
  } catch (error) {
    logger.error("Error transcribing audio", error);
    throw new Error("Failed to transcribe audio");
  }
}

export { deepgram };
