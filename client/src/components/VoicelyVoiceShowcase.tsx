import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Brain, Sparkles, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { AGENT_DEMO_CONFIGS } from "@/config/agentDemos";

// Inner component that gets remounted per agent to ensure clean hook lifecycle
function VoiceShowcaseContent({ agent }: { agent: typeof AGENT_DEMO_CONFIGS[0] }) {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const { toast } = useToast();

  // Initialize voice chat with current agent (with voiceId!)
  const voiceChat = useVoiceChat({
    agentId: agent.agentId,
    voiceId: agent.voiceId,
  });

  // Track call duration
  useEffect(() => {
    if (!voiceChat.isActive) {
      setCallDuration(0);
      startTimeRef.current = null;
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = new Date();
    }

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        setCallDuration(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceChat.isActive]);

  // Determine if agent is speaking based on latest transcript entry
  const isAgentSpeaking = voiceChat.transcript.length > 0 && 
    voiceChat.transcript[voiceChat.transcript.length - 1].speaker === 'agent';

  // Debug: Log transcript changes
  useEffect(() => {
    console.log('[DESKTOP SHOWCASE] Transcript updated:', {
      count: voiceChat.transcript.length,
      entries: voiceChat.transcript.map(e => ({ speaker: e.speaker, text: e.text.substring(0, 30) }))
    });
  }, [voiceChat.transcript]);

  // Animate waveform while agent is speaking
  useEffect(() => {
    if (!isAgentSpeaking) {
      setAnimationFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [isAgentSpeaking]);

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

  const handleStartDemo = async () => {
    console.log('[DESKTOP VOICE] Start demo button clicked');
    startTimeRef.current = new Date();
    setCallDuration(0);
    
    try {
      console.log('[DESKTOP VOICE] Starting voice session...');
      await voiceChat.startSession();
      console.log('[DESKTOP VOICE] Voice session started successfully');
    } catch (error) {
      console.error('[DESKTOP VOICE] Failed to start demo:', error);
      toast({
        title: "Connection Error",
        description: "Failed to start voice demo. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const handleEndDemo = async () => {
    console.log('[DESKTOP VOICE] Ending voice session...');
    voiceChat.endSession();
    setCallDuration(0);
    startTimeRef.current = null;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-8 items-start"
    >
      {/* LEFT - Agent Avatar & Voice Visualizer */}
      <div
        className="relative rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-xl p-8 overflow-hidden"
        style={{ boxShadow: `0 0 80px ${agent.glowColor}` }}
      >
        {/* Agent Portrait */}
        <div className="relative mb-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/20 mb-4">
            <img
              src={agent.desktopImage || agent.portrait}
              alt={`Voicely ${agent.name}`}
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-green-500/40">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-bold text-green-300">
                {voiceChat.isActive ? 'LIVE' : 'ONLINE'}
              </span>
            </div>
          </div>

          {/* Agent Name Badge - Below Image */}
          <div 
            className={`px-6 py-4 rounded-xl bg-gradient-to-r ${agent.gradient} backdrop-blur-xl border border-white/20`}
            style={{ boxShadow: `0 0 30px ${agent.glowColor}` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-black text-white">
                Voicely
              </span>
              <h3 className="text-xl font-black text-white">
                {agent.name}
              </h3>
            </div>
            <p className="text-sm text-white/80">{agent.description}</p>
          </div>
        </div>

        {/* Voice Waveform Visualizer */}
        <div className="relative h-32 rounded-xl bg-black/40 border border-purple-500/20 p-4 mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-full bg-gradient-to-t ${agent.gradient}`}
                animate={{
                  height: isAgentSpeaking
                    ? [
                        `${20 + Math.sin((i + animationFrame) * 0.5) * 15}%`,
                        `${40 + Math.sin((i + animationFrame) * 0.5) * 30}%`,
                        `${20 + Math.sin((i + animationFrame) * 0.5) * 15}%`,
                      ]
                    : "10%",
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.02,
                }}
              />
            ))}
          </div>
        </div>

        {/* Voice Demo Control Buttons */}
        {!voiceChat.isActive ? (
          <Button
            onClick={handleStartDemo}
            disabled={!voiceChat.isReady}
            size="lg"
            className={`w-full bg-gradient-to-r ${agent.gradient} hover:opacity-90 text-white font-black py-6 text-lg relative overflow-hidden disabled:opacity-50`}
            style={{ boxShadow: `0 0 40px ${agent.glowColor}` }}
            data-testid="button-start-demo"
          >
            <Mic className="w-6 h-6 mr-2" />
            {voiceChat.isReady ? "Start Voice Demo" : "Initializing..."}
          </Button>
        ) : (
          <Button
            onClick={handleEndDemo}
            size="lg"
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-black py-6 text-lg relative overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)' }}
            data-testid="button-stop-demo"
          >
            <PhoneOff className="w-6 h-6 mr-2" />
            Stop Demo {callDuration > 0 && `(${formatDuration(callDuration)})`}
          </Button>
        )}
      </div>

      {/* RIGHT - Live Transcript & Intelligence */}
      <div className="space-y-6">
        {/* Scenario Badge */}
        <div 
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 backdrop-blur-xl"
          data-testid="scenario-badge"
        >
          <Brain className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live Scenario</div>
            <div className="text-sm font-bold text-white" data-testid={`text-scenario-${agent.id}`}>
              {agent.scenario}
            </div>
          </div>
        </div>

        {/* Live Transcript */}
        <div className="rounded-2xl border-2 border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-black/40 backdrop-blur-xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto" data-testid="transcript-panel">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Live Transcript</h4>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {voiceChat.transcript.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click "Start Voice Demo" to begin real-time conversation</p>
                </div>
              ) : (
                voiceChat.transcript.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: entry.speaker === "agent" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${entry.speaker === "agent" ? "justify-start" : "justify-end"}`}
                    data-testid={`transcript-message-${idx}`}
                  >
                    <div className={`
                      max-w-[80%] px-4 py-3 rounded-xl
                      ${entry.speaker === "agent"
                        ? `bg-gradient-to-r ${agent.gradient} text-white`
                        : "bg-white/10 text-gray-200"
                      }
                    `}>
                      <div className="text-xs font-semibold mb-1 opacity-70" data-testid={`text-speaker-${idx}`}>
                        {entry.speaker === "agent" ? `Voicely ${agent.name}` : "You"}
                      </div>
                      <p className="text-sm leading-relaxed" data-testid={`text-message-${idx}`}>{entry.text}</p>
                      <div className="text-xs opacity-60 mt-1" data-testid={`text-time-${idx}`}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Connection Status */}
        {voiceChat.isActive && (
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
                Live
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Duration
              </div>
              <div className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${agent.gradient}`}>
                {formatDuration(callDuration)}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Messages
              </div>
              <div className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${agent.gradient}`}>
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
  );
}

// Outer component that handles agent selection and auto-login
export default function VoicelyVoiceShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_DEMO_CONFIGS[0]);
  const hasAutoLoggedInRef = useRef(false);

  // Auto-login for demo users (dev mode only)
  useEffect(() => {
    const autoLogin = async () => {
      if (hasAutoLoggedInRef.current) return;
      if (import.meta.env.PROD) return; // Only in development
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

  const handleAgentSelect = (agent: typeof AGENT_DEMO_CONFIGS[0]) => {
    setSelectedAgent(agent);
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
            <span className="text-sm font-bold text-purple-300">
              VOICELY VOICE AGENTS
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-gray-200">Experience </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 relative inline-block">
              Real-Time AI
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/60 via-violet-600/60 to-cyan-600/60 blur-[100px] -z-10" />
            </span>
            <br />
            <span className="text-gray-200">Voice Conversations</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch our AI agents handle real customer conversations with human-like intelligence
          </p>
        </motion.div>

        {/* Agent Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {AGENT_DEMO_CONFIGS.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <Button
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                variant={isSelected ? "default" : "ghost"}
                size="lg"
                className={`
                  px-6 py-6 relative overflow-hidden group transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-r ${agent.gradient} text-white border-2 border-white/20`
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }
                `}
                style={isSelected ? { boxShadow: `0 0 40px ${agent.glowColor}` } : {}}
                data-testid={`button-agent-${agent.id}`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <span className="font-bold">{agent.role}</span>
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
              </Button>
            );
          })}
        </motion.div>

        {/* Main Voice Demo Canvas */}
        <VoiceShowcaseContent agent={selectedAgent} />
      </div>
    </section>
  );
}
