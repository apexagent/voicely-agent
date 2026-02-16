import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, PhoneOff, MessageSquare, Sparkles, Volume2, Send, Brain,
  Wallet, Copy, ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import type { Agent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ParticleField } from "@/components/ParticleField";
import voicelyIconPath from "@assets/New vvvv_1763478691091.png";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

type ViewMode = "voice" | "chat";

// Typewriter effect component for smooth text animation
function TypewriterText({ text, className = "", speed = 30 }: { text: string; className?: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const prevTextRef = useRef("");
  const timeoutIdRef = useRef<number | null>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const prevText = prevTextRef.current;
    
    // Clear any pending timeout to prevent overlapping animations
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    
    // If text changed, check if it's an incremental update (streaming) or completely new
    if (text !== prevText) {
      // If new text starts with previous text, it's streaming - just append the delta
      if (text.startsWith(prevText) && prevText.length > 0) {
        // First, sync displayText to prevText to ensure no characters are lost
        setDisplayText(prevText);
        
        const delta = text.slice(prevText.length);
        let currentDeltaIndex = 0;
        
        const typeNextChar = () => {
          if (currentDeltaIndex < delta.length) {
            const charToAdd = delta[currentDeltaIndex];
            setDisplayText(prev => prev + charToAdd);
            currentDeltaIndex++;
            timeoutIdRef.current = window.setTimeout(typeNextChar, speed);
          } else {
            animatingRef.current = false;
            timeoutIdRef.current = null;
            prevTextRef.current = text;
          }
        };
        
        animatingRef.current = true;
        typeNextChar();
      } else {
        // Completely new text - reset and type from beginning
        setDisplayText("");
        let currentIndex = 0;
        
        const typeNextChar = () => {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            currentIndex++;
            timeoutIdRef.current = window.setTimeout(typeNextChar, speed);
          } else {
            animatingRef.current = false;
            timeoutIdRef.current = null;
            prevTextRef.current = text;
          }
        };
        
        animatingRef.current = true;
        typeNextChar();
      }
    }
    
    // Cleanup function to cancel any pending timeouts
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [text, speed]);

  const isTyping = displayText.length < text.length;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayText}
      {isTyping && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-current ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.span>
  );
}

