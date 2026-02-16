import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PhoneOff, RefreshCw, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ParticleField } from "@/components/ParticleField";
import voicelyIconPath from "@assets/New vvvv_1763478691091.png";
import sarahImage from "@assets/9bd3c5fc-f5c8-410c-b35a-c3aa27718c92_1762607585722.png";
import emmaImage from "@assets/6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png";
import aliceImage from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";
import mayaImage from "@assets/77912688-291a-4713-b923-54cec485ff01_1762607585723.png";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface AgentDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    id: string;
    title: string;
    description: string;
    image: string;
    agentId: string;
    voiceId: string;
    gradient: string;
    capabilities?: string[];
  };
  initialMode?: 'voice' | 'chat';
}

// All agent data
const ALL_AGENTS = [
  {
    id: 'sales',
    name: 'Sarah',
    role: 'Elite Sales Agent',
    description: 'Consultative selling & conversions',
    image: sarahImage,
    gradient: 'from-purple-500 to-violet-500',
    agentId: 'demo-sales-agent',
    scenario: 'Product demo & ROI analysis',
    primaryColor: '#A855F7', // purple-500
    secondaryColor: '#7C3AED', // violet-600
  },
  {
    id: 'receptionist',
    name: 'Emma',
    role: 'AI Receptionist',
    description: 'Call routing & first impression',
    image: emmaImage,
    gradient: 'from-cyan-500 to-blue-500',
    agentId: 'demo-receptionist-agent',
    scenario: 'Call routing & inquiry',
    primaryColor: '#06B6D4', // cyan-500
    secondaryColor: '#3B82F6', // blue-500
  },
  {
    id: 'support',
    name: 'Alice',
    role: 'Customer Success Agent',
    description: 'Technical support & troubleshooting',
    image: aliceImage,
    gradient: 'from-blue-500 to-cyan-500',
    agentId: 'demo-support-agent',
    scenario: 'CRM integration support',
    primaryColor: '#3B82F6', // blue-500
    secondaryColor: '#06B6D4', // cyan-500
  },
  {
    id: 'followup',
    name: 'Maya',
    role: 'Follow-Up Agent',
    description: 'Re-engagement & lead nurturing',
    image: mayaImage,
    gradient: 'from-pink-500 to-rose-500',
    agentId: 'demo-followup-agent',
    scenario: 'Cart recovery outreach',
    primaryColor: '#EC4899', // pink-500
    secondaryColor: '#F43F5E', // rose-500
  }
];

// Typewriter effect component
function TypewriterText({ text, className = "", speed = 30 }: { text: string; className?: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const prevTextRef = useRef("");
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    const prevText = prevTextRef.current;
    
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    
    if (text !== prevText) {
      if (text.startsWith(prevText) && prevText.length > 0) {
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
            timeoutIdRef.current = null;
            prevTextRef.current = text;
          }
        };
        
        typeNextChar();
      } else {
        setDisplayText("");
        let currentIndex = 0;
        
        const typeNextChar = () => {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            currentIndex++;
            timeoutIdRef.current = window.setTimeout(typeNextChar, speed);
          } else {
            timeoutIdRef.current = null;
            prevTextRef.current = text;
          }
        };
        
        typeNextChar();
      }
    }
    
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

