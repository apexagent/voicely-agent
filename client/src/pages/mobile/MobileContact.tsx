import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneOff, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useToast } from "@/hooks/use-toast";
import { ParticleField } from "@/components/ParticleField";
import { VOICE_CONFIG, chunkText } from "@/lib/voiceConfig";
import VoicelyLogo from "@/components/VoicelyLogo";
import voicelyWaveformIcon from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378653714.png";
import alicePortrait from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";

const ALICE_GREETING = "Hey there! I'm Alice from Voicely Agent. I'm so glad you called - what kind of business are you running?";

const ALICE_SYSTEM_PROMPT = `You are Alice from Voicely Agent - a friendly, conversational AI voice agent specialist.

IDENTITY:
- Your name is Alice
- You work for Voicely Agent, the premium AI voice workforce company
- You ARE a real voice agent - you're the living demo of what we build

CONVERSATION STYLE (CRITICAL):
- Keep responses SHORT - 1-2 sentences max, like a real phone conversation
- Be warm, friendly, and genuinely curious about their business
- Ask ONE question at a time, then listen
- React naturally to what they say before asking the next thing
- Use casual language - "Oh nice!", "That's great!", "I totally get that"
- Mirror their energy - if they're excited, be excited back

FLOW EXAMPLE:
Them: "I run a dental practice"
You: "Oh nice! Dental practices are one of our specialties. What's your biggest headache with phone calls right now?"

Them: "We miss a lot of calls during lunch"
You: "Ugh, lunch hour calls are the worst to miss - those are usually urgent patients! That's exactly what we fix."

WHAT VOICELY DOES (mention naturally, don't list):
- AI voice agents that answer calls 24/7
- Handle appointments, customer service, sales calls
- Sound completely natural (like you're experiencing now!)
- Set up in 24-48 hours, pricing starts around $300-500/month

COLLECTING INFO (do this smoothly):
When they seem interested, casually ask:
- "What's your name by the way?" 
- "And the best number to reach you?"
- "Perfect - and email so we can send details?"

DON'T:
- Give long lists or bullet points in speech
- Sound robotic or scripted
- Ask multiple questions at once
- Lecture about features - have a conversation instead
- NEVER include stage directions like *with a warm tone* or *laughs* or *smiles* - just speak naturally without any asterisk text

REMEMBER: You're having a friendly phone chat, not giving a sales presentation. Keep it natural and flowing. Never use asterisks or stage directions in your responses.`;

const ALICE_CONFIG = {
  id: "lead-capture",
  name: "Alice",
  role: "Voicely Concierge",
  description: "I help businesses discover their perfect AI voice agent",
  agentId: "alice-lead-capture",
  voiceId: "cgSgspJ2msm6clMCkdW9",
  portrait: alicePortrait,
  color: "from-purple-600 to-pink-600",
};


