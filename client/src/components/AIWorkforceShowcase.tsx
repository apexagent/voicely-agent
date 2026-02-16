import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import agentFace from "@assets/Untitled design (7)_1762431891098.png";
import { useLocation } from "wouter";

export default function AIWorkforceShowcase() {
  const [, setLocation] = useLocation();

  const handleDemoClick = async () => {
    try {
      const response = await fetch("/api/dev-login", {
        method: "POST",
      });
      if (response.ok) {
        setTimeout(() => {
          setLocation("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Responsive Starfield - Optimized count for performance */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Responsive Glows - Smaller on mobile */}
      <div className="absolute top-0 left-0 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-purple-600/20 rounded-full blur-[120px] sm:blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[350px] sm:w-[500px] md:w-[700px] h-[350px] sm:h-[500px] md:h-[700px] bg-violet-600/20 rounded-full blur-[100px] sm:blur-[160px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[140px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* LEFT SIDE - Epic Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-xl mb-6 sm:mb-8 md:mb-12"
              style={{
                boxShadow: "0 0 40px rgba(139,92,246,0.4)",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              </motion.div>
              <span className="text-xs sm:text-sm font-bold text-purple-300">
                247 AI Agents Live Now
              </span>
            </motion.div>

            {/* Mobile-Optimized Headline - Dramatically Smaller on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8 md:mb-10"
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] sm:leading-[0.95]">
                <span className="text-gray-200">AI Voice</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 relative inline-block">
                  Workforce
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-600/40 to-violet-600/40 blur-[40px] sm:blur-[60px] -z-10" />
                </span>
                <br />
                <span className="text-gray-200">That Never</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 relative inline-block">
                  Sleeps
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-600/40 to-blue-600/40 blur-[40px] sm:blur-[60px] -z-10" />
                </span>
              </h1>
            </motion.div>

            {/* Mobile-Optimized Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8 md:mb-12 max-w-xl"
            >
              Deploy autonomous AI agents that handle calls, book appointments, and close deals{" "}
              <span className="text-purple-400 font-bold">24/7/365</span> — while you sleep.
            </motion.p>

            {/* Mobile-Optimized CTAs - Stacked on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              {/* Launch Demo Button - Full width on mobile, touch-optimized */}
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  onClick={handleDemoClick}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-white font-black px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg relative overflow-hidden group min-h-[48px] sm:min-h-[56px]"
                  style={{
                    boxShadow: "0 0 60px rgba(139,92,246,0.7), 0 0 80px rgba(139,92,246,0.5)",
                  }}
                  data-testid="button-launch-demo"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    Launch Demo
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Animated Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  />
                </Button>
              </motion.div>

              {/* Stats - Horizontal on all sizes */}
              <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start">
                {/* Accuracy Stat */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-violet-400 font-display leading-none mb-1">
                    93.7%
                  </div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Accuracy
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />

                {/* Uptime Stat */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 font-display leading-none mb-1">
                    24/7
                  </div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Uptime
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Responsive Agent Face */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Main Agent Container */}
            <div className="relative">
              {/* Glowing Frame - Smaller border on mobile */}
              <div 
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border sm:border-2 border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-black/40 backdrop-blur-xl p-0.5 sm:p-1"
                style={{
                  boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 0 100px rgba(139,92,246,0.6), inset 0 0 60px rgba(139,92,246,0.1)",
                }}
              >
                {/* Inner Frame */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30">
                  <img
                    src={agentFace}
                    alt="AI Agent"
                    className="w-full h-auto relative z-10"
                    loading="eager"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20" />
                  
                  {/* Floating Particles - Optimized */}
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400"
                      style={{
                        top: `${15 + Math.random() * 70}%`,
                        left: `${10 + Math.random() * 80}%`,
                        boxShadow: "0 0 15px rgba(139,92,246,0.9)",
                      }}
                      animate={{
                        y: [0, -40, 0],
                        x: [0, Math.random() * 30 - 15, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.6, 1.4, 0.6],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Outer Glow Ring - Smaller on mobile */}
              <div 
                className="absolute -inset-4 sm:-inset-8 rounded-3xl sm:rounded-[3rem] opacity-50 pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(circle at center, rgba(139,92,246,0.4), rgba(6,182,212,0.3), transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
