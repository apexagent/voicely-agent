import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Phone, Clock, UserPlus, Mic, User, Sparkles, Headphones, PhoneOff,
  Activity, Zap, Shield, Target, BarChart3, Brain, Globe, CheckCircle2,
  Award, MessageSquare, Flame, Book, Play, Lightbulb, Settings, HelpCircle,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AgentTabNav } from "@/components/mobile/AgentTabNav";
import { AgentHeroPanel } from "@/components/mobile/AgentHeroPanel";
import { VoiceWaveformSimple } from "@/components/mobile/VoiceWaveformSimple";
import { ParticleField } from "@/components/ParticleField";
import sarahPortrait from "@assets/9bd3c5fc-f5c8-410c-b35a-c3aa27718c92_1762607585722.png";
import sarahVideo from "@assets/media (3)_1763217316569.mp4";
import emmaPortrait from "@assets/6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png";
import emmaVideo from "@assets/98e47d38-5d04-4b20-b6af-b04ad653be40_1763287410229.mp4";
import alicePortrait from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";
import aliceVideo from "@assets/5d034abd-46cd-4a72-96b1-8ea39d46c2d2_1763287049942.mp4";
import mayaPortrait from "@assets/77912688-291a-4713-b923-54cec485ff01_1762607585723.png";
import mayaVideo from "@assets/media (4)_1763223796489.mp4";
import voicelyIconPath from "@assets/New vvvv_1763478691091.png";
import voicelyWaveformIcon from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378653714.png";

// Agent scenarios - 4 core agents with investment-grade metrics
const agentScenarios = [
  {
    id: "support",
    name: "Alice",
    role: "Support Agent",
    description: "Expert troubleshooting",
    icon: Headphones,
    color: "from-purple-600 to-pink-600", // Purple/Pink for Support
    agentId: "demo-support-agent",
    voiceId: "cgSgspJ2msm6clMCkdW9",
    portrait: alicePortrait,
    video: aliceVideo,
    scenario: "Technical support",
    capabilities: [
      "92% first-call resolution rate",
      "Multi-language support (40+ languages)",
      "Knowledge base integration & learning",
      "Sentiment analysis & escalation routing"
    ]
  },
  {
    id: "sales",
    name: "Sarah",
    role: "Sales Agent",
    description: "Closes deals automatically",
    icon: TrendingUp,
    color: "from-blue-600 to-cyan-600", // Blue/Cyan for Sales
    agentId: "demo-sales-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    portrait: sarahPortrait,
    video: sarahVideo,
    scenario: "Qualifying inbound lead",
    capabilities: [
      "Qualify 500+ leads/day with 68% conversion to SQL",
      "Dynamic objection handling with 78% close rate",
      "Intelligent follow-up sequencing",
      "Real-time CRM integration & pipeline updates"
    ]
  },
  {
    id: "receptionist",
    name: "Emma",
    role: "Receptionist",
    description: "Professional call routing",
    icon: Phone,
    color: "from-green-600 to-emerald-600", // Green for Receptionist
    agentId: "demo-receptionist-agent",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    portrait: emmaPortrait,
    video: emmaVideo,
    scenario: "Routing customer inquiry",
    capabilities: [
      "Handle 10,000+ concurrent calls instantly",
      "Smart routing based on intent recognition",
      "Appointment scheduling & calendar sync",
      "24/7/365 coverage with zero wait times"
    ]
  },
  {
    id: "followup",
    name: "Maya",
    role: "Follow-Up Agent",
    description: "Re-engagement & nurturing",
    icon: UserPlus,
    color: "from-orange-600 to-amber-600", // Orange/Amber for Follow-Up
    agentId: "demo-followup-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    portrait: mayaPortrait,
    video: mayaVideo,
    scenario: "Cart recovery outreach",
    capabilities: [
      "Automated cart recovery with 42% success rate",
      "Personalized nurture campaigns at scale",
      "Multi-touch attribution tracking",
      "Behavioral trigger-based outreach"
    ]
  },
];

type DemoMode = 'chat' | 'voice';