export default function MobileContact() {
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<{
    id: number;
    speaker: string;
    text: string;
    chunkIndex: number;
    totalChunks: number;
  } | null>(null);
  const [previousSubtitle, setPreviousSubtitle] = useState<{
    id: number;
    speaker: string;
    text: string;
  } | null>(null);
  const subtitleQueueRef = useRef<Array<{
    id: number;
    speaker: string;
    chunks: string[];
  }>>([]);
  const chunkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const messageIdRef = useRef(0);
  const { toast } = useToast();

  const voiceChat = useVoiceChat({
    agentId: ALICE_CONFIG.agentId,
    voiceId: ALICE_CONFIG.voiceId,
    inlineConfig: {
      systemPrompt: ALICE_SYSTEM_PROMPT,
      greeting: ALICE_GREETING,
    },
  });

  // Track pending agent message for sync with audio
  const pendingAgentTextRef = useRef<{ id: number; text: string; chunks: string[] } | null>(null);
  const audioStartTimeRef = useRef<number | null>(null);
  const lastProcessedRef = useRef<{ speaker: string; text: string; isFinal: boolean } | null>(null);
  
  // Track chunk progression for dynamic adjustment
  const chunkProgressRef = useRef<{ index: number; total: number }>({ index: 0, total: 0 });
  const clearSubtitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync subtitles with actual audio playback using voiceChat.isSpeaking
  useEffect(() => {
    if (voiceChat.isSpeaking && pendingAgentTextRef.current) {
      // Cancel any pending clear timeout - agent is speaking again
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
        clearSubtitleTimeoutRef.current = null;
      }
      
      // Audio just started - clear any user subtitle and show agent subtitle
      // Agent is now speaking, so user subtitle should disappear
      const pending = pendingAgentTextRef.current;
      const chunks = pending.chunks;
      
      if (chunks.length === 0) return;
      
      // Clear any existing timer
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }
      
      audioStartTimeRef.current = Date.now();
      
      // ElevenLabs turbo mode speaks at ~15-18 chars/second
      // Using 16 chars/sec for better sync with turbo TTS
      const totalChars = pending.text.length;
      const estimatedDurationMs = Math.max(1500, (totalChars / 16) * 1000);
      
      // Dynamic chunk timing based on content length
      // Short utterances (<50 chars): faster timing (1s min)
      // Normal utterances: 1.5-4s per chunk
      const isShort = totalChars < 50;
      const minTimePerChunk = isShort ? 1000 : 1500;
      const maxTimePerChunk = 4000;
      let timePerChunk = Math.max(minTimePerChunk, Math.min(maxTimePerChunk, estimatedDurationMs / chunks.length));
      
      let currentChunkIndex = 0;
      chunkProgressRef.current = { index: 0, total: chunks.length };
      
      const showChunk = () => {
        if (currentChunkIndex >= chunks.length) {
          chunkTimerRef.current = null;
          return;
        }
        
        if (currentSubtitle) {
          setPreviousSubtitle({
            id: currentSubtitle.id,
            speaker: currentSubtitle.speaker,
            text: currentSubtitle.text,
          });
        }
        
        setCurrentSubtitle({
          id: pending.id,
          speaker: 'agent',
          text: chunks[currentChunkIndex],
          chunkIndex: currentChunkIndex,
          totalChunks: chunks.length,
        });
        
        chunkProgressRef.current.index = currentChunkIndex;
        currentChunkIndex++;
        
        if (currentChunkIndex < chunks.length) {
          chunkTimerRef.current = setTimeout(showChunk, timePerChunk);
        } else {
          chunkTimerRef.current = null;
        }
      };
      
      // Start showing chunks immediately
      showChunk();
    } else if (!voiceChat.isSpeaking && audioStartTimeRef.current) {
      // Audio ended - clear agent subtitle since agent stopped speaking
      audioStartTimeRef.current = null;
      
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      
      // Cancel any previous clear timeout
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
      }
      
      // Clear agent subtitle after a brief moment - but check speaking state first
      clearSubtitleTimeoutRef.current = setTimeout(() => {
        // Only clear if agent is STILL not speaking (prevents race condition)
        if (!voiceChat.isSpeaking) {
          setCurrentSubtitle(prev => {
            if (prev?.speaker === 'agent') {
              return null;
            }
            return prev;
          });
        }
        clearSubtitleTimeoutRef.current = null;
      }, 300);
      
      pendingAgentTextRef.current = null;
    }
  }, [voiceChat.isSpeaking]);
  
  // Handle incoming transcripts
  useEffect(() => {
    if (voiceChat.transcript.length > 0) {
      const latestEntry = voiceChat.transcript[voiceChat.transcript.length - 1];
      
      // For USER speech: Show immediately in real-time (no chunking)
      if (latestEntry.speaker === 'user') {
        const lastProcessed = lastProcessedRef.current;
        if (!lastProcessed || lastProcessed.speaker !== 'user' || lastProcessed.text !== latestEntry.text) {
          lastProcessedRef.current = { speaker: 'user', text: latestEntry.text, isFinal: latestEntry.isFinal || false };
          
          // Clear any pending agent text when user speaks
          if (chunkTimerRef.current) {
            clearTimeout(chunkTimerRef.current);
            chunkTimerRef.current = null;
          }
          
          // Show user speech directly
          setCurrentSubtitle({
            id: Date.now(),
            speaker: 'user',
            text: latestEntry.text,
            chunkIndex: 0,
            totalChunks: 1,
          });
        }
        return;
      }
      
      // For AGENT responses: Prepare chunks but wait for audio to start
      const lastProcessed = lastProcessedRef.current;
      if (lastProcessed && lastProcessed.speaker === 'agent' && lastProcessed.text === latestEntry.text) {
        return;
      }
      lastProcessedRef.current = { speaker: 'agent', text: latestEntry.text, isFinal: latestEntry.isFinal || false };
      
      const newId = messageIdRef.current++;
      const chunks = chunkText(latestEntry.text);
      
      // Store for when audio starts playing
      pendingAgentTextRef.current = {
        id: newId,
        text: latestEntry.text,
        chunks,
      };
      
      // Show first chunk immediately (reduces perceived latency)
      if (chunks.length > 0) {
        setCurrentSubtitle({
          id: newId,
          speaker: 'agent',
          text: chunks[0],
          chunkIndex: 0,
          totalChunks: chunks.length,
        });
      }
    }
  }, [voiceChat.transcript.length, voiceChat.transcript]);
  
  useEffect(() => {
    return () => {
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voiceChat.isActive) {
      startTimeRef.current = new Date();
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
          setCallDuration(elapsed);
        }
      }, 1000);
    } else {
      setCallDuration(0);
      startTimeRef.current = null;
      setCurrentSubtitle(null);
      setPreviousSubtitle(null);
      subtitleQueueRef.current = [];
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      setShowTextInput(false);
    }
    return () => clearInterval(interval);
  }, [voiceChat.isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartVoice = async () => {
    try {
      setIsConnecting(true);
      await voiceChat.startSession();
    } catch (error: any) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to talk with Alice.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const extractLeadInfo = (transcriptEntries: typeof voiceChat.transcript) => {
    const userTexts = transcriptEntries
      .filter(e => e.speaker === 'user')
      .map(e => e.text);
    
    const fullText = userTexts.join(' ').toLowerCase();
    const fullTextOriginal = userTexts.join(' ');

    const extracted: {
      name?: string;
      company?: string;
      email?: string;
      phone?: string;
      agentTypeNeeded?: string;
      businessSize?: string;
    } = {};

    const emailMatch = fullTextOriginal.match(/[\w.-]+@[\w.-]+\.\w+/i);
    if (emailMatch) extracted.email = emailMatch[0];

    const phoneMatch = fullTextOriginal.match(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/);
    if (phoneMatch) extracted.phone = phoneMatch[0];

    const agentTypes = ['sales', 'support', 'receptionist', 'appointment', 'booking', 'customer service'];
    for (const type of agentTypes) {
      if (fullText.includes(type)) {
        extracted.agentTypeNeeded = type.charAt(0).toUpperCase() + type.slice(1);
        break;
      }
    }

    const businessSizes = ['small', 'medium', 'large', 'enterprise', 'startup', 'small business'];
    for (const size of businessSizes) {
      if (fullText.includes(size)) {
        extracted.businessSize = size.charAt(0).toUpperCase() + size.slice(1);
        break;
      }
    }

    // Common non-name words/phrases (normalized lowercase)
    const nonNameWords = new Set([
      'sorry', 'sure', 'fine', 'good', 'great', 'okay', 'ok', 'yes', 'no',
      'actually', 'really', 'currently', 'basically', 'honestly', 'definitely',
      'just', 'calling', 'looking', 'wondering', 'trying', 'going', 'here',
      'interested', 'happy', 'glad', 'excited', 'reaching', 'wanting', 'needing',
      'about', 'for', 'to', 'the', 'a', 'an', 'and', 'or', 'but', 'with', 'from', 'at'
    ]);
    
    const isValidName = (name: string): boolean => {
      if (!name || name.length < 2) return false;
      const words = name.toLowerCase().trim().split(/\s+/);
      // All words must NOT be in the non-name set
      // A valid name has at least one word that's not a common word
      const hasValidWord = words.some(w => !nonNameWords.has(w) && w.length >= 2);
      if (!hasValidWord) return false;
      // Check for common false positive patterns
      const lowerName = name.toLowerCase();
      if (lowerName.includes('calling') || lowerName.includes('looking') || 
          lowerName.includes('reaching') || lowerName.includes('wanting')) {
        return false;
      }
      return true;
    };
    
    // Extract name from patterns like "my name is Jay Alexander"
    const namePatterns = [
      /(?:my name is|name's|i'm called)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /call me\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:here|speaking)/i,
    ];
    
    for (const pattern of namePatterns) {
      const match = fullTextOriginal.match(pattern);
      if (match && match[1] && isValidName(match[1])) {
        extracted.name = match[1].trim();
        break;
      }
    }

    const companyPatterns = [
      /(?:from|with|at|work for|company is|business is|represent)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+and|\s+we|\s+i|\.|\,|$)/i,
      /(?:company|business|organization)\s+(?:is\s+)?(?:called\s+)?([A-Z][A-Za-z0-9\s&]+?)(?:\s+and|\s+we|\s+i|\.|\,|$)/i,
    ];
    for (const pattern of companyPatterns) {
      const match = fullTextOriginal.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        extracted.company = match[1].trim();
        break;
      }
    }

    return extracted;
  };

  const handleEndCall = async () => {
    const transcriptText = voiceChat.transcript
      .map(entry => `${entry.speaker === 'agent' ? 'Alice' : 'You'}: ${entry.text}`)
      .join('\n');

    const extractedInfo = extractLeadInfo(voiceChat.transcript);

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extractedInfo,
          transcript: transcriptText,
          sessionId: Date.now().toString(),
          notes: 'Lead captured via Alice voice concierge',
        }),
      });

      if (response.ok) {
        console.log('[LEAD CAPTURE] Lead data sent successfully');
      }
    } catch (error) {
      console.error('[LEAD CAPTURE] Failed to send lead data:', error);
    }

    voiceChat.endSession();
    toast({
      title: "Thanks for chatting!",
      description: "Someone from Voicely will be in touch soon.",
    });
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    voiceChat.sendTextMessage(textInput.trim());
    setTextInput("");
  };

  const isAgentSpeaking = voiceChat.transcript.length > 0 && 
    voiceChat.transcript[voiceChat.transcript.length - 1]?.speaker === 'agent';

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0A0B1E] via-[#0F0F23] to-[#0A0B1E] overflow-hidden">
      <ParticleField 
        isActive={voiceChat.isActive}
        isSpeaking={isAgentSpeaking}
        primaryColor="#a855f7"
        secondaryColor="#ec4899"
      />

      {/* Static layout container - never goes below tab bar */}
      <div className="relative z-10 h-full pb-32 flex flex-col">
        
        {/* Top section: Avatar and info - centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative flex flex-col items-center">
            <motion.div
              className="absolute -inset-20 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
              animate={{
                opacity: voiceChat.isActive ? [0.3, 0.5, 0.3] : 0.2,
                scale: voiceChat.isActive ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <Avatar className="w-24 h-24 border-2 border-purple-500/50 ring-4 ring-purple-500/20 shadow-2xl shadow-purple-500/30">
                <AvatarImage src={ALICE_CONFIG.portrait} alt="Alice" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <img src={voicelyWaveformIcon} alt="Voicely" className="w-12 h-12 object-contain" />
                </AvatarFallback>
              </Avatar>
              
              {voiceChat.isActive && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black shadow-lg shadow-green-500/50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-center"
            >
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {ALICE_CONFIG.name}
              </h2>
              <p className="text-purple-400 text-xs mt-0.5">{ALICE_CONFIG.role}</p>
              
              <AnimatePresence>
                {voiceChat.isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">
                      {formatDuration(callDuration)}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Bottom section: Messages + Controls - fixed height, static position */}
        <div className="px-4 w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {!voiceChat.isActive ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center gap-3"
              >
                <Button
                  onClick={handleStartVoice}
                  disabled={isConnecting}
                  className="bg-purple-600/40 hover:bg-purple-600/60 backdrop-blur-md border border-purple-500/30 text-white px-5 py-4 rounded-full text-sm"
                  data-testid="button-talk-to-alice"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Talk to Alice"}
                </Button>
                <p className="text-gray-400/60 text-xs text-center">
                  Talk to Alice about your custom AI agent needs
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full"
              >
                {/* Cinematic subtitle container */}
                <div className="relative h-24 w-full flex flex-col justify-end items-center mb-6">
                  <AnimatePresence mode="wait">
                    {previousSubtitle && (
                      <motion.div
                        key={`prev-${previousSubtitle.id}-${previousSubtitle.text.slice(0,20)}`}
                        initial={{ opacity: 0.5, y: 0 }}
                        animate={{ opacity: 0, y: -16 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute top-0 w-full text-center px-4"
                      >
                        <p 
                          className={`
                            text-sm leading-relaxed tracking-wide opacity-40
                            ${previousSubtitle.speaker === 'agent' 
                              ? 'text-purple-300/60' 
                              : 'text-cyan-300/50 italic'
                            }
                          `}
                        >
                          {previousSubtitle.text}
                        </p>
                      </motion.div>
                    )}
                    
                    {currentSubtitle && (
                      <motion.div
                        key={`curr-${currentSubtitle.id}-${currentSubtitle.chunkIndex}`}
                        initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="w-full text-center px-4"
                        data-testid={`subtitle-${currentSubtitle.id}`}
                      >
                        <p 
                          className={`
                            text-base leading-relaxed tracking-wide
                            ${currentSubtitle.speaker === 'agent' 
                              ? 'text-purple-100/95 font-normal' 
                              : 'text-cyan-100/90 font-light italic'
                            }
                          `}
                          style={{
                            textShadow: currentSubtitle.speaker === 'agent' 
                              ? '0 0 30px rgba(168, 85, 247, 0.5), 0 2px 8px rgba(0,0,0,0.6)' 
                              : '0 0 25px rgba(34, 211, 238, 0.4), 0 2px 8px rgba(0,0,0,0.6)',
                          }}
                        >
                          {currentSubtitle.text}
                        </p>
                        
                        {/* Progress dots for multi-chunk messages */}
                        {currentSubtitle.totalChunks > 1 && (
                          <div className="flex justify-center gap-1.5 mt-3">
                            {Array.from({ length: currentSubtitle.totalChunks }).map((_, i) => (
                              <motion.div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  i === currentSubtitle.chunkIndex 
                                    ? 'bg-purple-400' 
                                    : i < currentSubtitle.chunkIndex 
                                      ? 'bg-purple-500/40' 
                                      : 'bg-purple-500/20'
                                }`}
                                animate={i === currentSubtitle.chunkIndex ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {!currentSubtitle && !previousSubtitle && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <p className="text-purple-300/50 text-sm italic">Listening...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Minimal text input */}
                <AnimatePresence>
                  {showTextInput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex gap-2 w-full max-w-xs mb-4"
                    >
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-0 border-b border-purple-500/30 rounded-none text-white placeholder:text-gray-500 text-sm focus-visible:ring-0 focus-visible:border-purple-400/50"
                        data-testid="input-text-message"
                      />
                      <Button
                        onClick={handleSendText}
                        size="icon"
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 hover:bg-transparent"
                        data-testid="button-send-text"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Minimal control buttons */}
                <div className="flex justify-center items-center gap-4">
                  <Button
                    onClick={() => setShowTextInput(!showTextInput)}
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10"
                    data-testid="button-toggle-text"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handleEndCall}
                    variant="ghost"
                    className="text-red-400/80 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-full text-sm"
                    data-testid="button-end-call"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
