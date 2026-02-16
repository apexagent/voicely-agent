import { motion } from "framer-motion";
import { Mic, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function AliceVoiceChatInterface() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#0A0B1E]">
      {/* Dark Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-2 border-cyan-500/30 rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 0 30px rgba(6,182,212,0.2), inset 0 0 20px rgba(6,182,212,0.05)"
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-cyan-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-violet-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-xl font-bold text-cyan-400">A</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900" />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-cyan-400 font-bold text-lg tracking-wider">
                    ALICE - APEX LABS INTELLIGENCE AGENT
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                      ● ONLINE
                    </Badge>
                    <span className="text-gray-500 text-xs">Advanced AI Engine</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-500 text-xs">256-bit Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Status Dots */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="bg-black/90 backdrop-blur-sm p-6">
            {/* System Log */}
            <div className="font-mono text-xs space-y-2 mb-6">
              <div className="text-green-400">
                <span className="text-gray-600">&gt;&gt;</span> SYS <span className="text-gray-600">22:26:10</span>
              </div>
              <div className="text-cyan-300">
                ALICE NEURAL CORE v2.0 INITIALIZED | AI ENGINE ACTIVE | VOICE + TEXT INTERFACE ONLINE
              </div>
            </div>

            {/* Alice's Message */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-violet-600 p-0.5 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">A</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-bold text-sm">ALICE</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                      ● NEURAL AI
                    </Badge>
                    <span className="text-gray-600 text-xs">22:26:10</span>
                  </div>
                  <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Welcome! I'm ALICE, your APEX LABS Intelligence Agent.
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We specialize in taking businesses to the next level with industry leading Web & AI solutions. Whether you need upgraded web development that sets you apart, tokenization and blockchain integration to bring your assets on-chain, or AI automation to streamline your operations—we deliver exceptional quality that drives real results.
                    </p>
                    <p className="text-cyan-400 text-sm mt-3 font-medium">
                      What are you looking to build?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Mode Indicators */}
            <div className="font-mono text-xs space-y-2 mb-6">
              <div className="text-gray-600">
                <span className="text-gray-700">&gt;&gt;</span> SYS <span className="text-gray-700">22:26:15</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Mic className="w-3 h-3" />
                <span>VOICE MODE ACTIVE | Press & hold to speak</span>
              </div>
              <div className="text-gray-600 mt-2">
                <span className="text-gray-700">&gt;&gt;</span> SYS <span className="text-gray-700">22:26:18</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Mic className="w-3 h-3" />
                <span>VOICE MODE ACTIVE | Press & hold to speak</span>
              </div>
            </div>
          </div>

          {/* Bottom Section - Ready to Connect */}
          <div className="bg-gradient-to-b from-black/90 to-gray-900/90 p-8 border-t border-cyan-500/20">
            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("text")}
                className={`${
                  mode === "text"
                    ? "bg-gray-800 border-cyan-500/50 text-cyan-400"
                    : "border-gray-700 text-gray-500"
                }`}
                data-testid="button-text-mode"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("voice")}
                className={`${
                  mode === "voice"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 border-transparent text-white"
                    : "border-gray-700 text-gray-500"
                }`}
                data-testid="button-voice-mode"
              >
                <Phone className="w-4 h-4 mr-2" />
                Voice
              </Button>
            </div>

            {/* Alice Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative mb-6"
                animate={{
                  scale: isCallActive ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isCallActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-violet-600 p-1"
                  style={{
                    boxShadow: isCallActive 
                      ? "0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(168,85,247,0.4)"
                      : "0 0 30px rgba(6,182,212,0.3)"
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400">
                      A
                    </span>
                  </div>
                </div>
                {isCallActive && (
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-gray-900 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mic className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>

              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-violet-400 mb-2">
                Ready to Connect
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {isCallActive ? "Voice conversation in progress" : "Tap below to start voice conversation"}
              </p>

              {/* Call Button */}
              {!isCallActive ? (
                <Button
                  size="lg"
                  onClick={() => setIsCallActive(true)}
                  className="bg-gradient-to-r from-purple-600 via-violet-500 to-cyan-500 text-white font-semibold px-8"
                  data-testid="button-start-voice-call"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Start Voice Call
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setIsCallActive(false)}
                  className="bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold px-8"
                  data-testid="button-end-voice-call"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
