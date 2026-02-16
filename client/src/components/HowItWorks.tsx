import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Zap, Mic, Link, Rocket, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import trainingImage from "@assets/20f938b4-0436-49b9-a4a6-815c0b0a2cb4_1762597948604.png";
import voiceImage from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";
import connectImage from "@assets/9bd3c5fc-f5c8-410c-b35a-c3aa27718c92_1762597948604.png";
import liveImage from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";

// Animated Particles for Step Card
function StepParticles({ gradient }: { gradient: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? "#8B5CF6" : "#06B6D4",
            boxShadow: "0 0 8px currentColor",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Scan Line Effect
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.4) 50%, transparent 100%)",
        height: "60px",
      }}
      animate={{
        y: ["-60px", "100%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Interactive Step Card
function StepCard({ 
  step, 
  index 
}: { 
  step: any; 
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        rotateY: 2,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      data-testid={`how-it-works-step-${step.number}`}
    >
      {/* Main Card */}
      <div className="relative bg-black/80 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl overflow-hidden">
        {/* Elite Agent Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover"
            animate={isHovered ? {
              scale: 1.05,
            } : {}}
            transition={{ duration: 0.6 }}
          />
          
          {/* Scan Line Effect */}
          {isHovered && <ScanLine />}
          
          {/* Floating Particles */}
          {isHovered && <StepParticles gradient={step.gradient} />}
        </div>

        {/* Content */}
        <div className="relative p-6 z-10">
          {/* Step Number Badge */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} p-0.5 flex-shrink-0`}>
              <div className="w-full h-full rounded-lg bg-black/90 flex items-center justify-center">
                <span className="text-white font-black text-lg font-display">
                  {step.number}
                </span>
              </div>
            </div>
            <Icon className="w-5 h-5 text-purple-400" strokeWidth={2} />
          </div>
          
          <motion.h3 
            className="text-2xl font-black text-white mb-2 font-display"
            animate={isHovered ? { x: 5 } : { x: 0 }}
          >
            {step.title}
          </motion.h3>
          <motion.p 
            className="text-gray-300 leading-relaxed"
            animate={isHovered ? { x: 5 } : { x: 0 }}
          >
            {step.description}
          </motion.p>
          
          {/* Status Badge - Appears on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-cyan-600/30 backdrop-blur-xl border border-purple-500/30"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Ready to Deploy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Border Shimmer */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${step.gradient.includes('purple') ? 'rgba(139,92,246,0.4)' : 'rgba(6,182,212,0.4)'}, transparent)`,
          }}
          animate={isHovered ? {
            x: ["-100%", "100%"],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      </div>

      {/* Outer Glow Ring */}
      <motion.div
        className="absolute -inset-2 rounded-2xl -z-10"
        animate={isHovered ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        } : { opacity: 0 }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
        }}
        style={{
          background: `linear-gradient(135deg, ${step.gradient.replace('from-', '').replace('to-', ',')})`,
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Zap,
      title: "Train in Seconds",
      description: "Upload your knowledge base and configure responses instantly",
      image: trainingImage,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      number: 2,
      icon: Mic,
      title: "Choose a Voice",
      description: "Select from premium AI voices or clone your own unique sound",
      image: voiceImage,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      number: 3,
      icon: Link,
      title: "Connect Lines",
      description: "Link your phone system or use our dedicated numbers",
      image: connectImage,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      number: 4,
      icon: Rocket,
      title: "Go Live",
      description: "Start handling unlimited calls 24/7 in just minutes",
      image: liveImage,
      gradient: "from-pink-500 to-purple-600",
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
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
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        style={{ filter: "blur(80px)" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        style={{ filter: "blur(80px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-purple-500/30 mb-8"
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
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
              SIMPLE 4-STEP PROCESS
            </span>
          </motion.div>

          <h2 className="font-display text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                How It Works
              </span>
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 rounded-2xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
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
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deploy your <span className="text-purple-400 font-bold">AI voice workforce</span> in minutes, not months
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-xl border border-purple-500/30">
            <div className="text-left">
              <div className="text-sm text-gray-400 mb-1">Average Setup Time</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                &lt; 5 Minutes
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-400" />
            <div className="text-left">
              <div className="text-sm text-gray-400 mb-1">First Call Handled</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Instantly
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