export default function MobileAgent() {
  const { user, isLoading } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState(agentScenarios[0]);
  const [demoMode, setDemoMode] = useState<DemoMode>('chat');
  const [callDuration, setCallDuration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const prevAgentIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Voice chat integration - use hook's transcript directly
  // MUST be called before any conditional returns (Rules of Hooks)
  const voiceChat = useVoiceChat({
    agentId: selectedScenario.agentId,
    voiceId: selectedScenario.voiceId,
  });

  // Auto-scroll transcript
  useEffect(() => {
    console.log('[MOBILE AGENT] Transcript updated, count:', voiceChat.transcript.length);
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [voiceChat.transcript]);

  // Clear transcript and end session when scenario changes
  useEffect(() => {
    const currentAgentId = selectedScenario.agentId;
    
    if (prevAgentIdRef.current !== null && prevAgentIdRef.current !== currentAgentId) {
      console.log('[VOICE] Agent changed, cleaning up previous agent resources');
      // End active session if running (this also clears the transcript)
      if (voiceChat.isActive) {
        voiceChat.endSession();
      }
      // Reset call duration
      setCallDuration(0);
      startTimeRef.current = null;
    }
    
    prevAgentIdRef.current = currentAgentId;
  }, [selectedScenario.agentId, voiceChat.isActive]);

  // Call duration timer
  useEffect(() => {
    if (voiceChat.isActive && startTimeRef.current) {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [voiceChat.isActive]);

  // Show toast when voice chat errors occur
  useEffect(() => {
    if (voiceChat.error) {
      toast({
        title: "Voice Demo Error",
        description: voiceChat.error,
        variant: "destructive",
      });
    }
  }, [voiceChat.error, toast]);

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

  const handleStartDemo = async () => {
    console.log('[MOBILE] ===== START DEMO BUTTON CLICKED =====');
    console.log('[MOBILE] voiceChat.isReady:', voiceChat.isReady);
    console.log('[MOBILE] voiceChat.isActive:', voiceChat.isActive);
    
    // Scroll to top when starting session for the first time
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    startTimeRef.current = new Date();
    setCallDuration(0);
    
    try {
      console.log('[MOBILE] About to call voiceChat.startSession()...');
      await voiceChat.startSession();
      console.log('[MOBILE] ✅ Voice session started successfully!');
    } catch (error) {
      console.error('[MOBILE] ❌ Failed to start demo:', error);
      
      // Show alert on mobile for debugging
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast({
        title: "Voice Demo Failed",
        description: errorMsg || "Could not start voice session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDemo = async () => {
    console.log('[MOBILE] Toggle demo called, isActive:', voiceChat.isActive);
    if (voiceChat.isActive) {
      console.log('[MOBILE] Ending session...');
      await handleEndDemo();
    } else {
      console.log('[MOBILE] Starting new session...');
      await handleStartDemo();
    }
  };

  const handleEndDemo = async () => {
    voiceChat.endSession();
    setCallDuration(0);
    startTimeRef.current = null;
    toast({
      title: "Demo Ended",
      description: "Voice conversation ended. Transcript saved.",
    });
  };

  const handleTabChange = (tabId: string) => {
    const scenario = agentScenarios.find(s => s.id === tabId);
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };

  const isAgentSpeaking = voiceChat.transcript.length > 0 && voiceChat.transcript[voiceChat.transcript.length - 1]?.speaker === 'agent';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get primary and secondary colors for particles
  const getPrimaryColor = () => {
    if (selectedScenario.color.includes('purple')) return '#8B5CF6';
    if (selectedScenario.color.includes('blue')) return '#06B6D4';
    if (selectedScenario.color.includes('green')) return '#10B981';
    return '#F97316';
  };

  const getSecondaryColor = () => {
    if (selectedScenario.color.includes('purple')) return '#EC4899';
    if (selectedScenario.color.includes('blue')) return '#7C3AED';
    if (selectedScenario.color.includes('green')) return '#6EE7B7';
    return '#FB923C';
  };

  return (
    <>
      {/* Voice Demo Mode - Particle View (Exactly like /agent/alice) */}
      {demoMode === 'voice' && voiceChat.isActive && (
        <div className="fixed inset-0 z-50 bg-[#0A0B1E]">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
          
          {/* Particle Field Background */}
          <ParticleField 
            isActive={voiceChat.isActive} 
            isSpeaking={isAgentSpeaking}
            primaryColor={getPrimaryColor()}
            secondaryColor={getSecondaryColor()}
          />

          {/* Main Content - Centered with button, status at bottom */}
          <div className="relative z-10 flex flex-col items-center justify-between h-screen px-6 py-8 pb-32">
            {/* Spacer to push button to center */}
            <div className="flex-1" />
            
            {/* Central Button Section with Particle Effect */}
            <div className="relative flex items-center justify-center w-full max-w-4xl">
              {/* Main "Call Voicely" Button - Clean pill design */}
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
                <div 
                  className="relative flex items-center gap-4 px-6 py-3.5 bg-[#1A1F3A] border border-[#273056] rounded-full shadow-[0_0_18px_rgba(139,92,246,0.35)] overflow-hidden"
                  data-testid="button-voicely-active"
                >
                  {/* Icon on Left */}
                  <div className="w-9 h-9 rounded-full bg-[#2A3F5F]/60 border border-gray-600/40 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={voicelyIconPath} 
                      alt="Voicely Icon" 
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  
                  {/* Text in Center */}
                  <span className="text-white font-semibold text-base tracking-wide whitespace-nowrap">
                    {isAgentSpeaking ? `${selectedScenario.name} speaking...` : "Listening..."}
                  </span>
                  
                  {/* Animated Soundwave Bars on Right */}
                  <div className="flex items-center gap-0.5 h-5 ml-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 rounded-full"
                        style={{
                          background: isAgentSpeaking 
                            ? `linear-gradient(to top, ${getPrimaryColor()}, ${getSecondaryColor()})`
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
                </div>
              </motion.div>

              {/* End Call Button - Below main button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-20"
              >
                <Button
                  onClick={handleEndDemo}
                  size="icon"
                  variant="outline"
                  className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full w-10 h-10"
                  data-testid="button-end-voice"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Spacer to push transcript to bottom */}
            <div className="flex-1" />

            {/* Live Transcript - Styled Box Like URL Page */}
            <AnimatePresence mode="wait">
              {voiceChat.transcript.length > 0 && (
                <motion.div
                  key={voiceChat.transcript[voiceChat.transcript.length - 1].text}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    opacity: { duration: 0.3 }
                  }}
                  className="absolute bottom-48 sm:bottom-52 left-0 right-0 px-6"
                >
                  <div className="text-center max-w-4xl mx-auto">
                    {(() => {
                      const lastEntry = voiceChat.transcript[voiceChat.transcript.length - 1];
                      const isAgent = lastEntry.speaker === 'agent';
                      return (
                        <div className="inline-block">
                          <motion.div
                            className={`
                              px-6 py-3 rounded-lg
                              ${isAgent 
                                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30' 
                                : 'bg-white/5 border border-white/10'
                              }
                              backdrop-blur-xl shadow-2xl
                            `}
                            animate={{
                              boxShadow: isAgent ? [
                                `0 0 20px ${getPrimaryColor()}30`,
                                `0 0 40px ${getPrimaryColor()}50`,
                                `0 0 20px ${getPrimaryColor()}30`,
                              ] : undefined,
                            }}
                            transition={{
                              duration: 2,
                              repeat: isAgent ? Infinity : 0,
                            }}
                          >
                            <div className="mb-1">
                              <span className={`text-xs font-semibold ${
                                isAgent ? 'text-cyan-300' : 'text-purple-300'
                              }`}>
                                {isAgent ? selectedScenario.name : 'You'}
                              </span>
                            </div>
                            <p className={`text-base sm:text-lg font-medium ${
                              isAgent ? 'text-white' : 'text-gray-300'
                            }`}>
                              {lastEntry.text}
                            </p>
                          </motion.div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Interface */}
      <div className="min-h-screen bg-gradient-to-b from-[#0A0B1E] via-[#0F0F23] to-[#0A0B1E] pb-28 md:pb-8 relative overflow-x-hidden overflow-y-auto">
        {/* Background Effects - Animated grid matching agent color */}
        <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(${
                selectedScenario.color.includes('purple') ? 'rgba(139, 92, 246, 0.08)' :
                selectedScenario.color.includes('blue') ? 'rgba(59, 130, 246, 0.08)' :
                selectedScenario.color.includes('green') ? 'rgba(16, 185, 129, 0.08)' :
                'rgba(249, 115, 22, 0.08)'
              } 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${
                selectedScenario.color.includes('purple') ? 'rgba(139, 92, 246, 0.08)' :
                selectedScenario.color.includes('blue') ? 'rgba(59, 130, 246, 0.08)' :
                selectedScenario.color.includes('green') ? 'rgba(16, 185, 129, 0.08)' :
                'rgba(249, 115, 22, 0.08)'
              } 1.5px, transparent 1.5px)
            `,
            backgroundSize: '50px 50px',
            transition: 'background-image 0.3s ease',
          }}
        />
      </div>

      <div className="relative w-full px-4 md:px-6 py-4 md:py-6">
        {/* Investment-Grade Header Section */}
        <div className="mb-6 md:mb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Voice Agent Showcase
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-3xl">
              Experience ultra-low latency AI voice agents delivering human-like conversations with sub-250ms response times. Production-ready for enterprise deployment.
            </p>
          </motion.div>

        </div>

        {/* Tab Navigation */}
        <div className="mb-6 max-w-7xl mx-auto">
          <AgentTabNav
            tabs={agentScenarios.map(s => ({ id: s.id, name: s.name, icon: s.icon }))}
            activeTab={selectedScenario.id}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Two-Column Layout - Centered with max-width on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* LEFT COLUMN - Agent Portrait + Controls */}
          <div className="space-y-4 md:space-y-5">
            {/* Hero Panel */}
            <AgentHeroPanel
              portrait={selectedScenario.portrait}
              video={selectedScenario.video}
              name={selectedScenario.name}
              role={selectedScenario.role}
              description={selectedScenario.description}
              gradient={selectedScenario.color}
              isOnline={voiceChat.isReady}
              isReady={voiceChat.isReady}
            />

            {/* Voice Demo Control Buttons */}
            {!voiceChat.isActive ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  onClick={() => {
                    setDemoMode('chat');
                    handleStartDemo();
                  }}
                  disabled={!voiceChat.isReady}
                  className="h-12 sm:h-14 md:h-16 font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/40 hover:border-blue-400/60 text-blue-300 hover:text-blue-200 backdrop-blur-sm transition-all"
                  data-testid="button-start-chat-demo"
                >
                  <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                  <span className="hidden xs:inline">{voiceChat.isReady ? "Chat Demo" : "Wait..."}</span>
                  <span className="xs:hidden">{voiceChat.isReady ? "Chat" : "..."}</span>
                </Button>
                <Button
                  onClick={() => {
                    setDemoMode('voice');
                    handleStartDemo();
                  }}
                  disabled={!voiceChat.isReady}
                  className={`h-12 sm:h-14 md:h-16 font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl border-2 backdrop-blur-sm transition-all ${
                    selectedScenario.color.includes('purple') 
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/40 hover:border-purple-400/60 text-purple-300 hover:text-purple-200' 
                      : selectedScenario.color.includes('blue') 
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/40 hover:border-cyan-400/60 text-cyan-300 hover:text-cyan-200'
                      : selectedScenario.color.includes('green')
                      ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500/40 hover:border-green-400/60 text-green-300 hover:text-green-200'
                      : 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/40 hover:border-orange-400/60 text-orange-300 hover:text-orange-200'
                  }`}
                  data-testid="button-start-voice-demo"
                >
                  <Mic className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                  <span className="hidden xs:inline">{voiceChat.isReady ? "Voice Demo" : "Wait..."}</span>
                  <span className="xs:hidden">{voiceChat.isReady ? "Voice" : "..."}</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-xl border border-green-500/30 rounded-xl p-3 md:p-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 font-bold text-sm md:text-base">CALL ACTIVE - Speak naturally</span>
                  </div>
                </div>
                <Button
                  onClick={handleEndDemo}
                  className="w-full h-14 md:h-16 font-bold text-lg md:text-xl rounded-xl shadow-lg bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 text-white transition-all border border-purple-500/30"
                  style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                  data-testid="button-end-voice-demo"
                >
                  <PhoneOff className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  End Demo
                </Button>
              </div>
            )}


            {/* Waveform Visualization */}
            <div className={`bg-gradient-to-br backdrop-blur-xl border rounded-xl p-3 md:p-4 ${
              selectedScenario.color.includes('purple') ? 'from-purple-900/20 via-violet-900/10 to-pink-900/20 border-purple-500/30' :
              selectedScenario.color.includes('blue') ? 'from-blue-900/20 via-cyan-900/10 to-blue-900/20 border-blue-500/30' :
              selectedScenario.color.includes('green') ? 'from-green-900/20 via-emerald-900/10 to-green-900/20 border-green-500/30' :
              'from-orange-900/20 via-amber-900/10 to-orange-900/20 border-orange-500/30'
            }`}>
              <div className="h-16 md:h-20 lg:h-24 w-full">
                <VoiceWaveformSimple 
                  isActive={isAgentSpeaking} 
                  color={
                    selectedScenario.color.includes('purple') ? 'purple' :
                    selectedScenario.color.includes('blue') || selectedScenario.color.includes('cyan') ? 'cyan' :
                    selectedScenario.color.includes('green') ? 'green' :
                    'orange'
                  } 
                />
              </div>
            </div>

            {/* Agent Capabilities Card */}
            <motion.div
              key={`capabilities-${selectedScenario.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="p-4 md:p-5 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-purple-500/5 border-purple-500/20"
                data-testid={`card-capabilities-${selectedScenario.id}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${selectedScenario.color} flex items-center justify-center`}>
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">Agent Capabilities</h3>
                    <p className="text-xs text-gray-400">Powered by DeepSeek AI</p>
                  </div>
                </div>
                <div className="space-y-2" data-testid={`list-capabilities-${selectedScenario.id}`}>
                  {selectedScenario.capabilities.map((capability, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2"
                      data-testid={`capability-item-${selectedScenario.id}-${idx}`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-gray-300">{capability}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

          </div>

          {/* RIGHT COLUMN - Transcript + Analytics */}
          <div className="flex flex-col min-h-[450px] md:min-h-[520px] lg:min-h-[600px] gap-4 md:gap-5">
            {/* Live Scenario Header */}
            <div className="bg-gradient-to-r from-purple-900/30 to-transparent backdrop-blur-xl border border-purple-500/10 rounded-xl p-3 md:p-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-purple-400 font-semibold">LIVE SCENARIO</div>
                  <div className="text-sm md:text-base text-white font-medium break-words">{selectedScenario.scenario}</div>
                </div>
              </div>
            </div>

            {/* Live Transcript */}
            <div className="flex flex-col flex-1 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl min-h-[360px] md:min-h-[420px] lg:min-h-[520px] max-h-[520px] md:max-h-[600px] lg:max-h-[700px]">
              <div className="p-3 md:p-4 border-b border-purple-500/10 flex-shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Mic className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <h3 className="text-base md:text-lg font-bold text-white break-words">Live Transcript</h3>
                  </div>
                  {voiceChat.isActive && (
                    <Badge variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 flex-shrink-0 whitespace-nowrap">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                      {formatDuration(callDuration)}
                    </Badge>
                  )}
                </div>
              </div>

              <ScrollArea
                ref={scrollRef}
                className="flex-1 min-h-0"
                data-testid="transcript-scroll-area"
              >
                <div className="px-3 md:px-4 pb-4">
                  {voiceChat.transcript.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8 md:py-12">
                      <Mic className="w-10 h-10 md:w-12 md:h-12 mb-3 opacity-30" />
                      <p className="text-xs md:text-sm text-center px-4">
                        Click "Start Voice Demo" to begin conversation
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4 pt-2">
                      {voiceChat.transcript.map((entry, idx) => {
                      const isAgent = entry.speaker === 'agent';
                      const timestamp = entry.timestamp 
                        ? entry.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })
                        : '';

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2 md:gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                        >
                          {isAgent && (
                            <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 border-2 border-purple-500/50">
                              <AvatarImage src={selectedScenario.portrait} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <img src={voicelyWaveformIcon} alt="AI" className="w-5 h-5 object-contain" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} max-w-[80%] md:max-w-[75%] min-w-0`}>
                            <div className="text-xs text-gray-500 mb-1 px-1 break-words max-w-full">
                              {isAgent ? `Voicely ${selectedScenario.role}` : 'Customer'}
                            </div>
                            <div
                              className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 break-words ${
                                isAgent
                                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tl-none'
                                  : 'bg-gray-800/80 text-gray-100 rounded-tr-none'
                              }`}
                            >
                              <p className="text-xs md:text-sm leading-relaxed break-words overflow-visible">{entry.text}</p>
                            </div>
                            {timestamp && <div className="text-xs text-gray-600 mt-1 px-1">{timestamp}</div>}
                          </div>

                          {!isAgent && (
                            <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 border-2 border-gray-600">
                              <AvatarFallback className="bg-gray-700 text-gray-300">
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Smart Suggestions */}
              {voiceChat.suggestions.length > 0 && voiceChat.isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border-t border-purple-500/10"
                  data-testid="suggestions-container"
                >
                  <div className="text-xs text-gray-500 mb-2">Quick replies</div>
                  <div className="flex flex-wrap gap-2">
                    {voiceChat.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        onClick={() => voiceChat.sendSuggestion(suggestion)}
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 text-sm rounded-full"
                        data-testid={`suggestion-chip-${idx}`}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Comprehensive Documentation Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:mt-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Voice Demo Guide
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Everything you need to know about using the Voicely voice platform
            </p>
          </div>

          <Tabs defaultValue="quick-start" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-black/20 border border-purple-500/20 p-1 md:p-2 rounded-xl mb-6">
              <TabsTrigger 
                value="quick-start" 
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white"
                data-testid="tab-quick-start"
              >
                <Play className="w-3 h-3 mr-1" />
                Quick Start
              </TabsTrigger>
              <TabsTrigger 
                value="voice-tech" 
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white"
                data-testid="tab-voice-tech"
              >
                <Zap className="w-3 h-3 mr-1" />
                Voice Tech
              </TabsTrigger>
              <TabsTrigger 
                value="best-practices" 
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white"
                data-testid="tab-best-practices"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Best Practices
              </TabsTrigger>
              <TabsTrigger 
                value="capabilities" 
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white"
                data-testid="tab-capabilities"
              >
                <Brain className="w-3 h-3 mr-1" />
                Agent Guide
              </TabsTrigger>
              <TabsTrigger 
                value="troubleshooting" 
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-white col-span-2 md:col-span-1"
                data-testid="tab-troubleshooting"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Help
              </TabsTrigger>
            </TabsList>

            {/* Quick Start Guide */}
            <TabsContent value="quick-start" className="space-y-4">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/20">
                  <Book className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Getting Started</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="text-base font-bold text-white">Choose Your Agent</h4>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed ml-11">
                      Select from our specialized AI agents above. Each agent is trained for specific business scenarios - sales qualification, customer support, receptionist duties, or follow-up campaigns. Choose the scenario that matches your business needs.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="text-base font-bold text-white">Start Voice Demo</h4>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed ml-11 mb-3">
                      Click the "Start Voice Demo" button to begin your conversation. The agent will greet you instantly and guide you through the scenario.
                    </p>
                    <div className="ml-11 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-xs text-cyan-200 font-semibold mb-1">💡 Pro Tip</p>
                      <p className="text-xs text-gray-300">Allow microphone access when prompted. On mobile, tap anywhere to unlock audio playback if needed.</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="text-base font-bold text-white">Have a Natural Conversation</h4>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed ml-11">
                      Speak naturally as you would in any phone conversation. The AI agent responds in real-time with human-like conversation flow, handling interruptions, follow-up questions, and context seamlessly.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="text-base font-bold text-white">Review Transcript</h4>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed ml-11">
                      Watch the live transcript appear in real-time as you speak. Every conversation is saved with timestamps and sentiment analysis for review in Voice Logs.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Voice Technology */}
            <TabsContent value="voice-tech" className="space-y-4">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/20">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Voice Technology Overview</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Ultra-Low Latency Conversations</h4>
                    <p className="text-sm text-gray-300 leading-relaxed mb-3">
                      Voicely delivers perceived response times under 350ms, making conversations feel completely natural and instantaneous. Our agents respond as fast as a human would in a phone conversation.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-xs text-purple-300 mb-1">Response Time</p>
                        <p className="text-base font-bold text-white">&lt;350ms</p>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-xs text-cyan-300 mb-1">Uptime</p>
                        <p className="text-base font-bold text-white">99.9%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <h5 className="text-sm font-bold text-green-300 mb-2">Natural Voice Quality</h5>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Our agents use enterprise-grade text-to-speech with natural prosody, emotion, and speaking patterns. Each agent has a unique voice personality matched to their role - professional for reception, energetic for sales, empathetic for support.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <h5 className="text-sm font-bold text-cyan-300 mb-2">Real-Time Understanding</h5>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Advanced speech recognition accurately captures your words in real-time, understanding context, intent, and handling multiple accents. The AI processes natural language to understand meaning, not just keywords.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                    <h5 className="text-sm font-bold text-orange-300 mb-2">Conversation Intelligence</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      Our AI doesn't just respond to words - it understands context, remembers conversation history, detects sentiment, and adapts its approach based on your responses.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Context Awareness", "Sentiment Analysis", "Intent Detection", "Memory Retention"].map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs border-orange-400/30 text-orange-200 bg-orange-500/10">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Best Practices */}
            <TabsContent value="best-practices" className="space-y-4">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/20">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Best Practices for AI Conversations</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <h5 className="text-sm font-bold text-green-300">DO: Speak Naturally</h5>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Talk to the AI agent as you would to a human. Use natural language, ask follow-up questions, and interrupt if needed. The agent handles conversation flow like a real person.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <h5 className="text-sm font-bold text-green-300">DO: Be Specific</h5>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      While the agent understands context, being specific helps. Instead of "I need help," try "I'm interested in your pricing for enterprise plans." This gets you better, faster answers.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <h5 className="text-sm font-bold text-green-300">DO: Test Different Scenarios</h5>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Try challenging the agent with objections, technical questions, or edge cases. This demonstrates how the AI handles real-world complexity - exactly what you'll see in production.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-5 h-5 text-cyan-400" />
                      <h5 className="text-sm font-bold text-cyan-300">Mobile Optimization</h5>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      For best mobile experience:
                    </p>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Use headphones or earbuds for clearer audio</li>
                      <li>• Find a quiet environment to reduce background noise</li>
                      <li>• Keep your device within arm's reach for easy controls</li>
                      <li>• Enable auto-brightness for comfortable viewing</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-5 h-5 text-orange-400" />
                      <h5 className="text-sm font-bold text-orange-300">Understanding Response Times</h5>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      You may notice the agent starts responding before you finish speaking - this is intentional! Our zero-lag mode detects when you've completed a thought and responds instantly, just like a human conversation.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Agent Capabilities */}
            <TabsContent value="capabilities" className="space-y-4">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/20">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Agent Capabilities Guide</h3>
                </div>
                
                <div className="space-y-4">
                  {agentScenarios.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/0 border border-purple-500/20"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{agent.name} - {agent.role}</h4>
                            <p className="text-xs text-gray-400">{agent.description}</p>
                          </div>
                        </div>
                        <div className="ml-13 space-y-2">
                          <p className="text-xs font-semibold text-purple-300 mb-2">What {agent.name} Can Do:</p>
                          {agent.capabilities.map((capability, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-300">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Troubleshooting */}
            <TabsContent value="troubleshooting" className="space-y-4">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/20">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Troubleshooting & Help</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h5 className="text-sm font-bold text-red-300 mb-2">🎤 No Audio or Microphone Issues</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">If you can't hear the agent or it can't hear you:</p>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Check browser permissions - allow microphone access</li>
                      <li>• Tap the screen to unlock audio (iOS Safari requirement)</li>
                      <li>• Try using headphones instead of device speakers</li>
                      <li>• Refresh the page and try again</li>
                      <li>• Check your device volume settings</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <h5 className="text-sm font-bold text-orange-300 mb-2">⚡ Slow Response Times</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">If responses feel delayed:</p>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Check your internet connection speed</li>
                      <li>• Close other apps using bandwidth</li>
                      <li>• Move closer to your WiFi router</li>
                      <li>• Try switching from WiFi to cellular (or vice versa)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <h5 className="text-sm font-bold text-yellow-300 mb-2">💬 Transcript Not Updating</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">If you don't see your words appearing:</p>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Speak clearly and at normal volume</li>
                      <li>• Reduce background noise</li>
                      <li>• Check that your microphone isn't muted</li>
                      <li>• End and restart the demo session</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h5 className="text-sm font-bold text-green-300 mb-2">✅ Best Audio Setup</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">For optimal experience:</p>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Use wired or Bluetooth headphones with built-in mic</li>
                      <li>• Find a quiet room with minimal echo</li>
                      <li>• Keep device at comfortable distance (6-12 inches from mouth)</li>
                      <li>• Use latest version of Chrome, Safari, or Firefox</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <h5 className="text-sm font-bold text-cyan-300 mb-2">🔧 Still Having Issues?</h5>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">
                      If problems persist after trying these solutions, check Voice Logs for detailed error messages or contact our support team. Include your browser type, device model, and a description of what's happening.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-200">
                        Chrome 90+
                      </Badge>
                      <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-200">
                        Safari 14+
                      </Badge>
                      <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-200">
                        Firefox 88+
                      </Badge>
                      <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-200">
                        Edge 90+
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
    </>
  );
}