export default function AgentDemoModal({ isOpen, onClose, agent, initialMode = 'voice' }: AgentDemoModalProps) {
  const getInitialAgentIndex = () => {
    const index = ALL_AGENTS.findIndex(a => a.agentId === agent.agentId);
    return index >= 0 ? index : 0;
  };

  const [selectedAgentIndex, setSelectedAgentIndex] = useState(getInitialAgentIndex);
  const [callDuration, setCallDuration] = useState(0);
  const startTimeRef = useRef(new Date());
  const [isStarting, setIsStarting] = useState(false);
  const [mode, setMode] = useState<'voice' | 'chat'>(initialMode);
  const [textInput, setTextInput] = useState('');

  const selectedAgent = ALL_AGENTS[selectedAgentIndex];
  const { primaryColor, secondaryColor } = selectedAgent;

  const voiceChat = useVoiceChat({
    agentId: selectedAgent.agentId
  });

  const { transcript, isReady, sendTextMessage } = voiceChat;

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (voiceChat.isActive) {
      startTimeRef.current = new Date();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [voiceChat.isActive]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAgentIndex(getInitialAgentIndex());
      setCallDuration(0);
    }
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = async () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
    } else {
      setIsStarting(true);
      try {
        await voiceChat.startSession(false);
      } catch (error) {
        console.error('Failed to start session:', error);
      } finally {
        setTimeout(() => setIsStarting(false), 500);
      }
    }
  };

  const handleReplayDemo = () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
    }
    setTimeout(() => {
      handleToggle();
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!textInput.trim() || !voiceChat.isActive) return;
    
    try {
      await sendTextMessage(textInput);
      setTextInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-start chat session when in chat mode
  useEffect(() => {
    if (mode === 'chat' && !voiceChat.isActive && isReady) {
      voiceChat.startSession(false);
    }
  }, [mode, isReady]);

  const isAgentSpeaking = transcript && transcript.length > 0 && transcript[transcript.length - 1]?.speaker === 'agent';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
        data-testid="agent-demo-modal-backdrop"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full bg-gradient-to-br from-[#0A0B1E] via-[#0F1020] to-[#0A0B1E] overflow-hidden"
          data-testid="agent-demo-modal-content"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full bg-red-600/90 backdrop-blur-xl border border-red-500/40 flex items-center justify-center text-white hover:bg-red-700 transition-all active:scale-95"
            data-testid="button-close-demo-modal"
            aria-label="Close demo"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Agent Info Badge - Top Center */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-purple-500/20">
              <img src={selectedAgent.image} alt={selectedAgent.name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-white font-semibold text-sm">{selectedAgent.name}</div>
                <div className="text-gray-400 text-xs">{selectedAgent.role}</div>
              </div>
            </div>
          </motion.div>

          {/* Background Effects */}
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

          {/* Particle Field Background */}
          <ParticleField 
            isActive={voiceChat.isActive} 
            isSpeaking={isAgentSpeaking}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-stretch justify-center h-full px-6">
            {/* Central Button Section - Voice Mode */}
            {mode === 'voice' && (
              <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto">
                {/* Animated Voice Waves */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 rounded-full"
                      style={{
                        left: `${50 + (i - 12) * 3}%`,
                        background: `linear-gradient(to top, ${
                          [primaryColor, secondaryColor, primaryColor, secondaryColor][i % 4]
                        }, transparent)`,
                      }}
                      animate={{
                        height: voiceChat.isActive 
                          ? [`${20 + Math.random() * 10}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 10}%`]
                          : '20%',
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

                {/* Main Button */}
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
                    disabled={!isReady || isStarting}
                    className="relative flex items-center gap-4 px-7 py-4 bg-[#1A1F3A] border border-[#273056] rounded-full shadow-[0_0_18px_rgba(139,92,246,0.35)] overflow-hidden disabled:opacity-50 transition-all"
                    data-testid="button-talk-to-agent"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2A3F5F]/60 border border-gray-600/40 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={voicelyIconPath} 
                        alt="Voicely Icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    
                    <span className="text-white font-semibold text-lg tracking-wide whitespace-nowrap">
                      {isStarting ? (
                        "Starting..."
                      ) : voiceChat.isActive ? (
                        transcript.length === 0 ? "Connecting..." :
                        isAgentSpeaking ? `${selectedAgent.name} speaking...` : "Listening..."
                      ) : (
                        "Start Demo"
                      )}
                    </span>
                    
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

                {/* Replay Button */}
                {voiceChat.isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute -bottom-20"
                  >
                    <Button
                      onClick={handleReplayDemo}
                      disabled={!isReady}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-full px-6 h-12"
                      data-testid="button-replay-demo"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Replay Demo
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Chat Input Section - Chat Mode */}
            {mode === 'chat' && (
              <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto">
                <div className="w-full max-w-2xl">
                  <div className="flex items-center gap-3 bg-[#1A1F3A] border border-[#273056] rounded-full px-6 py-3 shadow-[0_0_18px_rgba(139,92,246,0.35)]">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={!voiceChat.isActive}
                      className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      data-testid="input-chat-message"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!textInput.trim() || !voiceChat.isActive}
                      size="icon"
                      className={`rounded-full bg-gradient-to-r ${selectedAgent.gradient} hover:opacity-90`}
                      data-testid="button-send-message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Subtitle Captions */}
            <AnimatePresence mode="wait">
                {voiceChat.isActive && transcript.length > 0 && (
                  <motion.div
                    key={transcript[transcript.length - 1].text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-24 left-0 right-0 px-6 flex justify-center"
                  >
                    {(() => {
                      const lastEntry = transcript[transcript.length - 1];
                      const isAgent = lastEntry.speaker === 'agent';
                      
                      // Truncate long text to last 150 characters for readability
                      const displayText = lastEntry.text.length > 150 
                        ? '...' + lastEntry.text.slice(-150) 
                        : lastEntry.text;
                      
                      return (
                        <div className="inline-flex items-start gap-2 max-w-4xl">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            isAgent 
                              ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/30' 
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {isAgent ? selectedAgent.name : 'You'}
                          </span>
                          <div className={`
                            px-3 py-2 rounded-lg backdrop-blur-md
                            ${isAgent 
                              ? 'bg-black/50 border border-white/10' 
                              : 'bg-purple-900/30 border border-purple-500/20'
                            }
                          `}>
                            <p className={`text-sm leading-relaxed ${
                              isAgent ? 'text-white' : 'text-gray-200'
                            }`}>
                              {displayText}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Call Duration Badge */}
            {voiceChat.isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <Badge variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                  {formatDuration(callDuration)}
                </Badge>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
