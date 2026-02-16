import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function AnimatedBanner() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* Ultra-Intense Animated Background - Reduced on mobile */}
      <div className="absolute inset-0 bg-black">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="purpleFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="purpleFlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.5" />
            </linearGradient>
            <filter id="intenseGlow">
              <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Massive flowing ribbons */}
          <motion.path
            d="M-100,400 Q300,150 600,300 T1300,400"
            fill="none"
            stroke="url(#purpleFlow1)"
            strokeWidth="100"
            filter="url(#intenseGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                "M-100,400 Q300,150 600,300 T1300,400",
                "M-100,350 Q300,280 600,360 T1300,350",
                "M-100,400 Q300,150 600,300 T1300,400",
              ]
            }}
            transition={{ 
              pathLength: { duration: 2.5, ease: "easeOut" },
              opacity: { duration: 1.5 },
              d: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          <motion.path
            d="M-100,500 Q400,650 700,420 T1300,500"
            fill="none"
            stroke="url(#purpleFlow2)"
            strokeWidth="80"
            filter="url(#intenseGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                "M-100,500 Q400,650 700,420 T1300,500",
                "M-100,540 Q400,620 700,450 T1300,540",
                "M-100,500 Q400,650 700,420 T1300,500",
              ]
            }}
            transition={{ 
              pathLength: { duration: 2.5, delay: 0.4, ease: "easeOut" },
              opacity: { duration: 1.5, delay: 0.4 },
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          <motion.path
            d="M1400,250 Q850,380 450,220 T-200,250"
            fill="none"
            stroke="url(#purpleFlow1)"
            strokeWidth="70"
            filter="url(#intenseGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                "M1400,250 Q850,380 450,220 T-200,250",
                "M1400,280 Q850,350 450,260 T-200,280",
                "M1400,250 Q850,380 450,220 T-200,250",
              ]
            }}
            transition={{ 
              pathLength: { duration: 2.5, delay: 0.8, ease: "easeOut" },
              opacity: { duration: 1.5, delay: 0.8 },
              d: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </svg>
      </div>

      {/* Ultra-Bright Glowing Orbs - Responsive sizing */}
      <motion.div
        className="absolute top-1/4 left-1/5 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-[80px] sm:blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(168,85,247,0.6) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 60, 0],
          y: [0, -40, 0],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/5 w-80 h-80 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] sm:blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(124,58,237,0.7) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -80, 0],
          y: [0, 50, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-[60px] sm:blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(168,85,247,0.6) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content - Mobile Optimized */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Refined Badge - Touch friendly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
            <span className="text-purple-300 font-medium text-xs sm:text-sm">Revolutionizing Voice AI</span>
          </motion.div>

          {/* Mobile-Optimized Headline - Capped at text-4xl on mobile */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            <span className="block text-gray-200">
              Automate Everything
            </span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-purple-400">
                With AI Voice Agents
              </span>
            </span>
          </h1>

          {/* Refined Subheadline - Mobile optimized */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Deploy autonomous agents that handle calls, close deals, and grow your business{" "}
            <span className="text-purple-400 font-medium">while you sleep</span>
          </motion.p>

          {/* Mobile-Optimized CTAs - Touch friendly, stacked on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/25 min-h-[48px] py-6 sm:py-7 text-base" 
              data-testid="button-join-waitlist"
            >
              Join Waitlist →
            </Button>
            <Link href="/#faq">
              <Button 
                size="lg" 
                variant="outline" 
                className="backdrop-blur-sm border-purple-400/30 text-gray-200 font-medium min-h-[48px] py-6 sm:py-7 text-base" 
                data-testid="button-pricing"
              >
                Pricing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-60 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </section>
  );
}
