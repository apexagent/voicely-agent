import { useEffect, useRef, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, PhoneOff, Mic, Brain, Activity, Clock, TrendingUp, Bot, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useVoiceChat, TranscriptEntry } from "@/hooks/useVoiceChat";
import { useToast } from "@/hooks/use-toast";
import alicePortrait from "@assets/generated_images/Alice_Support_Agent_New.png";

interface FAQVoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faq: {
    question: string;
    answer: string;
    confidence: number;
    avgResponseTime: string;
    category: string;
  } | null;
}

// Voice Waveform Visualizer
function VoiceWaveform({ active = true }: { active?: boolean }) {
  return (
    <div className="flex items-center gap-1 h-16">
      {[...Array(32)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
          animate={active ? {
            height: [
              `${20 + Math.random() * 30}%`,
              `${40 + Math.random() * 60}%`,
              `${20 + Math.random() * 30}%`
            ],
            opacity: [0.4, 1, 0.4],
          } : {
            height: "20%",
            opacity: 0.3,
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
}

export default function FAQVoiceDialog({ isOpen, onClose, faq }: FAQVoiceDialogProps) {
  const [textMessage, setTextMessage] = useState("");
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isStartingRef = useRef(false);
  const { toast } = useToast();

  // Suggested FAQ questions
  const suggestedQuestions = [
    "What exactly can the AI voice agents handle?",
    "How many calls can it handle?",
    "What are your pricing plans?",
    "How will I train the AI voice agents?",
    "What languages are supported?",
  ];

  const voiceChat = useVoiceChat({
    agentId: "demo-support-agent",
    voiceId: "cgSgspJ2msm6clMCkdW9",
    onError: (error) => {
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [voiceChat.transcript]);

  // Auto-start session when dialog opens with FAQ
  useEffect(() => {
    if (isOpen && faq && !voiceChat.isActive && voiceChat.isReady && !isStartingRef.current) {
      isStartingRef.current = true;
      const startDemo = async () => {
        try {
          await voiceChat.startSession();
          setCallStartTime(new Date());
          
          // Small delay to ensure session is ready
          setTimeout(() => {
            // Send just the answer directly without introduction
            voiceChat.sendTextMessage(faq.answer, true);
          }, 300);
        } catch (error) {
          console.error('[FAQ VOICE] Failed to auto-start session:', error);
        } finally {
          isStartingRef.current = false;
        }
      };
      startDemo();
    }
  }, [isOpen, faq, voiceChat.isReady, voiceChat.isActive]);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!isOpen) {
      if (voiceChat.isActive) {
        voiceChat.endSession();
      }
      voiceChat.resetTranscript();
      setCallStartTime(null);
      setCallDuration(0);
      setTextMessage("");
      isStartingRef.current = false;
    }
  }, [isOpen]);

  // Track call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voiceChat.isActive && callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [voiceChat.isActive, callStartTime]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e?: FormEvent, message?: string) => {
    e?.preventDefault();
    const messageToSend = message || textMessage.trim();
    if (messageToSend && voiceChat.isActive) {
      voiceChat.sendTextMessage(messageToSend);
      setTextMessage("");
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(undefined, question);
  };

  const handleClose = () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
    }
    onClose();
  };

  if (!faq) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] p-0 bg-black/95 backdrop-blur-2xl border border-cyan-500/30 overflow-hidden"
        onEscapeKeyDown={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
          </div>

          {/* Hero Header with Nova Portrait */}
          <DialogHeader className="relative border-b border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-purple-950/40 backdrop-blur-xl p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-6">
              {/* Nova Portrait */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative flex-shrink-0"
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30">
                  <img 
                    src={alicePortrait} 
                    alt="Alice AI Assistant" 
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Animated Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(6,182,212,0.4)",
                        "0 0 40px rgba(139,92,246,0.6)",
                        "0 0 20px rgba(6,182,212,0.4)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                {/* Status Indicator */}
                {voiceChat.isSpeaking && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4 text-white animate-pulse" />
                  </motion.div>
                )}
              </motion.div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" data-testid="text-alice-title">
                    Alice AI Assistant
                  </h2>
                  <Badge className="bg-cyan-950/50 border-cyan-500/50 text-cyan-300 flex-shrink-0" data-testid="badge-knowledge-expert">
                    <Brain className="w-3 h-3 mr-1" />
                    Knowledge Expert
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-4 break-words" data-testid="text-faq-question">
                  {faq.question}
                </p>

                {/* Performance Stats Strip */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30" data-testid="stat-accuracy">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-xs text-cyan-300 font-semibold whitespace-nowrap">{faq.confidence}% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30" data-testid="stat-response-time">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-xs text-purple-300 font-semibold whitespace-nowrap">{faq.avgResponseTime} Response</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-green-950/40 border border-green-500/30" data-testid="stat-category">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-green-300 font-semibold capitalize whitespace-nowrap">{faq.category}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="flex-shrink-0 hover:bg-red-950/30 hover:text-red-400 border border-red-500/20"
                data-testid="button-close-dialog"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="relative p-6 space-y-4">
            {/* Voice Waveform Visualizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 backdrop-blur-xl border border-cyan-500/30 p-6 overflow-hidden"
            >
              {/* Scan Line Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.4) 50%, transparent 100%)",
                  height: "100px",
                }}
                animate={{
                  y: ["-100px", "100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-cyan-300">Voice Activity</span>
                  <div className="flex items-center gap-2">
                    {voiceChat.isSpeaking ? (
                      <Badge className="bg-green-950/50 border-green-500/50 text-green-300" data-testid="badge-speaking">
                        <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                        Speaking
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-950/50 border-gray-500/50 text-gray-400" data-testid="badge-standby">
                        <VolumeX className="w-3 h-3 mr-1" />
                        Standby
                      </Badge>
                    )}
                  </div>
                </div>
                <VoiceWaveform active={voiceChat.isSpeaking} />
              </div>
            </motion.div>

            {/* Transcript Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/20 overflow-hidden"
            >
              <div className="border-b border-cyan-500/20 px-4 py-3 bg-cyan-950/20">
                <h3 className="text-sm font-semibold text-cyan-300">Live Transcript</h3>
              </div>
              
              <ScrollArea className="h-64" ref={scrollRef}>
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {voiceChat.transcript.map((entry: TranscriptEntry, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: entry.speaker === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${entry.speaker === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {entry.speaker === "agent" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            entry.speaker === "user"
                              ? "bg-purple-600/30 border border-purple-500/40 text-purple-100"
                              : "bg-cyan-950/40 border border-cyan-500/40 text-cyan-100"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{entry.text}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {entry.speaker === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {voiceChat.transcript.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Initializing voice session...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>

            {/* Text Input & Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {/* Text Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a follow-up question..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  disabled={!voiceChat.isActive}
                  className="flex-1 bg-black/60 border-cyan-500/30 text-white placeholder:text-gray-500"
                  data-testid="input-text-message"
                />
                <Button
                  type="submit"
                  disabled={!textMessage.trim() || !voiceChat.isActive}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              {/* Suggested Questions */}
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={!voiceChat.isActive}
                    className="text-xs bg-black/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 hover:border-cyan-400/50 hover:text-cyan-200"
                    data-testid={`button-suggested-question-${index}`}
                  >
                    {question}
                  </Button>
                ))}
              </div>

              {/* Control Panel */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-mono text-cyan-300" data-testid="text-call-duration">
                      {formatDuration(callDuration)}
                    </span>
                  </div>
                  {voiceChat.isActive && (
                    <Badge className="bg-green-950/50 border-green-500/50 text-green-300" data-testid="badge-session-active">
                      <Activity className="w-3 h-3 mr-1 animate-pulse" />
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClose}
                    className="border border-red-500/50"
                    data-testid="button-end-call"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
