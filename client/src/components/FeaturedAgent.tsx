import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Radio,
  Zap,
  Activity,
  TrendingUp
} from "lucide-react";
import agentVideo from "@assets/media_1763022658020.mp4";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface TerminalLog {
  timestamp: string;
  type: "system" | "user" | "agent" | "status";
  content: string;
  icon?: typeof Zap;
}

// Voice waveform bars
function VoiceWaveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-1 h-12">
      {[...Array(32)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-purple-500 via-violet-400 to-cyan-400 rounded-full"
          animate={isActive ? {
            height: [`${20 + Math.random() * 10}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 10}%`],
          } : { height: "20%" }}
          transition={{
            duration: 0.6 + Math.random() * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  );
}

export default function FeaturedAgent() {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Use demo agent ID for voice streaming
  const {
    isActive: isVoiceActive,
    isRecording,
    isSpeaking: isAgentSpeaking,
    transcript,
    error: voiceError,
  } = useVoiceChat({
    agentId: "demo_voice_agent",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
  });

  // Simulated appointment booking conversation with Maya
  const terminalLogs: TerminalLog[] = [
    { timestamp: "14:32:01", type: "system", content: "🔵 Incoming call connected..." },
    { timestamp: "14:32:02", type: "agent", content: "MAYA: Hi! Thanks for calling Wellness Spa. I'm Maya, your appointment assistant. How can I help you today?" },
    { timestamp: "14:32:05", type: "user", content: "CALLER: Hi, I'd like to book a massage appointment." },
    { timestamp: "14:32:06", type: "agent", content: "MAYA: Perfect! I'd love to help you schedule that. We offer Swedish, deep tissue, and hot stone massages. Which one interests you?" },
    { timestamp: "14:32:09", type: "user", content: "CALLER: Deep tissue sounds good." },
    { timestamp: "14:32:10", type: "agent", content: "MAYA: Great choice! Our deep tissue massage is 90 minutes. Are you looking for this week or next week?" },
    { timestamp: "14:32:13", type: "user", content: "CALLER: This Thursday would be ideal if you have availability." },
    { timestamp: "14:32:14", type: "agent", content: "MAYA: Let me check Thursday for you... I have 2:00 PM, 3:30 PM, and 5:00 PM available. Which works best?" },
    { timestamp: "14:32:17", type: "user", content: "CALLER: 3:30 would be perfect." },
    { timestamp: "14:32:18", type: "agent", content: "MAYA: Excellent! I have you down for Thursday at 3:30 PM for a 90-minute deep tissue massage. Can I get your name and phone number?" },
    { timestamp: "14:32:22", type: "user", content: "CALLER: Sure, it's Jennifer Martinez, 555-0123." },
    { timestamp: "14:32:23", type: "agent", content: "MAYA: Perfect, Jennifer! You're all set. I've sent a confirmation text to 555-0123. See you Thursday at 3:30!" },
    { timestamp: "14:32:26", type: "status", content: "✅ Appointment booked successfully | Call duration: 25 seconds", icon: TrendingUp },
    { timestamp: "14:32:27", type: "system", content: "🟢 AGENT AVAILABLE | Ready for next call", icon: Radio },
  ];

  // Show transcript in terminal or fallback to mock logs if not active
  const displayLogs = isVoiceActive 
    ? transcript.filter(t => t.isFinal).map((t, idx) => ({
        timestamp: t.timestamp.toLocaleTimeString('en-US', { hour12: false }),
        type: t.speaker === 'user' ? 'user' as const : 'agent' as const,
        content: `${t.speaker.toUpperCase()}: ${t.text}`,
      }))
    : terminalLogs;

  // Typing animation effect
  useEffect(() => {
    if (isVoiceActive || currentLogIndex >= terminalLogs.length) return;

    const currentLog = terminalLogs[currentLogIndex];
    const fullText = currentLog.content;
    let charIndex = 0;

    setIsTyping(true);
    setTypingText("");

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setTypingText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        // Move to next log after a brief pause
        setTimeout(() => {
          setCurrentLogIndex(prev => prev + 1);
        }, 300);
      }
    }, 30); // Typing speed: 30ms per character

    return () => clearInterval(typingInterval);
  }, [currentLogIndex, terminalLogs.length, isVoiceActive]);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[120px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-2 border-purple-500/50 backdrop-blur-xl mb-8"
            animate={{
              boxShadow: [
                "0 0 40px rgba(139,92,246,0.4)",
                "0 0 80px rgba(139,92,246,0.7)",
                "0 0 40px rgba(139,92,246,0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            data-testid="badge-live-demo"
          >
            <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              LIVE VOICE AGENT DEMO
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
            data-testid="text-section-title"
          >
            <span className="text-gray-200">Experience Your </span>
            <br />
            <span className="relative inline-block">
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Voicely AI Agent
              </motion.span>
              <motion.div 
                className="absolute -inset-8 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 rounded-3xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                style={{
                  filter: "blur(80px)",
                }}
              />
            </span>
          </motion.h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto" data-testid="text-section-subtitle">
            Watch a live appointment booking conversation powered by Voicely
          </p>
        </motion.div>

        {/* Main Layout - Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Terminal with Real Logs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-[#0F1535]/90 to-[#0A0B1E]/90 backdrop-blur-xl shadow-2xl"
            data-testid="container-terminal"
          >
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-b-2 border-purple-500/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={voicelyLogo} alt="Voicely" className="h-8" data-testid="img-voicely-logo" />
                  <div className="h-4 w-px bg-purple-500/50" />
                  <Badge className="bg-green-600/30 border-green-500/50 text-green-400 font-bold" data-testid="badge-live-status">
                    <Radio className="w-3 h-3 mr-1 animate-pulse" />
                    LIVE AGENT SESSION
                  </Badge>
                </div>
                {/* macOS Buttons */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>

            {/* Terminal Logs */}
            <div className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto font-mono text-sm bg-black/60">
              <div className="space-y-2">
                {/* Voice error display */}
                {voiceError && (
                  <div className="text-red-400 mb-3" data-testid="voice-error">
                    <span className="text-gray-600 mr-3">[ERROR]</span>
                    {voiceError}
                  </div>
                )}
                
                {/* Status indicator */}
                {isVoiceActive && (
                  <div className="text-cyan-400 mb-3 flex items-center gap-2" data-testid="voice-status">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>
                      {isRecording && "🎤 Listening..."} 
                      {isAgentSpeaking && "🔊 Agent speaking..."}
                      {!isRecording && !isAgentSpeaking && "⚡ Connected - Speak now"}
                    </span>
                  </div>
                )}

                {/* Completed logs */}
                {(isVoiceActive ? displayLogs : displayLogs.slice(0, currentLogIndex)).map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      ${log.type === "system" ? "text-cyan-400" : ""}
                      ${log.type === "status" ? "text-green-400" : ""}
                      ${log.type === "user" ? "text-purple-300" : ""}
                      ${log.type === "agent" ? "text-white" : ""}
                    `}
                    data-testid={`log-entry-${idx}`}
                  >
                    <span className="text-gray-600 mr-3">[{log.timestamp}]</span>
                    {log.content}
                  </motion.div>
                ))}
                
                {/* Currently typing line */}
                {!isVoiceActive && isTyping && currentLogIndex < terminalLogs.length && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      ${terminalLogs[currentLogIndex].type === "system" ? "text-cyan-400" : ""}
                      ${terminalLogs[currentLogIndex].type === "status" ? "text-green-400" : ""}
                      ${terminalLogs[currentLogIndex].type === "user" ? "text-purple-300" : ""}
                      ${terminalLogs[currentLogIndex].type === "agent" ? "text-white" : ""}
                    `}
                    data-testid={`log-typing-${currentLogIndex}`}
                  >
                    <span className="text-gray-600 mr-3">[{terminalLogs[currentLogIndex].timestamp}]</span>
                    {typingText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block ml-1"
                    >
                      ▊
                    </motion.span>
                  </motion.div>
                )}
                
                {/* Blinking Cursor when done */}
                {!isVoiceActive && !isTyping && currentLogIndex >= terminalLogs.length && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    ▊
                  </motion.span>
                )}
              </div>
            </div>

            {/* Voice Waveform at bottom */}
            {isAgentSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t-2 border-purple-500/20 bg-purple-900/20"
                data-testid="container-waveform"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold text-green-400">Agent Speaking...</span>
                </div>
                <VoiceWaveform isActive={isAgentSpeaking} />
              </motion.div>
            )}
          </motion.div>

          {/* Right: Agent Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
            data-testid="container-agent-card"
          >
            {/* Holographic Frame */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-cyan-900/20 backdrop-blur-xl p-8">
              {/* Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              {/* Agent Image */}
              <div className="relative mb-8">
                <motion.div
                  className="relative rounded-2xl overflow-hidden border-2 border-purple-500/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <video 
                    src={agentVideo} 
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                    data-testid="video-agent"
                  />
                  {/* Holographic Scan Line */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.4) 50%, transparent 100%)",
                      height: "100px",
                    }}
                    animate={{
                      y: ["-100px", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>

              {/* Agent Info */}
              <div className="relative space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 mb-2 font-display" data-testid="text-agent-title">
                    Your Voicely Agent
                  </h3>
                  <p className="text-gray-400 text-lg mb-6" data-testid="text-agent-subtitle">
                    AI-Powered, Always Available, Lightning Fast
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-purple-900/30 border border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-400 mb-1" data-testid="stat-accuracy">93%</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-cyan-900/30 border border-cyan-500/30">
                    <div className="text-3xl font-bold text-cyan-400 mb-1" data-testid="stat-uptime">24/7</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-900/30 border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400 mb-1" data-testid="stat-response">&lt;2s</div>
                    <div className="text-xs text-gray-400">Response</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
