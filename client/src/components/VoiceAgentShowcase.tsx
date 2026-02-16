import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Headphones, Calendar, UserPlus, Phone, X, Bot, User, Activity, Sparkles, MessageSquare, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useVoiceChat, TranscriptEntry } from "@/hooks/useVoiceChat";
import { useToast } from "@/hooks/use-toast";
import { AGENT_DEMO_CONFIGS } from "@/config/agentDemos";
import { ParticleField } from "@/components/ParticleField";

type DemoMode = 'chat' | 'voice';

export default function VoiceAgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENT_DEMO_CONFIGS[0] | null>(null);
  const [demoMode, setDemoMode] = useState<DemoMode>('chat');
  const [isTransferring, setIsTransferring] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevAgentIdRef = useRef<string | null>(null);
  const transferTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const hasAutoLoggedInRef = useRef(false);

  // Auto-login for demo users (dev mode only)
  useEffect(() => {
    const autoLogin = async () => {
      if (hasAutoLoggedInRef.current) return;
      if (import.meta.env.PROD) return;
      hasAutoLoggedInRef.current = true;

      try {
        await fetch("/api/dev-login", { method: "POST" });
        console.log('[DESKTOP VOICE] Auto-login successful');
      } catch (error) {
        console.error('[DESKTOP VOICE] Auto-login failed:', error);
      }
    };

    autoLogin();
  }, []);

  const voiceChat = useVoiceChat({
    agentId: selectedAgent?.agentId || "",
    voiceId: selectedAgent?.voiceId || "",
    onTransfer: (targetAgentId, targetAgentName) => {
      console.log('[TRANSFER] Initiating transfer to:', targetAgentName, targetAgentId);
      
      // Cancel any pending transfer
      if (transferTimeoutRef.current) {
        clearTimeout(transferTimeoutRef.current);
        transferTimeoutRef.current = null;
        console.log('[TRANSFER] Cancelled pending transfer');
      }
      
      // End current session
      voiceChat.endSession();
      
      // Show transfer notification
      toast({
        title: `Transferring to ${targetAgentName}`,
        description: `Connecting you with ${targetAgentName}...`,
      });
      
      // Find target agent config
      const targetAgent = AGENT_DEMO_CONFIGS.find(a => a.agentId === targetAgentId);
      
      // Minimal delay (50ms) to avoid stray audio packets, then switch immediately
      transferTimeoutRef.current = setTimeout(() => {
        transferTimeoutRef.current = null;
        if (targetAgent) {
          setIsTransferring(true); // Flag to auto-start new session
          setSelectedAgent(targetAgent); // Component will re-render with new agent
        }
      }, 50);
    },
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
    const currentAgentId = selectedAgent?.agentId;
    
    if (prevAgentIdRef.current !== null && prevAgentIdRef.current !== currentAgentId) {
      if (voiceChat.isActive && !isTransferring) {
        // Only end session if NOT transferring (transfer already ended it)
        voiceChat.endSession();
      }
    }
    
    prevAgentIdRef.current = currentAgentId || null;
  }, [selectedAgent?.agentId, voiceChat.isActive, voiceChat.endSession, isTransferring]);

  // Auto-start session after transfer - wait for voiceChat to be ready
  useEffect(() => {
    if (isTransferring && selectedAgent && !voiceChat.isActive && voiceChat.isReady) {
      console.log('[TRANSFER] Voice chat ready - starting session with new agent:', selectedAgent.name, selectedAgent.agentId);
      
      const startTransferSession = async () => {
        try {
          await voiceChat.startSession();
          console.log('[TRANSFER] New session started successfully with agentId:', selectedAgent.agentId);
          setIsTransferring(false); // Clear transfer flag
        } catch (error) {
          console.error('[TRANSFER] Failed to start new session:', error);
          setIsTransferring(false);
        }
      };
      
      // Start immediately - no arbitrary delay needed since we're checking isReady
      startTransferSession();
    }
  }, [isTransferring, selectedAgent, voiceChat.isActive, voiceChat.isReady, voiceChat.startSession]);

  const handleStartVoiceCall = async () => {
    await voiceChat.startSession();
  };

  const handleEndVoiceCall = () => {
    voiceChat.endSession();
  };

  const handleCloseDialog = () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
    }
    setSelectedAgent(null);
  };

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-black">
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/40 backdrop-blur-xl mb-8"
            style={{ boxShadow: "0 0 50px rgba(139,92,246,0.5)" }}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-bold text-purple-300">
              VOICE AGENT SHOWCASE
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-gray-200">Experience </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 relative inline-block">
              Ultra-Low Latency
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/60 via-violet-600/60 to-cyan-600/60 blur-[100px] -z-10" />
            </span>
            <br />
            <span className="text-gray-200">AI Voice Agents</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience ultra-low latency AI voice agents delivering human-like conversations with sub-250ms response times. Production-ready for enterprise deployment.
          </p>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {AGENT_DEMO_CONFIGS.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                className="rounded-3xl bg-black/80 border border-purple-500/40 backdrop-blur-xl overflow-hidden relative shadow-2xl hover-elevate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-testid={`agent-card-${agent.id}`}
              >
                {/* Agent Portrait */}
                <div className="relative h-48 overflow-hidden">
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
                      src={agent.portrait}
                      alt={agent.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  
                  {/* Online Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-black/90 backdrop-blur-xl border-green-500/50 text-green-300 font-bold px-2 py-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
                      ONLINE
                    </Badge>
                  </div>

                  {/* Agent Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xl flex items-center justify-center border`}
                        style={{ borderColor: agent.glowColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: agent.glowColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                        <p className="text-sm text-gray-300">{agent.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-4">{agent.description}</p>

                  <Button
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full h-11 bg-gradient-to-r ${agent.gradient} text-white font-bold rounded-xl`}
                    data-testid={`button-demo-${agent.id}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Try Live Demo
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Voice Demo Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className={`${demoMode === 'voice' && voiceChat.isActive ? 'bg-[#0A0B1E] max-w-full h-screen' : 'bg-[#0A0B1E]/98 max-w-[95vw] sm:max-w-[600px] max-h-[90vh]'} border-purple-500/40 backdrop-blur-xl rounded-3xl p-0 overflow-hidden flex flex-col`}>
          {selectedAgent && (
            <>
            {/* Voice Mode - URL Particle View */}
            {demoMode === 'voice' && voiceChat.isActive ? (
              <div className="relative h-screen w-full overflow-hidden bg-[#0A0B1E]">
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
                
                {/* ParticleField Background */}
                <ParticleField 
                  isActive={voiceChat.isActive} 
                  isSpeaking={voiceChat.isSpeaking}
                  primaryColor="#8B5CF6"
                  secondaryColor="#06B6D4"
                />

                {/* Close Button */}
                <button
                  onClick={handleCloseDialog}
                  className="absolute top-6 left-6 z-50 min-w-[56px] min-h-[56px] rounded-full bg-red-600/90 backdrop-blur-xl border-2 border-red-400/50 flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-2xl"
                  style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}
                  data-testid="button-close-demo"
                >
                  <X className="w-7 h-7 text-white font-bold" />
                </button>

                {/* Agent Info Overlay - Top Center */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40"
                >
                  <div className="bg-black/60 backdrop-blur-2xl border border-purple-500/40 rounded-2xl px-6 py-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-xl flex items-center justify-center border shadow-xl"
                        style={{ borderColor: selectedAgent.glowColor }}
                      >
                        <selectedAgent.icon 
                          className="w-6 h-6"
                          style={{ color: selectedAgent.glowColor }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                        <p className="text-sm text-gray-300">{selectedAgent.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Live Transcript Overlay - Bottom */}
                {voiceChat.transcript.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-2xl"
                  >
                    <div className="bg-black/80 backdrop-blur-2xl border border-purple-500/40 rounded-2xl p-4 shadow-2xl max-h-64 overflow-y-auto">
                      <div className="space-y-3">
                        {voiceChat.transcript.slice(-3).map((msg, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {msg.speaker === 'agent' ? (
                              <div 
                                className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
                                style={{ borderColor: selectedAgent.glowColor }}
                              >
                                <img 
                                  src={selectedAgent.portrait}
                                  alt={selectedAgent.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-black/40 border border-gray-500/50 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-mono mb-1">
                                {msg.speaker === 'agent' ? selectedAgent.name : 'You'}
                              </p>
                              <p className="text-gray-200 text-sm leading-relaxed">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* End Demo Button - Bottom Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-8 right-8 z-40"
                >
                  <Button
                    onClick={handleEndVoiceCall}
                    className="h-14 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl text-lg shadow-2xl"
                    data-testid="button-end-voice"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    End Demo
                  </Button>
                </motion.div>
              </div>
            ) : (
              // Chat Mode - Traditional Dialog View
              <>
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.4) transparent' }}>
                {/* Agent Portrait Header */}
                <div className="relative h-64 overflow-hidden flex-shrink-0">
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
                      src={selectedAgent.portrait}
                      alt={selectedAgent.name}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1E]/20 via-transparent to-transparent" />
                  
                  {/* READY Badge */}
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
                  
                  {/* Close Button */}
                  <button
                    onClick={handleCloseDialog}
                    className="absolute top-6 left-4 min-w-[48px] min-h-[48px] rounded-full bg-red-600/90 backdrop-blur-xl border-2 border-red-400/50 flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-lg z-20"
                    style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                    data-testid="button-close-demo"
                  >
                    <X className="w-6 h-6 text-white font-bold" />
                  </button>
                </div>

                {/* Agent Info */}
                <div className="px-5 py-4 bg-gradient-to-br from-purple-900/40 to-black/80 backdrop-blur-xl border-b border-purple-500/30">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border shadow-xl"
                      style={{ borderColor: selectedAgent.glowColor }}
                    >
                      <selectedAgent.icon 
                        className="w-7 h-7"
                        style={{ color: selectedAgent.glowColor }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-white mb-0.5">Voicely {selectedAgent.name}</h2>
                      <p className="text-sm text-gray-300">{selectedAgent.role}</p>
                    </div>
                  </div>
                </div>

                {/* Voice Demo Content */}
                <div className="p-4 sm:p-5">
                  {/* LIVE Scenario Badge */}
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-300 font-mono font-bold">LIVE SCENARIO</span>
                    </div>
                    <p className="text-sm text-gray-300">{selectedAgent.scenario}</p>
                  </div>

                  {/* Live Indicator */}
                  {voiceChat.isActive && (
                    <div className="mb-3 flex items-center justify-center gap-2 p-3 rounded-2xl bg-purple-900/20 border border-purple-500/30">
                      <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-sm text-purple-300 font-mono font-bold">LIVE_DEMO_ACTIVE</span>
                    </div>
                  )}

                  {/* Live Transcript */}
                  <div 
                    ref={scrollRef}
                    className="space-y-3 max-h-[28vh] sm:max-h-[32vh] overflow-y-auto mb-4"
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
                          data-testid={`transcript-message-${i}`}
                        >
                          <div className="flex items-start gap-3">
                            {msg.speaker === 'agent' ? (
                              <div 
                                className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
                                style={{ borderColor: selectedAgent.glowColor }}
                              >
                                <img 
                                  src={selectedAgent.portrait}
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
                              <p className="text-xs text-gray-500 font-mono mb-1" data-testid={`text-speaker-${i}`}>
                                {msg.speaker === 'agent' ? `Voicely ${selectedAgent.name}` : 'You'}
                              </p>
                              <p className="text-gray-200 text-base leading-relaxed" data-testid={`text-message-${i}`}>{msg.text}</p>
                              
                              {/* Voice Waveform */}
                              {msg.speaker === 'agent' && i === voiceChat.transcript.length - 1 && voiceChat.isSpeaking && (
                                <div className="flex gap-1 mt-2 h-4 items-end">
                                  {[0, 1, 2, 3].map((j) => (
                                    <motion.div
                                      key={j}
                                      className={`w-1 bg-gradient-to-t ${selectedAgent.color} rounded-full`}
                                      animate={{ height: ["6px", "16px", "6px"] }}
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
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setDemoMode('chat');
                          handleStartVoiceCall();
                        }}
                        className={`flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl text-lg`}
                        data-testid="button-start-chat"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Chat Demo
                      </Button>
                      <Button
                        onClick={() => {
                          setDemoMode('voice');
                          handleStartVoiceCall();
                        }}
                        className={`flex-1 h-14 bg-gradient-to-r ${selectedAgent.gradient} text-white font-bold rounded-2xl text-lg`}
                        data-testid="button-start-voice"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Voice Demo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEndVoiceCall}
                      className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl text-lg"
                      data-testid="button-end-voice"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      End Demo
                    </Button>
                  )}
                </div>
              </div>
              </>
            )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
