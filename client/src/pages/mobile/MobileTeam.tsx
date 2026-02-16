import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Headphones, Calendar, UserPlus, Zap, Phone, X, Brain, Activity, Volume2, Mic, PhoneOff, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useVoiceChat, TranscriptEntry } from "@/hooks/useVoiceChat";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import sarahImg from "@assets/9bd3c5fc-f5c8-410c-b35a-c3aa27718c92_1762607585722.png";
import sarahVideo from "@assets/media (3)_1763217316569.mp4";
import emmaImg from "@assets/6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png";
import emmaVideo from "@assets/98e47d38-5d04-4b20-b6af-b04ad653be40_1763287410229.mp4";
import aliceImg from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";
import aliceVideo from "@assets/5d034abd-46cd-4a72-96b1-8ea39d46c2d2_1763287049942.mp4";
import mayaImg from "@assets/77912688-291a-4713-b923-54cec485ff01_1762607585723.png";
import mayaVideo from "@assets/media (5)_1763282840689.mp4";

interface AgentType {
  id: string;
  name: string;
  role: string;
  icon: typeof TrendingUp;
  image: string;
  video?: string;
  color: string;
  gradient: string;
  description: string;
  capabilities: string[];
  stats: {
    successRate: number;
    avgDuration: string;
    callsHandled: number;
  };
  sampleConversation: string[];
  demoAgentId: string;
  voiceId: string;
}

const agentTypes: AgentType[] = [
  {
    id: "sales",
    name: "Sarah",
    role: "Elite Sales Agent",
    icon: TrendingUp,
    image: sarahImg,
    video: sarahVideo,
    color: "from-purple-600 to-violet-600",
    gradient: "from-purple-600/20 to-violet-600/20",
    description: "Premium AI sales specialist with advanced persuasion algorithms and real-time market intelligence.",
    capabilities: [
      "High-conversion pitches",
      "Objection resolution",
      "Premium upselling",
      "Strategic deal closing",
      "Lead scoring & routing",
    ],
    stats: {
      successRate: 96,
      avgDuration: "4m 15s",
      callsHandled: 3247,
    },
    sampleConversation: [
      "Hi! I'm Sarah, your premium AI sales specialist. I've analyzed your business needs and I'm excited to show you how Voicely can transform your customer engagement.",
      "Our enterprise clients see 340% ROI in the first quarter with our AI workforce handling unlimited concurrent calls with 98.7% accuracy.",
      "I'd love to schedule a personalized demo where you can see our voice AI in action. Would Thursday at 2 PM work for your team?",
    ],
    demoAgentId: "demo-sales-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
  },
  {
    id: "receptionist",
    name: "Emma",
    role: "AI Receptionist",
    icon: Headphones,
    image: emmaImg,
    video: emmaVideo,
    color: "from-cyan-600 to-blue-600",
    gradient: "from-cyan-600/20 to-blue-600/20",
    description: "Professional reception AI with perfect call routing and warm customer greeting expertise.",
    capabilities: [
      "Intelligent call routing",
      "Professional greetings",
      "Appointment booking",
      "FAQ handling",
      "Multi-department transfer",
    ],
    stats: {
      successRate: 99,
      avgDuration: "1m 45s",
      callsHandled: 6234,
    },
    sampleConversation: [
      "Good morning! Thank you for calling Voicely. This is Emma. How may I direct your call today?",
      "I'd be happy to connect you with our sales team. May I have your name and the nature of your inquiry?",
      "Perfect! I'm transferring you now to Sarah, our senior sales specialist. She'll be with you in just a moment.",
    ],
    demoAgentId: "demo-receptionist-agent",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
  },
  {
    id: "appointment",
    name: "Maya",
    role: "Appointment Agent",
    icon: Calendar,
    image: mayaImg,
    video: mayaVideo,
    color: "from-violet-600 to-purple-600",
    gradient: "from-violet-600/20 to-purple-600/20",
    description: "Intelligent appointment scheduling AI with seamless calendar integration and automated reminder systems.",
    capabilities: [
      "Smart scheduling",
      "Calendar integration",
      "Automated reminders",
      "Conflict detection",
      "Meeting coordination",
    ],
    stats: {
      successRate: 98,
      avgDuration: "2m 30s",
      callsHandled: 4156,
    },
    sampleConversation: [
      "Hi! I'm Maya, your Appointment Specialist at Voicely. I'm ready to help you schedule a consultation. What type of meeting works best for you?",
      "Perfect! I can book you for a 30-minute platform demo. Would Tuesday at 2 PM EST or Wednesday at 10 AM EST work better for your schedule?",
      "Excellent! I've booked you for Tuesday at 2 PM EST. You'll receive a calendar invite with the meeting link within the next minute. Is there anything else I can help you with?",
    ],
    demoAgentId: "demo-followup-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
  },
  {
    id: "support",
    name: "Alice",
    role: "Customer Support Agent",
    icon: Headphones,
    image: aliceImg,
    video: aliceVideo,
    color: "from-blue-600 to-cyan-600",
    gradient: "from-blue-600/20 to-cyan-600/20",
    description: "Elite technical support AI with instant knowledge base access and empathetic problem resolution.",
    capabilities: [
      "Instant issue diagnosis",
      "Expert troubleshooting",
      "Proactive solutions",
      "Priority escalation",
      "Real-time knowledge sync",
    ],
    stats: {
      successRate: 98,
      avgDuration: "2m 50s",
      callsHandled: 4891,
    },
    sampleConversation: [
      "Hello! I'm Alice, your dedicated support specialist. I'm here to make sure you get exactly what you need. What can I help you with today?",
      "I've identified the issue in our system. Let me walk you through the solution with clear step-by-step guidance.",
      "Perfect! Everything should be working smoothly now. I've also added proactive monitoring to prevent this in the future. Anything else I can help with?",
    ],
    demoAgentId: "demo-support-agent",
    voiceId: "cgSgspJ2msm6clMCkdW9",
  },
];

