import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Flame, 
  ArrowDownCircle, 
  Users, 
  Repeat,
  Lock,
  Coins,
  Sparkles,
  Zap
} from "lucide-react";

interface FlywheelStep {
  id: number;
  icon: typeof DollarSign;
  title: string;
  description: string;
  color: string;
}

interface TokenomicsFeature {
  icon: typeof TrendingUp;
  title: string;
  description: string;
  gradient: string;
  color: string;
  stat?: string;
}

export default function VoiceTokenEcosystem() {

  const flywheelSteps: FlywheelStep[] = [
    {
      id: 1,
      icon: DollarSign,
      title: "Revenue Generated",
      description: "AI agents handle calls & conversations",
      color: "#10B981",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Auto-Convert to $VOICE",
      description: "10% of revenue converts automatically",
      color: "#3B82F6",
    },
    {
      id: 3,
      icon: Flame,
      title: "Buyback & Burn",
      description: "Tokens permanently removed from circulation",
      color: "#EF4444",
    },
    {
      id: 4,
      icon: ArrowDownCircle,
      title: "Shrinking Supply",
      description: "Scarcity increases with platform growth",
      color: "#8B5CF6",
    },
    {
      id: 5,
      icon: Users,
      title: "Increased Value",
      description: "Holders benefit from platform success",
      color: "#EC4899",
    },
  ];

  const tokenomicsFeatures: TokenomicsFeature[] = [
    {
      icon: Flame,
      title: "Auto-Burn Mechanism",
      description: "10% of all platform revenue automatically converts to $VOICE and burns forever, creating permanent scarcity",
      gradient: "from-orange-500 to-red-600",
      color: "#F97316",
      stat: "10%",
    },
    {
      icon: TrendingUp,
      title: "Deflationary Model",
      description: "As the platform grows, more tokens are burned. Supply shrinks while demand increases",
      gradient: "from-purple-500 to-violet-600",
      color: "#8B5CF6",
      stat: "∞",
    },
    {
      icon: Lock,
      title: "Team Vesting",
      description: "4-year linear vesting ensures long-term alignment between team and token holders",
      gradient: "from-cyan-500 to-blue-600",
      color: "#06B6D4",
      stat: "4Y",
    },
    {
      icon: Users,
      title: "Community First",
      description: "60% of total supply allocated to public distribution and ecosystem development",
      gradient: "from-pink-500 to-purple-600",
      color: "#EC4899",
      stat: "60%",
    },
  ];

  // Calculate positions for 5 nodes in a circle
  const radius = 140;
  const centerX = 200;
  const centerY = 200;
  const nodePositions = flywheelSteps.map((_, index) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <section className="relative py-40 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Elite Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute inset-0" 
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

      {/* Floating Orbs */}
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

      <div className="relative max-w-7xl mx-auto px-6">
        {/* EPIC HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {/* Badge */}
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
          >
            <Coins className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              Token Ecosystem
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="font-display text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gray-200">The </span>
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
                $VOICE
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
            <span className="text-gray-200"> Ecosystem</span>
          </h2>
          
          <p className="text-gray-300 text-2xl max-w-4xl mx-auto leading-relaxed">
            The world's first AI voice agent token with built-in deflationary flywheel. 
            <span className="text-purple-400 font-bold"> Platform growth = Token burns = Increasing scarcity</span>
          </p>
        </motion.div>

        {/* HOW IT WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/40 backdrop-blur-xl mb-6">
            <Repeat className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-300 uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h3 className="font-display text-4xl lg:text-6xl font-bold text-gray-200 mb-4">
            Revenue Fuels Token Value
          </h3>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Every conversation handled by AI agents automatically burns $VOICE tokens forever, creating permanent scarcity
          </p>
        </motion.div>

        {/* FLYWHEEL STEPS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-32">
          {flywheelSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all group backdrop-blur-xl"
                data-testid={`flywheel-step-${step.id}`}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                      border: `2px solid ${step.color}80`,
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: step.color,
                        boxShadow: `0 0 30px ${step.color}60`,
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  <div>
                    <div className="text-2xl font-black text-white mb-2">
                      Step {step.id}
                    </div>
                    <h4 className="text-xl font-bold text-gray-200 mb-2 font-display">
                      {step.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none blur-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${step.color}30, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* TOKENOMICS FEATURES SECTION */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/40 backdrop-blur-xl mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                Tokenomics
              </span>
            </div>
            <h3 className="font-display text-4xl lg:text-6xl font-bold text-gray-200 mb-4">
              Built for Long-Term Value
            </h3>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Transparent, fair, and designed to reward holders as the platform grows
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {tokenomicsFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/50 transition-all group backdrop-blur-xl overflow-hidden"
                  data-testid={`tokenomics-card-${index}`}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  {/* Stat Badge */}
                  {feature.stat && (
                    <motion.div
                      className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border-2"
                      style={{
                        borderColor: feature.color,
                        boxShadow: `0 0 20px ${feature.color}60`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-2xl font-black" style={{ color: feature.color }}>
                        {feature.stat}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-6">
                    {/* Animated Icon */}
                    <motion.div
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-1`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full h-full rounded-2xl bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-10 h-10 text-purple-300" strokeWidth={2} />
                      </div>
                    </motion.div>

                    <div className="flex-1 pr-20">
                      <h3 className="text-2xl font-bold text-gray-200 mb-3 font-display">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Top Border Accent */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color}00, ${feature.color}, ${feature.color}00)`,
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />

                  {/* Hover Glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}40, transparent)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
