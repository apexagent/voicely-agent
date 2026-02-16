import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import VoiceWaveform from "./VoiceWaveform";
import FloatingParticles from "./FloatingParticles";
import AnimatedGradientMesh from "./AnimatedGradientMesh";
import aiAgentImage from "@assets/generated_images/Dramatic_purple-lit_AI_agent_5fb03374.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background Effects */}
      <AnimatedGradientMesh />
      <FloatingParticles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf608_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf608_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Massive Background Waveform */}
      <div className="absolute inset-0 opacity-20">
        <VoiceWaveform isPlaying={true} barCount={100} className="h-full" />
      </div>

      {/* Intense Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Epic Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-500/10 border-2 border-purple-500/30 backdrop-blur-xl glow-purple"
            >
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 font-semibold">247 AI Agents Live Now</span>
            </motion.div>
            
            {/* MASSIVE Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-display text-7xl xl:text-[110px] font-bold leading-[0.95] tracking-tight"
            >
              <span className="block text-white">
                AI Voice
              </span>
              <span className="block">
                <span className="relative inline-block">
                  <span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400"
                    style={{
                      textShadow: "0 0 80px rgba(139,92,246,0.8), 0 0 120px rgba(168,85,247,0.6)",
                    }}
                  >
                    Workforce
                  </span>
                  <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/40 to-violet-600/40 blur-[80px] -z-10 animate-pulse" />
                </span>
              </span>
              <span className="block text-white/90 text-6xl xl:text-8xl mt-4">
                That Never Sleeps
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl xl:text-3xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Deploy autonomous AI agents that handle calls, book appointments, and close deals{" "}
              <span className="text-purple-400 font-bold">24/7/365</span>{" "}
              — while you sleep.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <Button 
                size="lg" 
                className="text-2xl px-16 py-10 h-auto bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-bold glow-purple-intense hover:scale-105 transition-all duration-300" 
                data-testid="button-launch-demo"
              >
                Launch Demo →
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-2xl px-16 py-10 h-auto backdrop-blur-xl border-2 border-purple-500/40 hover:border-purple-400/60 hover:bg-purple-500/10 text-white font-semibold transition-all duration-300" 
                data-testid="button-how-it-works"
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-6"
            >
              <Badge variant="outline" className="text-base px-6 py-3 bg-purple-500/10 border-purple-500/30 text-purple-300 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-2" />
                Real-time Conversations
              </Badge>
              <Badge variant="outline" className="text-base px-6 py-3 bg-violet-500/10 border-violet-500/30 text-violet-300 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse mr-2" />
                Human-Like Cadence
              </Badge>
              <Badge variant="outline" className="text-base px-6 py-3 bg-purple-500/10 border-purple-500/30 text-purple-300 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-2" />
                50+ Languages
              </Badge>
            </motion.div>
          </motion.div>

          {/* Right: Dramatic AI Agent Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Ultra-Intense Glow */}
              <div 
                className="absolute -inset-32 blur-[120px] rounded-full animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(168,85,247,0.4) 50%, transparent 100%)",
                }}
              />
              
              {/* Agent Image with Dramatic Effects */}
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    boxShadow: "0 0 100px rgba(139,92,246,0.8), 0 0 200px rgba(168,85,247,0.5), inset 0 0 60px rgba(139,92,246,0.2)",
                  }}
                >
                  <img
                    src={aiAgentImage}
                    alt="AI Voice Agent"
                    className="relative z-10 w-full h-auto"
                    data-testid="img-hero-ai-agent"
                  />
                  
                  {/* Dramatic Bottom Fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  {/* Scanline Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"
                    animate={{
                      y: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -left-10 top-1/4 bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 glow-purple"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-purple-400 font-display">98.7%</div>
                  <div className="text-sm text-gray-400">Accuracy Rate</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -right-10 bottom-1/4 bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 glow-purple"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-purple-400 font-display">24/7</div>
                  <div className="text-sm text-gray-400">Always On</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
