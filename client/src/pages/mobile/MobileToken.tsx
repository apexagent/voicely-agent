import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, Users, Lock, Zap, ExternalLink, BarChart3, DollarSign, Globe, Repeat, Phone, Flame, ArrowDownCircle, Sparkles, CheckCircle, AlertTriangle, Book, Code, Cpu, Database, MessageSquare, Shield, Terminal, PieChart, LineChart, ArrowRight, Target, Building2, Clock, Briefcase, Activity, Check, Brain, Volume2, Mic, Play, Bot, ChevronRight, BarChart2, Headphones, ChevronDown, Star, Award, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import voicelyLogo from "@assets/0af78963-cafd-4bbd-9991-0ba6481573b0-removebg-preview_1762954092709.png";
import voicelyLogoNew from "@assets/Untitled design (11)_1762796118421-2_1763221193203.png";
import teamVideo from "@assets/202511151158 (1)_1763182779538.mp4";
import alicePortrait from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";

export default function MobileToken() {
  const { isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVoiceMessage, setShowVoiceMessage] = useState(false);

  // Simple voice message animation handler
  const handleComingSoonClick = () => {
    setShowVoiceMessage(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowVoiceMessage(false);
    }, 3000);
  };

  // Ensure video autoplays on mount (handles browser restrictions)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented - this is common on mobile
          console.log('Video autoplay prevented:', error);
          // On user interaction, try playing again
          const playOnInteraction = () => {
            video.play().catch(e => console.log('Play failed:', e));
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('touchstart', playOnInteraction, { once: true });
          document.addEventListener('click', playOnInteraction, { once: true });
        });
      }
    }
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600/50 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const distribution = [
    { label: "Public Sale", percentage: 40, color: "from-purple-600 to-violet-600" },
    { label: "Team & Advisors", percentage: 20, color: "from-cyan-600 to-blue-600" },
    { label: "Treasury", percentage: 25, color: "from-green-600 to-emerald-600" },
    { label: "Ecosystem", percentage: 15, color: "from-orange-600 to-red-600" },
  ];

  const flywheelSteps = [
    {
      icon: DollarSign,
      title: "Revenue Generated",
      description: "AI agents handle calls & conversations",
      color: "#10B981",
    },
    {
      icon: TrendingUp,
      title: "Auto-Convert to $VOICE",
      description: "10% of revenue converts automatically",
      color: "#3B82F6",
    },
    {
      icon: Flame,
      title: "Buyback & Burn",
      description: "Tokens permanently removed from circulation",
      color: "#EF4444",
    },
    {
      icon: ArrowDownCircle,
      title: "Shrinking Supply",
      description: "Scarcity increases with platform growth",
      color: "#8B5CF6",
    },
    {
      icon: Users,
      title: "Increased Value",
      description: "Holders benefit from platform success",
      color: "#EC4899",
    },
  ];

  const tokenomicsFeatures = [
    {
      icon: Flame,
      title: "Auto-Burn Mechanism",
      description: "10% of all platform revenue automatically converts to $VOICE and burns forever, creating permanent scarcity",
      stat: "10%",
    },
    {
      icon: TrendingUp,
      title: "Deflationary Model",
      description: "As the platform grows, more tokens are burned. Supply shrinks while demand increases",
      stat: "∞",
    },
    {
      icon: Lock,
      title: "Team Vesting",
      description: "12-month linear vesting ensures long-term alignment between team and token holders",
      stat: "12M",
    },
    {
      icon: Users,
      title: "Community First",
      description: "60% of total supply allocated to public distribution and ecosystem development",
      stat: "60%",
    },
  ];

  const utilities = [
    {
      icon: Zap,
      title: "Pay for AI Calls",
      description: "Use $VOICE tokens to power your AI agent calls",
      color: "from-purple-600 to-violet-600",
      stat: "0.1 VOICE/min",
    },
    {
      icon: TrendingUp,
      title: "Earn Rewards",
      description: "Stake tokens to earn 12% APY from platform revenue",
      color: "from-cyan-600 to-blue-600",
      stat: "12% APY",
    },
    {
      icon: Users,
      title: "Governance Rights",
      description: "Vote on platform features and protocol upgrades",
      color: "from-green-600 to-emerald-600",
      stat: "1 Token = 1 Vote",
    },
    {
      icon: Lock,
      title: "Premium Access",
      description: "Unlock exclusive features and priority support",
      color: "from-orange-600 to-red-600",
      stat: "5K+ Tokens",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B1E] pb-28 md:pb-8 relative">
      <div className="max-w-6xl mx-auto md:px-8">
      {/* Safe Area Support */}
      <div className="h-safe-top" />

      {/* Unified Hero Section - Video + Logo + Text Overlay */}
      <div className="relative w-full min-h-[55vh] md:min-h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
            data-testid="video-token-hero"
          >
            <source src={teamVideo} type="video/mp4" />
          </video>
          
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Enhanced Multi-Layer Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0B1E] via-[#0A0B1E]/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#0A0B1E]/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-10 px-4 py-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Logo - Clean with Glow */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <img 
                src={voicelyLogo} 
                alt="VOICE Token" 
                className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain filter drop-shadow-[0_0_50px_rgba(139,92,246,0.8)]"
                data-testid="img-token-logo"
              />
            </motion.div>
            
            {/* $VOICE in Orbitron - Large & Bold */}
            <motion.h1 
              className="font-black text-white mb-3"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(3.5rem, 15vw, 6rem)",
                lineHeight: "0.9",
                letterSpacing: "0.08em",
                textShadow: "0 0 60px rgba(139,92,246,0.8), 0 0 30px rgba(6,182,212,0.6)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              data-testid="text-voice-token"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-cyan-300">
                $VOICE
              </span>
            </motion.h1>
            
            {/* Solana SPL Token - Refined */}
            <motion.p 
              className="text-gray-200 font-semibold mb-6 tracking-widest"
              style={{
                fontSize: "clamp(0.9rem, 3.5vw, 1.15rem)",
                letterSpacing: "0.15em",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              data-testid="text-solana-spl"
            >
              SOLANA SPL TOKEN
            </motion.p>
            
            {/* Coming Soon Button - Simple */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ duration: 0.7, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative inline-block">
                {/* Voice Message Bubble - Simple Animation */}
                <AnimatePresence>
                  {showVoiceMessage && (
                    <motion.div
                      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <motion.div
                        className="w-full max-w-[320px]"
                        initial={{ y: 20, scale: 0.8 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: -10, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {/* Message Bubble */}
                        <div className="relative bg-gradient-to-r from-purple-600/95 to-pink-600/95 backdrop-blur-xl border-2 border-purple-400/60 rounded-2xl p-4 shadow-2xl">
                          {/* Alice Avatar + Message */}
                          <div className="flex items-center gap-3">
                            <img 
                              src={alicePortrait}
                              alt="Alice AI"
                              className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-white/40 object-cover"
                            />
                            
                            {/* Message Text */}
                            <div className="flex-1">
                              <div className="text-white/90 text-xs font-semibold mb-1">Alice - Voicely AI</div>
                              <div className="text-white font-bold text-sm leading-snug">
                                $VOICE token by Voicely<br/>is coming soon!
                              </div>
                            </div>
                          </div>
                          
                          {/* Speech Bubble Tail */}
                          <div 
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '12px solid transparent',
                              borderRight: '12px solid transparent',
                              borderTop: '16px solid rgba(168, 85, 247, 0.95)',
                            }}
                          />

                          {/* Pulsing Glow */}
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-lg -z-10"
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Button */}
                <Button
                  size="lg"
                  onClick={handleComingSoonClick}
                  className="relative bg-transparent hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-cyan-500/10 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 font-bold text-base px-10 py-3 h-12 rounded-lg border-2 border-purple-500/60 hover:border-purple-400/80 transition-all"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: "none",
                  }}
                  data-testid="button-coming-soon"
                >
                  Coming Soon
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-visible">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/60 p-1 rounded-2xl border border-gray-600/50">
            <TabsTrigger 
              value="overview" 
              className="rounded-xl text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-gray-200" 
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tokenomics" 
              className="rounded-xl text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-gray-200" 
              data-testid="tab-tokenomics"
            >
              Tokenomics
            </TabsTrigger>
            <TabsTrigger 
              value="docs" 
              className="rounded-xl text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 data-[state=active]:text-gray-200" 
              data-testid="tab-docs"
            >
              Docs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Comprehensive Documentation */}
          <TabsContent value="overview" className="space-y-8">
            {/* Hero Section */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Voicely Platform Overview
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                Enterprise-grade AI voice workforce platform revolutionizing customer engagement with autonomous agents delivering human-like conversations at scale. Built for global enterprises requiring 24/7/365 coverage with sub-350ms response times.
              </p>
              
              {/* Key Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="p-3 md:p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 text-center">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">$500B</div>
                  <div className="text-xs text-gray-400 mt-1">Market TAM</div>
                </Card>
                <Card className="p-3 md:p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 text-center">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">&lt;250ms</div>
                  <div className="text-xs text-gray-400 mt-1">Response Time</div>
                </Card>
                <Card className="p-3 md:p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 text-center">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">99.9%</div>
                  <div className="text-xs text-gray-400 mt-1">Uptime SLA</div>
                </Card>
                <Card className="p-3 md:p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30 text-center">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">85%</div>
                  <div className="text-xs text-gray-400 mt-1">Cost Reduction</div>
                </Card>
              </div>
            </div>

            {/* Market Opportunity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white flex items-center gap-2 md:gap-3">
                <Building2 className="w-6 h-6 md:w-7 md:h-7 text-green-400" />
                Market Opportunity
              </h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/15 via-white/5 to-violet-500/15 border-purple-500/30 backdrop-blur-xl">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-purple-400 mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3">Total Addressable Market</h4>
                  <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-200">
                    <div className="flex items-center justify-between gap-3">
                      <span>Customer Service AI</span>
                      <span className="font-bold text-purple-400">$140B by 2028</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Sales Automation</span>
                      <span className="font-bold text-cyan-400">$180B by 2028</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Voice AI Infrastructure</span>
                      <span className="font-bold text-green-400">$180B by 2028</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent my-2" />
                    <div className="flex items-center justify-between gap-3 text-sm md:text-base">
                      <span className="font-bold text-white">Total TAM</span>
                      <span className="font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">$500B+</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/15 border-cyan-500/30 backdrop-blur-xl">
                  <LineChart className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3">Growth Projections</h4>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs md:text-sm text-gray-300">2024 Revenue</span>
                        <span className="text-xs md:text-sm font-bold text-white">$2.5M</span>
                      </div>
                      <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "8%" }}
                          transition={{ delay: 0.3, duration: 1 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-gray-400">2025 Projected</span>
                        <span className="text-xs md:text-sm font-bold text-white">$12M</span>
                      </div>
                      <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-gray-400">2026 Target</span>
                        <span className="text-xs md:text-sm font-bold text-white">$30M</span>
                      </div>
                      <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.7, duration: 1 }}
                          className="h-full bg-gradient-to-r from-green-600 to-green-500"
                        />
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      380% YoY Growth
                    </Badge>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Competitive Advantages */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white flex items-center gap-2 md:gap-3">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Competitive Advantages
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Industry-Leading Latency</h4>
                  <p className="text-xs md:text-sm text-gray-400">200-250ms end-to-end response time, 40% faster than competitors. Zero-lag mode for instant reactions.</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-3">
                    <Coins className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Token-Powered Economy</h4>
                  <p className="text-xs md:text-sm text-gray-400">$VOICE token with auto-burn mechanism, aligning platform growth with holder value through deflationary tokenomics.</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Enterprise-Grade Security</h4>
                  <p className="text-xs md:text-sm text-gray-400">SOC 2 Type II, GDPR & HIPAA compliant. End-to-end encryption with zero-trust architecture.</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mb-3">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Advanced AI Pipeline</h4>
                  <p className="text-xs md:text-sm text-gray-400">Multi-model architecture with DeepSeek AI, optimized for context awareness and natural conversations.</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-pink-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Global Infrastructure</h4>
                  <p className="text-xs md:text-sm text-gray-400">Edge deployment across 200+ regions, 99.9% uptime SLA with automatic failover and load balancing.</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-violet-500/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">Real-Time Analytics</h4>
                  <p className="text-xs md:text-sm text-gray-400">AI-powered conversation analysis, sentiment tracking, and actionable insights with live dashboards.</p>
                </Card>
              </div>
            </div>

            {/* Use Cases & ROI */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white flex items-center gap-2 md:gap-3">
                <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Enterprise Use Cases & ROI
              </h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm md:text-base">Customer Support</h4>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        85% cost reduction
                      </Badge>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Handle 10,000+ concurrent calls with instant resolution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>92% first-call resolution rate vs 67% industry average</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>4.8/5 customer satisfaction with 24/7 availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold text-green-300">ROI: $450K annual savings per 100 agents</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm md:text-base">Sales & Lead Gen</h4>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                        3x conversion rate
                      </Badge>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Qualify 500+ leads per day with 68% conversion to SQL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Dynamic objection handling with 78% close rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Intelligent follow-ups increasing pipeline by 240%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold text-green-300">ROI: $2.2M incremental revenue per quarter</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>

          </TabsContent>

          {/* Tokenomics Tab - Comprehensive Documentation */}
          <TabsContent value="tokenomics" className="space-y-8">
            {/* Token Distribution */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <PieChart className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Token Distribution
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-300">Public Sale (40%)</span>
                        <span className="text-sm font-bold text-white">400M tokens</span>
                      </div>
                      <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-300">Treasury (25%)</span>
                        <span className="text-sm font-bold text-white">250M tokens</span>
                      </div>
                      <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "25%" }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-300">Team & Advisors (20%)</span>
                        <span className="text-sm font-bold text-white">200M tokens</span>
                      </div>
                      <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-green-600 to-green-500"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">12-month linear vesting</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-300">Ecosystem Fund (15%)</span>
                        <span className="text-sm font-bold text-white">150M tokens</span>
                      </div>
                      <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "15%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-4">Key Highlights</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1">Community First</h5>
                        <p className="text-sm text-gray-400">60% allocated to public distribution and ecosystem growth</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1">Team Alignment</h5>
                        <p className="text-sm text-gray-400">12-month vesting ensures long-term commitment and alignment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1">Treasury Security</h5>
                        <p className="text-sm text-gray-400">Multi-sig wallet with time-locked releases for protocol stability</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Auto-Burn Mechanism */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Flame className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                Auto-Burn Mechanism
              </h3>
              <Card className="p-6 md:p-8 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-purple-500/10 border-orange-500/30">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-4">How It Works</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Revenue Generation</h5>
                          <p className="text-sm text-gray-400">Platform generates revenue from AI voice agent usage ($0.10-0.30 per minute)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Auto-Convert</h5>
                          <p className="text-sm text-gray-400">10% of all revenue automatically converts to $VOICE tokens via Jupiter DEX</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Permanent Burn</h5>
                          <p className="text-sm text-gray-400">Tokens sent to burn address (0x000...000), permanently removed from circulation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          4
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Value Accrual</h5>
                          <p className="text-sm text-gray-400">Reduced supply + constant demand = increasing token value for holders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-4">Projected Burns</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Year 1 Burn</span>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">15M tokens</div>
                            <div className="text-xs text-gray-500">1.5% of supply</div>
                          </div>
                        </div>
                        <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "15%" }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Year 2 Burn</span>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">45M tokens</div>
                            <div className="text-xs text-gray-500">4.5% of supply</div>
                          </div>
                        </div>
                        <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "45%" }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Year 3 Burn</span>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">90M tokens</div>
                            <div className="text-xs text-gray-500">9% of supply</div>
                          </div>
                        </div>
                        <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "90%" }}
                            transition={{ delay: 1, duration: 1 }}
                            className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                          />
                        </div>
                      </div>
                      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">5-Year Projected Burn</span>
                          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">300M+</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">30% of total supply permanently removed</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Token Utility & Use Cases */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Token Utility & Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Platform Usage</h4>
                  <p className="text-sm text-gray-400 mb-4">Pay for AI voice agent calls and services using $VOICE tokens at discounted rates</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      0.1 VOICE per minute
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      30% discount vs fiat
                    </Badge>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Staking Rewards</h4>
                  <p className="text-sm text-gray-400 mb-4">Stake $VOICE tokens to earn 12% APY from platform revenue share</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                      12% APY
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Monthly payouts
                    </Badge>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Governance Rights</h4>
                  <p className="text-sm text-gray-400 mb-4">Vote on platform features, integrations, and protocol upgrades</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      1 token = 1 vote
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      DAO structure
                    </Badge>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-500/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Premium Features</h4>
                  <p className="text-sm text-gray-400 mb-4">Unlock exclusive agent voices, analytics, and priority support</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                      5,000+ tokens
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      VIP tier
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>

            {/* Value Accrual Flywheel */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Repeat className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Value Accrual Flywheel
              </h3>
              <Card className="p-6 md:p-8 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-cyan-500/5 border-purple-500/20">
                <div className="grid md:grid-cols-5 gap-4">
                  {[
                    { icon: DollarSign, title: "Revenue Growth", desc: "Platform usage generates increasing revenue", color: "from-green-600 to-emerald-600" },
                    { icon: Repeat, title: "Auto-Convert", desc: "10% of revenue converts to $VOICE", color: "from-cyan-600 to-blue-600" },
                    { icon: Flame, title: "Burn Tokens", desc: "Tokens permanently removed from supply", color: "from-orange-600 to-red-600" },
                    { icon: Target, title: "Supply Shrinks", desc: "Scarcity increases with platform growth", color: "from-purple-600 to-violet-600" },
                    { icon: TrendingUp, title: "Value Rises", desc: "Holders benefit from deflationary pressure", color: "from-pink-600 to-rose-600" },
                  ].map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <Card className="p-4 bg-gradient-to-br from-black/40 to-black/20 border-purple-500/20 text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                        <div className="text-xs text-gray-400">{step.desc}</div>
                      </Card>
                      {i < 4 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 z-10">
                          <ArrowRight className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">Sustainable Value Creation</h4>
                      <p className="text-sm text-gray-300">Unlike inflationary tokens, $VOICE benefits from a self-reinforcing cycle: More platform usage → More revenue → More burns → Higher scarcity → Increased value for existing holders. This creates natural alignment between platform success and token holder returns.</p>
                    </div>
                  </div>
                </Card>
              </Card>
            </div>

            {/* Financial Projections */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <LineChart className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                Financial Projections
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                  <div className="text-sm text-gray-400 mb-2">Year 1 (2025)</div>
                  <div className="text-3xl font-black text-white mb-4">$12M</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Platform Revenue</span>
                      <span className="font-bold text-white">$12M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tokens Burned</span>
                      <span className="font-bold text-orange-400">15M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Projected Price</span>
                      <span className="font-bold text-green-400">$0.45</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                  <div className="text-sm text-gray-400 mb-2">Year 2 (2026)</div>
                  <div className="text-3xl font-black text-white mb-4">$30M</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Platform Revenue</span>
                      <span className="font-bold text-white">$30M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tokens Burned</span>
                      <span className="font-bold text-orange-400">45M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Projected Price</span>
                      <span className="font-bold text-green-400">$1.20</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <div className="text-sm text-gray-400 mb-2">Year 3 (2027)</div>
                  <div className="text-3xl font-black text-white mb-4">$75M</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Platform Revenue</span>
                      <span className="font-bold text-white">$75M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tokens Burned</span>
                      <span className="font-bold text-orange-400">90M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Projected Price</span>
                      <span className="font-bold text-green-400">$3.50</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Compliance Disclaimer */}
            <motion.div
              className="p-4 rounded-2xl bg-gray-700/30 border border-gray-600/50 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 leading-relaxed">
                  <span className="font-bold">Important Disclaimer:</span> $VOICE is a utility token for the Voicely platform. This information is not financial advice. Cryptocurrency investments carry risk. Always do your own research and only invest what you can afford to lose. Token details subject to change.
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* Docs Tab - Interactive Platform Guide */}
          <TabsContent value="docs" className="space-y-4">
            {/* Hero intro */}
            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 via-cyan-600/10 to-blue-600/20 border border-purple-500/30 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 mb-4">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to Voicely Docs
              </h2>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Everything you need to know about our AI voice agents, explained in simple terms
              </p>
            </motion.div>

            {/* Interactive Accordion Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {/* What is Voicely? */}
                <AccordionItem value="what-is" className="border-0">
                  <motion.div
                    className="rounded-xl bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-500/10 border border-purple-500/30 backdrop-blur-xl overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline group" data-testid="accordion-what-is">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                          <Book className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                            What is Voicely?
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">Learn about our AI voice platform</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pt-2 space-y-4">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          Imagine having a team of professional phone agents who <span className="text-purple-300 font-semibold">never sleep, never call in sick, and always sound friendly</span>. That's Voicely.
                        </p>

                        <p className="text-xs text-gray-300 leading-relaxed">
                          We built AI agents that talk to your customers just like real people - they can answer questions, close sales, book appointments, and handle support calls. The best part? They work 24/7 and can handle thousands of calls at once.
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { icon: Star, text: "Sounds completely natural - customers can't tell it's AI", color: "text-purple-400" },
                            { icon: Zap, text: "Responds instantly - no awkward pauses or \"umms\"", color: "text-cyan-400" },
                            { icon: Brain, text: "Learns about your business - you tell it what to say", color: "text-green-400" },
                            { icon: Activity, text: "Never gets tired - handles 1 call or 10,000 with the same energy", color: "text-orange-400" }
                          ].map((item, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{ x: 4 }}
                            >
                              <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.color}`} />
                              <span className="text-xs text-gray-200">{item.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>

                {/* What Can Voicely Do? */}
                <AccordionItem value="what-can-do" className="border-0">
                  <motion.div
                    className="rounded-xl bg-gradient-to-br from-cyan-500/10 via-white/5 to-blue-500/10 border border-cyan-500/30 backdrop-blur-xl overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline group" data-testid="accordion-what-can-do">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            What Can Voicely Do For You?
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">Explore real-world use cases</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pt-2 space-y-4">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          Our AI agents can handle the <span className="text-cyan-300 font-semibold">repetitive phone work</span> that takes up your team's time, so humans can focus on what really matters.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { icon: TrendingUp, title: "Sales Agent", desc: "Qualifies leads, answers product questions, and schedules demos with your sales team. Works great for inbound calls from your website or ads.", gradient: "from-purple-500 to-violet-500", bg: "bg-purple-500/10" },
                            { icon: Headphones, title: "Support Agent", desc: "Handles common support questions, troubleshoots issues, and escalates complex problems to your team. Available 24/7 so customers always get help.", gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10" },
                            { icon: Clock, title: "Appointment Scheduler", desc: "Books appointments, sends reminders, and handles rescheduling. Perfect for medical offices, salons, and service businesses.", gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/10" },
                            { icon: Phone, title: "Receptionist", desc: "Answers calls, routes to the right department, and takes messages. Never miss a call again, even during busy hours.", gradient: "from-orange-500 to-red-500", bg: "bg-orange-500/10" }
                          ].map((agent, idx) => (
                            <motion.div
                              key={idx}
                              className={`p-3 rounded-lg ${agent.bg} border border-white/10 hover-elevate active-elevate-2 cursor-pointer`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                                  <agent.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-sm font-bold text-white">{agent.title}</div>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {agent.desc}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>

                {/* How It Works */}
                <AccordionItem value="how-it-works" className="border-0">
                  <motion.div
                    className="rounded-xl bg-gradient-to-br from-green-500/10 via-white/5 to-emerald-500/10 border border-green-500/30 backdrop-blur-xl overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline group" data-testid="accordion-how-it-works">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-green-300 transition-colors">
                            How It Works (Super Simple!)
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">Get started in 3 easy steps</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pt-2 space-y-4">
                        {[
                          { num: 1, title: "Test Our Demo Agents First", desc: "Click the \"Agent Team\" tab and talk to Sarah (Sales), Emma (Receptionist), or any of our pre-built agents. See how natural they sound!", icon: Play, numBg: "bg-purple-500/20", numText: "text-purple-400", numRing: "ring-purple-500/30", iconColor: "text-purple-400" },
                          { num: 2, title: "Build Your Own Agent", desc: "Tell us about your business, pick a voice you like, and describe how your agent should talk to customers. No coding needed!", icon: Bot, numBg: "bg-cyan-500/20", numText: "text-cyan-400", numRing: "ring-cyan-500/30", iconColor: "text-cyan-400" },
                          { num: 3, title: "Go Live & Improve", desc: "Connect your phone number and start taking calls. Review transcripts to see what's working and refine your agent over time.", icon: Rocket, numBg: "bg-green-500/20", numText: "text-green-400", numRing: "ring-green-500/30", iconColor: "text-green-400" }
                        ].map((step, idx) => (
                          <motion.div
                            key={idx}
                            className="relative flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ x: 4 }}
                          >
                            <div className={`relative w-8 h-8 rounded-full ${step.numBg} ${step.numText} flex items-center justify-center text-sm font-bold flex-shrink-0 ring-2 ${step.numRing}`}>
                              {step.num}
                              {idx < 2 && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-gray-500/50 to-transparent" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-white">{step.title}</span>
                                <step.icon className={`w-4 h-4 ${step.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </motion.div>
                        ))}

                        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                          <p className="text-xs text-gray-200 text-center">
                            💡 <span className="font-semibold text-white">Pro Tip:</span> Most customers start seeing value within their first week!
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>

                {/* Why People Love Voicely */}
                <AccordionItem value="why-love" className="border-0">
                  <motion.div
                    className="rounded-xl bg-gradient-to-br from-orange-500/10 via-white/5 to-red-500/10 border border-orange-500/30 backdrop-blur-xl overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline group" data-testid="accordion-why-love">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                            Why People Love Voicely
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">What makes us different</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pt-2 space-y-4">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          Here's what makes us different from other voice AI platforms:
                        </p>

                        <div className="space-y-3">
                          {[
                            { icon: Zap, title: "Lightning Fast Responses", desc: "Our agents respond in under half a second. Customers don't even notice they're talking to AI because the conversation flows naturally.", color: "text-yellow-400", bg: "bg-yellow-500/5" },
                            { icon: DollarSign, title: "Save Money on Staffing", desc: "One Voicely agent costs less than $50/month but can handle what would take 3-5 human employees. No sick days, no overtime pay.", color: "text-green-400", bg: "bg-green-500/5" },
                            { icon: Globe, title: "Works 24/7 Worldwide", desc: "Customers in different time zones? No problem. Your AI agents are always ready to take calls, even at 3 AM on Christmas.", color: "text-blue-400", bg: "bg-blue-500/5" },
                            { icon: BarChart3, title: "Learn & Improve Over Time", desc: "Every conversation is saved and analyzed. You can see what's working, what's not, and make your agents better every day.", color: "text-purple-400", bg: "bg-purple-500/5" },
                            { icon: Shield, title: "Enterprise-Grade Security", desc: "Your customer data is encrypted and secure. We're built for serious businesses who care about privacy and compliance.", color: "text-cyan-400", bg: "bg-cyan-500/5" }
                          ].map((benefit, idx) => (
                            <motion.div
                              key={idx}
                              className={`flex items-start gap-3 p-3 rounded-lg ${benefit.bg} hover:bg-white/10 transition-colors`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{ x: 4 }}
                            >
                              <benefit.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${benefit.color}`} />
                              <div>
                                <div className="text-sm font-bold text-white mb-1">{benefit.title}</div>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                  {benefit.desc}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm text-gray-200 text-center leading-relaxed">
                            🚀 <span className="font-bold text-white">Ready to try it?</span> Test our demo agents in the "Agent Team" tab - no signup required!
                          </p>
                        </motion.div>
                      </div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </TabsContent>

        </Tabs>
      </div>
      </div>
    </div>
  );
}
