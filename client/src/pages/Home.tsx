import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ArrowRight, Activity, Phone, TrendingUp, Radio, Brain, Cpu, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ParticleField,
  AnimatedGridOverlay,
  GlassPanelV2,
  PageTransition,
  LoadingState,
  HoloHeroBlock,
  IndustryLoadingAnimation,
} from "@/components/cyber";
import Footer from "@/components/Footer";
import heroVideo from "@assets/Camera_red_komodox_202511102222_zyz15_1762788166605.mp4";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

// Import MeetYourWorkforce eagerly so scroll target exists immediately
import MeetYourWorkforce from "@/components/MeetYourWorkforce";
import TalkToVoicelyButton from "@/components/TalkToVoicelyButton";
import IndustriesSection from "@/components/IndustriesSection";
// Lazy load below-the-fold sections for performance
const VoiceAgentShowcase = lazy(() => import("@/components/VoiceAgentShowcase"));
const GlobalActivityMap = lazy(() => import("@/components/GlobalActivityMap"));
const BenefitsCircular = lazy(() => import("@/components/BenefitsCircular"));
const IntegrationsSection = lazy(() => import("@/components/IntegrationsSection"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const CTASection = lazy(() => import("@/components/CTASection"));

// Animated Counter Hook
function useCounter(end: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Voice Waveform Animation Component
function VoiceWaveform() {
  return (
    <div className="absolute bottom-8 left-8 right-8 h-16 flex items-end gap-1 opacity-60">
      {[...Array(32)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-gradient-to-t from-purple-500 via-violet-400 to-cyan-400 rounded-full"
          style={{
            boxShadow: "0 0 10px rgba(139,92,246,0.8)",
          }}
          animate={{
            height: ["20%", `${30 + Math.random() * 70}%`, "20%"],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
}

// Holographic Scan Line Effect
function HolographicScan() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.3) 50%, transparent 100%)",
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
  );
}

// Floating Info Badge Component
function FloatingBadge({ 
  icon: Icon, 
  text, 
  position,
  delay = 0 
}: { 
  icon: any; 
  text: string; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute z-20 hidden lg:block"
      style={position}
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale: { delay, duration: 0.6 },
        rotate: { delay, duration: 0.6 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl border-2 border-purple-500/50 flex items-center gap-2 shadow-2xl"
        style={{
          boxShadow: "0 0 30px rgba(139,92,246,0.6)",
        }}
      >
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-white whitespace-nowrap">{text}</span>
      </div>
    </motion.div>
  );
}

// Energy Ring Pulse Component
function EnergyRings() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-3xl border-2 border-purple-500/30"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Matrix-style Data Stream
function DataStream() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-px bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent"
          style={{
            left: `${10 + i * 12}%`,
            height: "300px",
          }}
          animate={{
            y: ["-300px", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// EXCEPTIONAL HERO SECTION - WEB & MOBILE OPTIMIZED
function EliteHero() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const accuracyCount = useCounter(93, 2500, isVisible);

  const handleDemoClick = async () => {
    try {
      const response = await fetch("/api/dev-login", {
        method: "POST",
      });
      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        setTimeout(() => {
          setLocation("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0B1E] to-black" />
      
      {/* Video Background with Compression */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [object-position:center] md:[object-position:-5%_center]"
          style={{
            opacity: 0.75,
            filter: 'brightness(0.9) contrast(1.1)',
            transform: 'scale(1.15)',
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Light overlay for subtle depth */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Animated Grid */}
      <AnimatedGridOverlay color="purple" animated className="opacity-15" />
      
      {/* Cinematic Atmosphere - Layered Gradients */}
      <motion.div 
        className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-purple-600/30 via-violet-600/20 to-transparent rounded-full"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "blur(140px)",
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/3 w-[700px] h-[700px] bg-gradient-to-tl from-cyan-500/25 via-blue-500/15 to-transparent rounded-full"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "blur(120px)",
        }}
      />
      
      {/* Lens Flare Sweep - Cyan/Purple */}
      <motion.div
        className="absolute top-1/4 right-0 w-2 h-96 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent"
        animate={{
          x: ["100%", "-200%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
        style={{
          filter: "blur(20px)",
        }}
      />
      
      {/* Particles */}
      <div className="hidden lg:block">
        <ParticleField count={40} color="mixed" speed="slow" size="sm" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 w-full">
        <div className="flex flex-col items-start">
          {/* Content - instant visibility with subtle animation */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-3xl"
          >
            {/* Trust Badge */}
            <motion.div
              className="inline-flex items-center mb-8 px-5 py-3 rounded-xl bg-black/60 backdrop-blur-xl border border-cyan-500/40"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="badge-enterprise-trusted"
            >
              <span className="text-sm font-bold text-white">
                Enterprise-Grade Voice AI
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] mb-6 pr-2">
              <span className="text-white block">AI Voice</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 block">
                Workforce
              </span>
              <span className="text-white block">That Never</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 block">
                Sleeps
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-100 mb-10 leading-relaxed max-w-xl font-semibold">
              Deploy autonomous AI agents that handle calls, book appointments, and close deals{" "}
              <span className="text-purple-400 font-bold">24/7/365</span> — while you sleep.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Industry-themed loading fallback for lazy sections
function IndustryLoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-transparent via-[#0A0B1E]/50 to-transparent">
      <IndustryLoadingAnimation size="md" showText={true} />
    </div>
  );
}

// Main Home Component with Page Transition
export default function Home() {
  return (
    <PageTransition mode="cyber">
      <div className="min-h-screen bg-[#0A0B1E]">
        
        {/* Above-the-fold: Render immediately for performance */}
        <EliteHero />

        {/* Talk to Voicely Button with Voice Waves */}
        <TalkToVoicelyButton />

        {/* Meet Your AI Workforce - Right after hero, loaded immediately */}
        <MeetYourWorkforce />

        {/* Industries Section - Showcase all 19 industry verticals */}
        <IndustriesSection />

        {/* Integrations Section - Right after workforce showcase */}
        <Suspense fallback={<IndustryLoadingFallback />}>
          <IntegrationsSection />
        </Suspense>

        {/* Below-the-fold: Lazy loaded for performance */}
        <Suspense fallback={<IndustryLoadingFallback />}>
          <VoiceAgentShowcase />
        </Suspense>

        <Suspense fallback={<IndustryLoadingFallback />}>
          <GlobalActivityMap />
        </Suspense>

        <Suspense fallback={<IndustryLoadingFallback />}>
          <BenefitsCircular />
        </Suspense>

        <Suspense fallback={<IndustryLoadingFallback />}>
          <HowItWorks />
        </Suspense>


        <Suspense fallback={<IndustryLoadingFallback />}>
          <CTASection />
        </Suspense>

        <Footer />
      </div>
    </PageTransition>
  );
}