export default function MobileTeam() {
  const { user, isLoading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const prevAgentIdRef = useRef<string | null>(null);

  // Voice chat for selected agent - use hook's transcript directly
  // MUST be called before any conditional returns (Rules of Hooks)
  const voiceChat = useVoiceChat({
    agentId: selectedAgent?.demoAgentId || "",
    voiceId: selectedAgent?.voiceId || "",
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

  // Clear transcript and end session when agent changes
  useEffect(() => {
    const currentAgentId = selectedAgent?.demoAgentId;
    
    // If agent changed (not just initial mount)
    if (prevAgentIdRef.current !== null && prevAgentIdRef.current !== currentAgentId) {
      // End active session (this also clears the transcript)
      if (voiceChat.isActive) {
        voiceChat.endSession();
      }
    }
    
    // Update previous agent ID
    prevAgentIdRef.current = currentAgentId || null;
  }, [selectedAgent?.demoAgentId, voiceChat.isActive, voiceChat.endSession]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const startDemo = (agent: AgentType) => {
    setSelectedAgent(agent);
  };

  const handleStartVoiceCall = async () => {
    await voiceChat.startSession();
  };

  const handleEndVoiceCall = () => {
    voiceChat.endSession();
  };

  // Close dialog handler
  const handleCloseDialog = () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
    }
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] pb-28 md:pb-8 relative overflow-hidden">
      {/* Safe Area Support */}
      <div className="h-safe-top" />
      
      {/* Premium Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute inset-0" 
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto">

      {/* Hero Title Section */}
      <div className="relative w-full mb-12 px-5 md:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400 mb-3">
            Voicely Core Team
          </h2>
          <p className="text-gray-400 text-lg">
            Meet our specialized AI voice agents
          </p>
        </motion.div>
      </div>

      {/* Agent Cards with Images - Responsive Grid */}
      <div className="px-5 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
        {agentTypes.map((agent, index) => {
          const Icon = agent.icon;
          
          return (
            <motion.div
              key={agent.id}
              className="rounded-3xl bg-black/80 border border-purple-500/40 backdrop-blur-xl overflow-hidden relative shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              data-testid={`agent-card-${agent.id}`}
            >
              {/* Agent Portrait Header - Expanded */}
              <div className="relative h-60 overflow-hidden">
                {agent.video ? (
                  <video
                    src={agent.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                )}
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent`} />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-black/90 backdrop-blur-xl border-green-500/50 text-green-300 font-bold px-3 py-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse mr-2" />
                    Online
                  </Badge>
                </div>

                {/* Agent Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border shadow-lg"
                      style={{
                        borderColor: agent.id === 'sales' ? 'rgba(139, 92, 246, 0.6)' :
                                     agent.id === 'support' ? 'rgba(37, 99, 235, 0.6)' :
                                     agent.id === 'scheduler' ? 'rgba(5, 150, 105, 0.6)' :
                                     'rgba(220, 38, 38, 0.6)',
                      }}
                    >
                      <Icon className="w-8 h-8" style={{
                        color: agent.id === 'sales' ? 'rgb(139, 92, 246)' :
                               agent.id === 'support' ? 'rgb(37, 99, 235)' :
                               agent.id === 'scheduler' ? 'rgb(5, 150, 105)' :
                               'rgb(220, 38, 38)',
                      }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{agent.name}</h3>
                      <p className="text-base text-gray-300">{agent.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Details - Simplified */}
              <div className="p-6">
                {/* Single Stats Summary */}
                <div className="flex items-center justify-between mb-5 p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/20">
                  <div className="text-center flex-1">
                    <div 
                      className="text-xl font-black text-green-400 mb-1"
                      data-testid={`stat-${agent.id}-success`}
                    >
                      {agent.stats.successRate}%
                    </div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                  <div className="h-10 w-px bg-purple-500/30" />
                  <div className="text-center flex-1">
                    <div 
                      className="text-xl font-black text-purple-400 mb-1"
                      data-testid={`stat-${agent.id}-calls`}
                    >
                      {agent.stats.callsHandled.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Calls</div>
                  </div>
                  <div className="h-10 w-px bg-purple-500/30" />
                  <div className="text-center flex-1">
                    <div 
                      className="text-xl font-black text-cyan-400 mb-1"
                      data-testid={`stat-${agent.id}-duration`}
                    >
                      {agent.stats.avgDuration}
                    </div>
                    <div className="text-xs text-gray-500">Avg Time</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-base mb-5 leading-relaxed">{agent.description}</p>

                {/* Top 2 Capabilities Only */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {agent.capabilities.slice(0, 2).map(capability => (
                    <Badge
                      key={capability}
                      variant="outline"
                      className="text-sm border-gray-700 text-gray-300 bg-black/40 px-3 py-1.5"
                    >
                      {capability}
                    </Badge>
                  ))}
                </div>

                {/* Action Button - Large Touch Target - Glassmorphism */}
                <Button
                  onClick={() => startDemo(agent)}
                  className={`w-full h-14 bg-gradient-to-r ${agent.gradient} backdrop-blur-xl border border-white/30 text-white font-bold text-lg rounded-2xl hover-elevate shadow-lg`}
                  style={{ 
                    background: agent.id === 'sales' ? 'linear-gradient(to right, rgba(147, 51, 234, 0.15), rgba(139, 92, 246, 0.15))' :
                                agent.id === 'support' ? 'linear-gradient(to right, rgba(8, 145, 178, 0.15), rgba(37, 99, 235, 0.15))' :
                                agent.id === 'scheduler' ? 'linear-gradient(to right, rgba(22, 163, 74, 0.15), rgba(5, 150, 105, 0.15))' :
                                'linear-gradient(to right, rgba(234, 88, 12, 0.15), rgba(220, 38, 38, 0.15))',
                    borderColor: agent.id === 'sales' ? 'rgba(139, 92, 246, 0.5)' :
                                 agent.id === 'support' ? 'rgba(37, 99, 235, 0.5)' :
                                 agent.id === 'scheduler' ? 'rgba(5, 150, 105, 0.5)' :
                                 'rgba(220, 38, 38, 0.5)',
                  }}
                  data-testid={`button-demo-${agent.id}`}
                >
                  <Phone className="w-6 h-6 mr-2" />
                  Try Live Demo
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Voice Demo Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-[#0A0B1E]/98 border-purple-500/40 backdrop-blur-xl max-w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-3xl p-0 overflow-hidden flex flex-col">
          {selectedAgent && (
            <>
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.4) transparent' }}>
                {/* Agent Portrait Header - Clean without overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden flex-shrink-0">
                  {selectedAgent.video ? (
                    <video
                      src={selectedAgent.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={selectedAgent.image}
                      alt={selectedAgent.name}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1E]/20 via-transparent to-transparent" />
                  
                  {/* READY Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      variant="outline" 
                      className="bg-black/95 backdrop-blur-2xl border-purple-500/50 text-purple-300 font-black px-3 py-2 text-xs shadow-xl"
                      style={{ boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
                      data-testid="badge-ready-status"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-1.5" />
                      READY
                    </Badge>
                  </div>
                  
                  {/* Close Button - Improved positioning for safe area */}
                  <button
                    onClick={handleCloseDialog}
                    className="absolute top-6 left-4 min-w-[48px] min-h-[48px] rounded-full bg-red-600/90 backdrop-blur-xl border-2 border-red-400/50 flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-lg z-20"
                    style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                    data-testid="button-close-demo"
                  >
                    <X className="w-6 h-6 text-white font-bold" />
                  </button>
                </div>

                {/* Agent Info Card - Below Portrait */}
                <div className="px-5 py-4 bg-gradient-to-br from-purple-900/40 to-black/80 backdrop-blur-xl border-b border-purple-500/30">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border shadow-xl"
                      style={{ 
                        borderColor: selectedAgent.id === 'sales' ? 'rgba(139, 92, 246, 0.6)' :
                                     selectedAgent.id === 'support' ? 'rgba(37, 99, 235, 0.6)' :
                                     selectedAgent.id === 'scheduler' ? 'rgba(5, 150, 105, 0.6)' :
                                     'rgba(220, 38, 38, 0.6)',
                      }}
                    >
                      <selectedAgent.icon 
                        className="w-7 h-7"
                        style={{
                          color: selectedAgent.id === 'sales' ? 'rgb(139, 92, 246)' :
                                 selectedAgent.id === 'support' ? 'rgb(37, 99, 235)' :
                                 selectedAgent.id === 'scheduler' ? 'rgb(5, 150, 105)' :
                                 'rgb(220, 38, 38)',
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-white mb-0.5">{selectedAgent.name}</h2>
                      <p className="text-sm text-gray-300">{selectedAgent.role}</p>
                    </div>
                  </div>
                </div>

                {/* Voice Demo Content */}
                <div className="p-4 sm:p-5">
                {/* Live Indicator */}
                {voiceChat.isActive && (
                  <div className="mb-3 flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-purple-900/20 border border-purple-500/30">
                    <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-xs sm:text-sm text-purple-300 font-mono font-bold">LIVE_DEMO_ACTIVE</span>
                  </div>
                )}

                {/* Real-Time Transcript - Only this scrolls */}
                <div 
                  ref={scrollRef}
                  className="space-y-3 max-h-[28vh] sm:max-h-[32vh] overflow-y-auto mb-3 sm:mb-4"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.4) transparent' }}
                >
                  {voiceChat.transcript.length === 0 && !voiceChat.isActive && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm mb-2">Ready to start voice conversation</p>
                      <p className="text-gray-500 text-xs">Click "Start Voice Demo" below to begin</p>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {voiceChat.transcript.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-black/60 border border-purple-500/30"
                      >
                        <div className="flex items-start gap-3">
                          {msg.speaker === 'agent' ? (
                            <div 
                              className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
                              style={{
                                borderColor: selectedAgent.id === 'sales' ? 'rgba(139, 92, 246, 0.6)' :
                                             selectedAgent.id === 'support' ? 'rgba(37, 99, 235, 0.6)' :
                                             selectedAgent.id === 'scheduler' ? 'rgba(5, 150, 105, 0.6)' :
                                             'rgba(220, 38, 38, 0.6)',
                              }}
                            >
                              <img 
                                src={selectedAgent.image}
                                alt={selectedAgent.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-gray-500/50 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-mono mb-1">
                              {msg.speaker === 'agent' ? selectedAgent.name : 'You'}
                            </p>
                            <p className="text-gray-200 text-base leading-relaxed">{msg.text}</p>
                            
                            {/* Voice Waveform - Last message when speaking - FIXED HEIGHT */}
                            {msg.speaker === 'agent' && i === voiceChat.transcript.length - 1 && voiceChat.isSpeaking && (
                              <div className="flex gap-1 mt-2 h-4 items-end">
                                {[0, 1, 2, 3].map((j) => (
                                  <motion.div
                                    key={j}
                                    className={`w-1 bg-gradient-to-t ${selectedAgent.color} rounded-full`}
                                    animate={{
                                      height: ["6px", "16px", "6px"],
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      repeat: Infinity,
                                      delay: j * 0.1,
                                      ease: "easeInOut",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Voice Controls */}
                {!voiceChat.isActive ? (
                  <Button
                    onClick={handleStartVoiceCall}
                    className={`w-full h-12 sm:h-14 bg-gradient-to-r ${selectedAgent.color} text-white font-bold rounded-2xl text-base sm:text-lg`}
                    data-testid="button-start-voice"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Start Voice Demo
                  </Button>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Status Panel */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
                      <div className="flex items-center justify-around gap-2">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-1">
                            <div className={`absolute inset-0 rounded-full overflow-hidden ${voiceChat.isSpeaking ? 'ring-2 ring-purple-400' : 'ring-1 ring-purple-400/30'}`}>
                              <img 
                                src={selectedAgent.image} 
                                alt={selectedAgent.name}
                                className="w-full h-full object-cover"
                              />
                              <div className={`absolute inset-0 bg-purple-500/40 ${voiceChat.isSpeaking ? 'animate-pulse' : ''}`} />
                            </div>
                            {voiceChat.isSpeaking && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex gap-0.5 h-6">
                                  {[0, 1, 2, 3, 4].map((j) => (
                                    <motion.div
                                      key={j}
                                      className="w-0.5 bg-white rounded-full"
                                      animate={{
                                        height: ["8px", "20px", "8px"],
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        delay: j * 0.1,
                                        ease: "easeInOut",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono">VOICE</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-1">
                            <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono">AI ACTIVE</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full ${voiceChat.isRecording ? 'bg-green-500/30 border-green-400' : 'bg-green-500/20 border-green-400/30'} border flex items-center justify-center mx-auto mb-1`}>
                            <Mic className={`w-6 h-6 ${voiceChat.isRecording ? 'text-green-300' : 'text-green-400'}`} />
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono">RECORDING</p>
                        </div>
                      </div>
                    </div>

                    {/* End Call Button - Shown only when active (backup control) */}
                    <Button
                      onClick={handleEndVoiceCall}
                      variant="outline"
                      className="w-full h-12 sm:h-14 bg-red-500/10 border-red-500/40 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 text-base sm:text-lg"
                      data-testid="button-end-voice"
                    >
                      <PhoneOff className="w-5 h-5 mr-2" />
                      End Voice Call
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* STICKY FOOTER - Always Visible Exit Control */}
            {voiceChat.isActive && (
              <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-[#0A0B1E]/95 to-transparent backdrop-blur-xl border-t border-red-500/30 flex-shrink-0 z-30">
                <Button
                  onClick={handleEndVoiceCall}
                  className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all"
                  style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
                  data-testid="button-sticky-end-session"
                >
                  <PhoneOff className="w-6 h-6 mr-2" />
                  End Session
                </Button>
              </div>
            )}
          </>
        )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
