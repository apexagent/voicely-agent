import { motion, useMotionValue, useTransform } from "framer-motion";
import { Clock, Shield, Zap, Heart, Battery, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import eliteAgentImage from "@assets/b33fe707-6d6c-423f-addf-3fd24729ac76_1762597948605.png";

// Interactive Feature Card with 3D Tilt Effect
function InteractiveFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  index,
  stat 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  index: number;
  stat: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        rotateY: 5,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-black/60 backdrop-blur-xl border-2 border-purple-500/30 overflow-hidden min-w-[280px]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/20 to-cyan-600/20"
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
          }}
        />
        
        {/* Shimmer Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.8 }}
        />

        {/* Icon with Pulse */}
        <motion.div
          className="relative z-10 mb-6 inline-flex"
          animate={isHovered ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          } : {}}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="relative">
            <Icon className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/50"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ filter: "blur(10px)" }}
              />
            )}
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-4">{description}</p>
          
          {/* Stat */}
          <motion.div
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
            animate={isHovered ? {
              scale: [1, 1.1, 1],
            } : {}}
          >
            {stat}
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-2xl" />
        
        {/* Glow Effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl -z-10"
          animate={isHovered ? {
            opacity: [0.3, 0.6, 0.3],
          } : { opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
          }}
          style={{ filter: "blur(20px)" }}
        />
      </div>
    </motion.div>
  );
}

// Floating Particles around Agent
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: "0 0 10px rgba(139,92,246,0.8)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Status Indicator Badge
function StatusBadge() {
  return (
    <motion.div
      className="absolute top-4 left-4 z-20 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl border-2 border-emerald-500/50 flex items-center gap-2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
      style={{
        boxShadow: "0 0 30px rgba(16,185,129,0.6)",
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
        <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
      </motion.div>
      <span className="text-xs font-bold text-emerald-300">100% Uptime</span>
    </motion.div>
  );
}

// Performance Metrics Overlay
function PerformanceMetrics() {
  const metrics = [
    { label: "Energy", value: "100%", icon: Battery },
    { label: "Performance", value: "99.9%", icon: TrendingUp },
    { label: "Health", value: "Perfect", icon: CheckCircle2 },
  ];

  return (
    <motion.div
      className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-3 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          className="px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-purple-500/30 text-center"
          whileHover={{ scale: 1.1, y: -5 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.1 }}
        >
          <metric.icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <div className="text-xs font-bold text-white">{metric.value}</div>
          <div className="text-[10px] text-gray-400">{metric.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function NeverSickSection() {
  const features = [
    {
      icon: Clock,
      title: "Always Available",
      description: "24/7/365 uptime guaranteed",
      stat: "100%",
    },
    {
      icon: Shield,
      title: "Zero Sick Days",
      description: "Never calls in sick or takes breaks",
      stat: "0",
    },
    {
      icon: Zap,
      title: "Instant Scaling",
      description: "Handle unlimited calls simultaneously",
      stat: "∞",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-violet-900/10 to-purple-900/10" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        style={{
          filter: "blur(100px)",
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-purple-500/30 mb-8"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139,92,246,0.3)",
                  "0 0 40px rgba(139,92,246,0.6)",
                  "0 0 20px rgba(139,92,246,0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                RELIABILITY REDEFINED
              </span>
            </motion.div>

            <h2 className="font-display text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">An Employee That</span>
              <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                  Never Gets Sick
                </span>
                <motion.div 
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600/40 to-cyan-600/40 rounded-2xl -z-10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  style={{
                    filter: "blur(40px)",
                  }}
                />
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Reliability you can count on, <span className="text-purple-400 font-bold">every single day</span>
            </p>
          </motion.div>
        </div>

        {/* Interactive Features Grid */}
        <div className="flex flex-wrap justify-center items-stretch gap-6 mb-20">
          {features.map((feature, index) => (
            <InteractiveFeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* EPIC Agent Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute -inset-8 rounded-3xl opacity-50 -z-10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.6), rgba(6,182,212,0.4), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Main Agent Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-black/60 backdrop-blur-xl border-2 border-purple-500/40 p-6">
            {/* Agent Image Container */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={eliteAgentImage}
                alt="Elite AI Agent - Always Available"
                className="w-full h-auto relative z-10"
                loading="lazy"
                data-testid="img-elite-agent"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 pointer-events-none mix-blend-overlay" />
              
              {/* Floating Particles */}
              <FloatingParticles />
              
              {/* Status Badge */}
              <StatusBadge />
              
              {/* Performance Metrics */}
              <PerformanceMetrics />
              
              {/* Corner Tech Brackets */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/60" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/60" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-500/60" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/60" />
              
              {/* Scan Lines */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.1) 2px, rgba(139,92,246,0.1) 4px)",
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-xl border border-purple-500/30">
            <div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                365 Days
              </div>
              <div className="text-sm text-gray-400">Perfect Attendance</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
            <div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                0 Breaks
              </div>
              <div className="text-sm text-gray-400">Always On Duty</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
            <div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                ∞ Calls
              </div>
              <div className="text-sm text-gray-400">Unlimited Capacity</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