// Streaming subtitle component - shows text in waves like movie subtitles
function StreamingSubtitle({ text, isSpeaking }: { text: string; isSpeaking: boolean }) {
  const [currentChunk, setCurrentChunk] = useState("");
  const [chunkIndex, setChunkIndex] = useState(0);
  const prevTextRef = useRef("");
  const chunksRef = useRef<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Split text into subtitle-sized chunks (around 60 chars, break at word boundaries)
  const splitIntoChunks = (fullText: string): string[] => {
    const maxChunkLength = 65;
    const chunks: string[] = [];
    const words = fullText.split(' ');
    let currentChunk = '';
    
    for (const word of words) {
      if ((currentChunk + ' ' + word).trim().length <= maxChunkLength) {
        currentChunk = (currentChunk + ' ' + word).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = word;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    
    return chunks;
  };
  
  useEffect(() => {
    // When text changes, create new chunks
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      const newChunks = splitIntoChunks(text);
      chunksRef.current = newChunks;
      setChunkIndex(0);
      setCurrentChunk(newChunks[0] || "");
    }
  }, [text]);
  
  useEffect(() => {
    // Cycle through chunks while speaking
    if (isSpeaking && chunksRef.current.length > 1) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Estimate ~2.5 seconds per chunk (average speaking rate)
      const chunkDuration = 2500;
      
      intervalRef.current = setInterval(() => {
        setChunkIndex(prev => {
          const nextIndex = (prev + 1) % chunksRef.current.length;
          setCurrentChunk(chunksRef.current[nextIndex] || "");
          return nextIndex;
        });
      }, chunkDuration);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (!isSpeaking) {
      // Not speaking - show final chunk
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Show the last chunk when done speaking
      const lastChunk = chunksRef.current[chunksRef.current.length - 1] || "";
      setCurrentChunk(lastChunk);
    }
  }, [isSpeaking]);
  
  // Show chunk indicator if multiple chunks
  const totalChunks = chunksRef.current.length;
  const showIndicator = totalChunks > 1 && isSpeaking;
  
  return (
    <motion.div
      key={currentChunk}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.25 }}
      className="text-center"
    >
      <p className="text-[11px] text-white/90 leading-tight">
        {currentChunk}
      </p>
      {showIndicator && (
        <div className="flex justify-center gap-1 mt-1">
          {[...Array(Math.min(totalChunks, 5))].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full transition-all duration-200 ${
                i === (chunkIndex % Math.min(totalChunks, 5)) 
                  ? 'bg-white/70 scale-110' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function SharedAgent() {
  const params = useParams<{ agentId?: string; customUrl?: string }>();
  const agentIdOrCustomUrl = params.agentId || params.customUrl || '';
  const [viewMode, setViewMode] = useState<ViewMode>("voice");
  const [callDuration, setCallDuration] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const startTimeRef = useRef<Date | null>(null);
  const subtitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { primaryWallet, setShowDynamicUserProfile } = useDynamicContext();
  const [balance, setBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const { data: agent, isLoading, error } = useQuery<Partial<Agent>>({
    queryKey: ["/api/public/agents", agentIdOrCustomUrl],
    enabled: !!agentIdOrCustomUrl,
  });

  const voiceChat = useVoiceChat({
    agentId: agent?.id || agentIdOrCustomUrl || '',
    voiceId: agent?.voiceId || '21m00Tcm4TlvDq8ikWAM',
  });

  // Fetch SOL balance using public RPC (safe for shared/unauthenticated pages)
  useEffect(() => {
    async function fetchBalance() {
      if (!primaryWallet?.address) {
        setIsLoadingBalance(false);
        return;
      }

      try {
        setIsLoadingBalance(true);
        // Use public Solana RPC endpoints (no authentication required for shared pages)
        const publicRpcEndpoints = [
          'https://api.mainnet-beta.solana.com',
          'https://solana-api.projectserum.com'
        ];

        let lastError: any = null;
        
        for (const rpcUrl of publicRpcEndpoints) {
          try {
            const response = await fetch(rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [primaryWallet.address]
              })
            });

            if (!response.ok) {
              lastError = new Error(`RPC request failed: ${response.status}`);
              continue;
            }

            const data = await response.json();
            
            if (data.error) {
              lastError = new Error(data.error.message || 'RPC returned an error');
              continue;
            }

            if (data.result?.value !== undefined) {
              const solBalance = (data.result.value / 1_000_000_000).toFixed(4);
              setBalance(solBalance);
              return; // Success!
            }
          } catch (err: any) {
            lastError = err;
            continue;
          }
        }

        throw lastError || new Error('All RPC endpoints failed');
      } catch (error: any) {
        console.error('[WALLET] Failed to fetch balance:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [primaryWallet?.address]);

  const copyAddress = () => {
    if (primaryWallet?.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openDynamicProfile = () => {
    setShowDynamicUserProfile(true);
  };

  useEffect(() => {
    if (scrollRef.current && viewMode === "chat") {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [voiceChat.transcript, viewMode]);

  useEffect(() => {
    if (voiceChat.isActive && startTimeRef.current) {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [voiceChat.isActive]);

  useEffect(() => {
    if (voiceChat.error) {
      toast({
        title: "Voice Error",
        description: voiceChat.error,
        variant: "destructive",
      });
    }
  }, [voiceChat.error, toast]);

  // Auto-hide subtitle after 5 seconds when new message appears
  useEffect(() => {
    if (voiceChat.transcript.length > 0) {
      // Show subtitle immediately when new message comes
      setShowSubtitle(true);
      
      // Clear any existing timeout
      if (subtitleTimeoutRef.current) {
        clearTimeout(subtitleTimeoutRef.current);
      }
      
      // Hide after 5 seconds
      subtitleTimeoutRef.current = setTimeout(() => {
        setShowSubtitle(false);
      }, 5000);
    }
    
    return () => {
      if (subtitleTimeoutRef.current) {
        clearTimeout(subtitleTimeoutRef.current);
      }
    };
  }, [voiceChat.transcript]);

  const handleToggle = async () => {
    if (voiceChat.isActive) {
      await voiceChat.endSession();
      setCallDuration(0);
      startTimeRef.current = null;
      setIsStarting(false);
    } else if (voiceChat.isReady && !isStarting) {
      startTimeRef.current = new Date();
      setCallDuration(0);
      setIsStarting(true);
      try {
        await voiceChat.startSession();
      } catch (error) {
        console.error('[VOICE] Failed to start session:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        toast({
          title: "Voice Failed",
          description: errorMsg || "Could not start voice session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsStarting(false);
      }
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || isSendingChat || !agent?.id) return;

    setIsSendingChat(true);
    try {
      await voiceChat.sendTextMessage(chatMessage.trim());
      setChatMessage("");
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleChatKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAgentSpeaking = voiceChat.transcript.length > 0 && 
    voiceChat.transcript[voiceChat.transcript.length - 1]?.speaker === 'agent';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-gray-900/50 backdrop-blur-xl border-gray-800 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-white mb-2">Agent Not Found</h1>
          <p className="text-gray-400 mb-6">
            The agent you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const primaryColor = agent.primaryColor || "#8B5CF6";
  const secondaryColor = agent.secondaryColor || "#06B6D4";
  const backgroundImage = agent.backgroundImage;
  const backgroundVideo = agent.backgroundVideo;

  return (
    <div className="relative h-screen overflow-hidden bg-[#0A0B1E]">
      {/* Custom Background Video (if provided) */}
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Custom Background Image (if provided and no video) */}
      {!backgroundVideo && backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Futuristic grid background (default if no custom background) */}
      {!backgroundVideo && !backgroundImage && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
      
      {/* Animated ambient lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Mode Toggle - Top Right */}
      <motion.button
        onClick={() => setViewMode(prev => prev === "voice" ? "chat" : "voice")}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border border-purple-500/20 bg-black/60 backdrop-blur-xl text-xs font-medium text-gray-300 hover-elevate active-elevate-2 transition-all"
        data-testid="button-toggle-mode"
        role="switch"
        aria-checked={viewMode === "chat"}
        aria-label={`Switch to ${viewMode === "voice" ? "chat" : "voice"} mode`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {viewMode === "voice" ? (
          <MessageSquare className="w-3.5 h-3.5" />
        ) : (
          <Mic className="w-3.5 h-3.5" />
        )}
      </motion.button>

      {/* Particle Field Background (Canvas 2D) */}
      {viewMode === "voice" && (
        <ParticleField 
          isActive={voiceChat.isActive} 
          isSpeaking={isAgentSpeaking}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      )}

      <AnimatePresence mode="wait">
        {viewMode === "voice" ? (
          <motion.div
            key="voice-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center justify-center h-screen px-6"
          >
            {/* Central Button Section with Particle Effect */}
            <div className="relative flex items-center justify-center w-full max-w-4xl">

              {/* Animated Voice Waves - Matching particle colors */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 rounded-full"
                    style={{
                      left: `${50 + (i - 12) * 3}%`,
                      background: `linear-gradient(to top, ${
                        ["#06B6D4", "#A855F7", "#D946EF", "#7C3AED"][i % 4]
                      }, transparent)`,
                    }}
                    animate={{
                      height: [`${20 + Math.random() * 10}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 10}%`],
                    }}
                    transition={{
                      duration: 0.6 + Math.random() * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.03,
                    }}
                  />
                ))}
              </div>

              {/* Main Button - Clean pill design matching reference */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
                animate={isAgentSpeaking ? { scale: [1, 1.02, 1] } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isAgentSpeaking ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <button
                  onClick={handleToggle}
                  disabled={!voiceChat.isReady || isStarting}
                  className="relative flex items-center gap-4 px-7 py-4 bg-[#1A1F3A] border border-[#273056] rounded-full shadow-[0_0_18px_rgba(139,92,246,0.35)] overflow-hidden disabled:opacity-50 transition-all"
                  data-testid="button-talk-to-agent"
                >
                  {/* Icon on Left */}
                  <div className="w-10 h-10 rounded-full bg-[#2A3F5F]/60 border border-gray-600/40 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={voicelyIconPath} 
                      alt="Voicely Icon" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  
                  {/* Text in Center */}
                  <span className="text-white font-semibold text-lg tracking-wide whitespace-nowrap">
                    {isStarting ? (
                      "Starting..."
                    ) : voiceChat.isActive ? (
                      voiceChat.transcript.length === 0 ? "Connecting..." :
                      isAgentSpeaking ? `${agent.name} speaking...` : "Listening..."
                    ) : (
                      "Call Voicely"
                    )}
                  </span>
                  
                  {/* Animated Soundwave Bars on Right */}
                  <div className="flex items-center gap-0.5 h-6 ml-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 rounded-full"
                        style={{
                          background: isAgentSpeaking 
                            ? `linear-gradient(to top, ${primaryColor}, ${secondaryColor})`
                            : 'rgba(139, 92, 246, 0.4)',
                        }}
                        animate={{
                          height: isAgentSpeaking 
                            ? ['40%', '100%', '40%']
                            : '40%',
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </button>
              </motion.div>

              {/* Streaming Subtitle - Shows text in waves like movie subtitles */}
              <AnimatePresence mode="wait">
                {voiceChat.isActive && voiceChat.transcript.length > 0 && showSubtitle && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-32 left-0 right-0 px-8 flex justify-center pointer-events-none z-30"
                  >
                    {(() => {
                      const lastEntry = voiceChat.transcript[voiceChat.transcript.length - 1];
                      const isAgent = lastEntry.speaker === 'agent';
                      
                      return (
                        <div className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-lg">
                          {isAgent ? (
                            <StreamingSubtitle 
                              text={lastEntry.text} 
                              isSpeaking={isAgentSpeaking}
                            />
                          ) : (
                            <p className="text-[11px] text-cyan-300/90 text-center leading-tight">
                              {lastEntry.text.length > 65 
                                ? lastEntry.text.slice(-65) + '...'
                                : lastEntry.text}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cyber Holographic Wallet HUD - Bottom of Screen */}
            {primaryWallet?.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
              >
                <motion.div
                  className="relative px-4 py-2 rounded-full border bg-black/30 backdrop-blur-xl overflow-hidden"
                  style={{
                    borderImage: "linear-gradient(90deg, rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3), rgba(6, 182, 212, 0.3)) 1",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(6, 182, 212, 0.2), 0 0 40px rgba(147, 51, 234, 0.1)",
                      "0 0 30px rgba(147, 51, 234, 0.2), 0 0 50px rgba(6, 182, 212, 0.1)",
                      "0 0 20px rgba(6, 182, 212, 0.2), 0 0 40px rgba(147, 51, 234, 0.1)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Animated scanline effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    {/* Balance with pulsing halo */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Wallet className="w-3 h-3 text-cyan-400" />
                      </motion.div>
                      <span className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {isLoadingBalance ? "..." : balance}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">SOL</span>
                    </div>

                    {/* Separator */}
                    <div className="h-4 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

                    {/* Address ticker */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 tracking-wide">
                        {shortenAddress(primaryWallet.address)}
                      </span>
                      <motion.button
                        onClick={copyAddress}
                        className="p-0.5 hover:bg-cyan-500/20 rounded transition-all"
                        data-testid="button-copy-address"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-2.5 h-2.5 text-cyan-400" />
                      </motion.button>
                    </div>

                    {/* Separator */}
                    <div className="h-4 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

                    {/* Icon-only action buttons */}
                    <div className="flex gap-1.5">
                      <motion.button
                        onClick={openDynamicProfile}
                        className="p-1.5 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:from-green-600/30 hover:to-emerald-600/30 transition-all"
                        data-testid="button-receive-sol"
                        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        title="Receive SOL"
                      >
                        <ArrowDownLeft className="w-3 h-3 text-green-400" />
                      </motion.button>
                      <motion.button
                        onClick={openDynamicProfile}
                        className="p-1.5 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
                        data-testid="button-send-sol"
                        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        title="Send SOL"
                      >
                        <ArrowUpRight className="w-3 h-3 text-purple-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="chat-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col"
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {agent.name}
                </span>
              </h1>
              <p className="text-gray-400 text-sm">
                {agent.type ? `${agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent` : 'AI Assistant'}
              </p>
            </motion.div>

            {/* Chat Interface - matching VoicelyVoiceShowcase style */}
            <div className="flex-1 space-y-6">
              {/* Scenario Badge */}
              <div 
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 backdrop-blur-xl"
                data-testid="scenario-badge"
              >
                <Brain className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Chat Mode</div>
                  <div className="text-sm font-bold text-white">
                    Text-based conversation with {agent.name}
                  </div>
                </div>
              </div>

              {/* Live Transcript */}
              <div className="rounded-2xl border-2 border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-black/40 backdrop-blur-xl p-6 min-h-[400px] max-h-[500px] flex flex-col" data-testid="transcript-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-bold text-white">Live Transcript</h4>
                </div>

                <ScrollArea
                  ref={scrollRef}
                  className="flex-1"
                  data-testid="transcript-scroll-area"
                >
                  <div className="space-y-4 pr-4">
                    <AnimatePresence>
                      {voiceChat.transcript.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Send a message to start the conversation</p>
                        </div>
                      ) : (
                        voiceChat.transcript.map((entry, idx) => {
                          const isLastMessage = idx === voiceChat.transcript.length - 1;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: entry.speaker === "agent" ? -20 : 20, y: 20 }}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                              }}
                              className={`flex ${entry.speaker === "agent" ? "justify-start" : "justify-end"}`}
                              data-testid={`transcript-message-${idx}`}
                            >
                              <div className={`
                                max-w-[80%] px-4 py-3 rounded-xl
                                ${entry.speaker === "agent"
                                  ? `bg-gradient-to-r from-purple-600 to-violet-600 text-white`
                                  : "bg-white/10 text-gray-200"
                                }
                              `}>
                                <div className="text-xs font-semibold mb-1 opacity-70" data-testid={`text-speaker-${idx}`}>
                                  {entry.speaker === "agent" ? agent.name : "You"}
                                </div>
                                <div className="text-sm leading-relaxed" data-testid={`text-message-${idx}`}>
                                  {isLastMessage ? (
                                    <TypewriterText text={entry.text} speed={5} />
                                  ) : (
                                    entry.text
                                  )}
                                </div>
                                {entry.timestamp && (
                                  <div className="text-xs opacity-60 mt-1" data-testid={`text-time-${idx}`}>
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <div className="flex gap-3">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      placeholder="Type your message..."
                      disabled={isSendingChat}
                      className="flex-1 h-12 bg-black/50 border-purple-500/30 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500/50"
                      data-testid="input-chat-message"
                    />
                    <Button
                      onClick={handleSendChatMessage}
                      disabled={!chatMessage.trim() || isSendingChat}
                      className="h-12 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                      data-testid="button-send-message"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              {voiceChat.transcript.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-4"
                  data-testid="metrics-grid"
                >
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Status
                    </div>
                    <div className="text-lg font-black text-green-400">
                      Active
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {formatDuration(callDuration)}
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Messages
                    </div>
                    <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {voiceChat.transcript.length}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA Badge */}
              <div className="text-center pt-4">
                <Badge variant="outline" className="px-6 py-3 text-sm border-purple-500/40 bg-purple-600/10 text-purple-300">
                  Powered by Voicely AI Engine
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
