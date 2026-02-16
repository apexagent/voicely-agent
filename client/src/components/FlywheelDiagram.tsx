import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Flame, ArrowDownCircle, Users, Repeat } from "lucide-react";

interface FlywheelStep {
  id: number;
  icon: typeof DollarSign;
  title: string;
  description: string;
  color: string;
}

export default function FlywheelDiagram() {
  const [tokensBurned, setTokensBurned] = useState(1234804);
  const [valueCreated, setValueCreated] = useState(89487);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokensBurned(prev => prev + Math.floor(Math.random() * 50));
      setValueCreated(prev => prev + Math.floor(Math.random() * 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps: FlywheelStep[] = [
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
      title: "Increased Value Alignment",
      description: "Holders benefit from platform success",
      color: "#EC4899",
    },
  ];

  // Calculate positions for 5 nodes in a circle
  const radius = 140;
  const centerX = 200;
  const centerY = 200;
  const nodePositions = steps.map((_, index) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <section className="relative py-40 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Subtle Animated Grid */}
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

      {/* Subtle Floating Orbs */}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-6xl lg:text-8xl font-bold mb-6">
            <span className="text-gray-200">The </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                $VOICE
              </span>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-3xl -z-10" />
            </span>
            <span className="text-gray-200"> Flywheel</span>
          </h2>
          <p className="text-gray-300 text-2xl max-w-3xl mx-auto">
            Platform revenue automatically fuels token value
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Futuristic Circular Flywheel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Stats Cards Floating Above */}
            <div className="grid grid-cols-2 gap-4 mb-8 relative z-20">
              <motion.div 
                className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-orange-500/40 rounded-2xl p-6 hover:border-orange-500/60 transition-all group backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Tokens Burned</span>
                </div>
                <div className="text-4xl font-bold text-orange-500 font-mono">
                  {tokensBurned.toLocaleString()}
                </div>
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity -z-10 rounded-2xl" />
              </motion.div>

              <motion.div 
                className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/40 rounded-2xl p-6 hover:border-purple-500/60 transition-all group backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Value Created</span>
                </div>
                <div className="text-4xl font-bold text-purple-400 font-mono">
                  ${valueCreated.toLocaleString()}
                </div>
                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity -z-10 rounded-2xl" />
              </motion.div>
            </div>

            {/* Futuristic Circular Flywheel Diagram */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* SVG Container */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer Rotating Ring */}
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  r={radius + 20}
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  opacity="0.4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "center" }}
                />

                {/* Inner Circle Path */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="3"
                  opacity="0.3"
                />

                {/* Connecting Lines between nodes */}
                {steps.map((_, index) => {
                  const start = nodePositions[index];
                  const end = nodePositions[(index + 1) % 5];
                  return (
                    <motion.line
                      key={`line-${index}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="url(#arrowGrad)"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 2, delay: index * 0.3 }}
                    />
                  );
                })}

                {/* Animated Flow Particles */}
                {steps.map((_, index) => {
                  const start = nodePositions[index];
                  const end = nodePositions[(index + 1) % 5];
                  return (
                    <motion.circle
                      key={`particle-${index}`}
                      r="4"
                      fill={steps[index].color}
                      filter="url(#glow)"
                      animate={{
                        cx: [start.x, end.x],
                        cy: [start.y, end.y],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.4,
                        ease: "linear",
                      }}
                    />
                  );
                })}

                {/* Central Core Circle */}
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  r="50"
                  fill="url(#circleGrad)"
                  opacity="0.2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ transformOrigin: "center" }}
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="45"
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>

              {/* Node Overlays (HTML for icons) */}
              {steps.map((step, index) => {
                const Icon = step.icon;
                const pos = nodePositions[index];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="absolute"
                    style={{
                      left: `${(pos.x / 400) * 100}%`,
                      top: `${(pos.y / 400) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <motion.div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer group"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}30, ${step.color}60)`,
                        border: `3px solid ${step.color}`,
                        boxShadow: `0 0 30px ${step.color}80, inset 0 0 20px ${step.color}30`,
                      }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      animate={{
                        boxShadow: [
                          `0 0 30px ${step.color}80`,
                          `0 0 50px ${step.color}`,
                          `0 0 30px ${step.color}80`,
                        ],
                      }}
                      transition={{
                        boxShadow: { duration: 2, repeat: Infinity },
                      }}
                    >
                      <Icon className="w-10 h-10 text-gray-100" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                      
                      {/* Step Number Badge */}
                      <div
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-gray-100"
                        style={{
                          backgroundColor: step.color,
                          boxShadow: `0 0 15px ${step.color}`,
                        }}
                      >
                        {step.id}
                      </div>

                      {/* Pulsing Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          border: `2px solid ${step.color}`,
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.4,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Central Infinity Symbol */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 flex items-center justify-center border-4 border-purple-400/40 relative"
                  animate={{
                    boxShadow: [
                      '0 0 40px rgba(139,92,246,0.6)',
                      '0 0 80px rgba(139,92,246,0.8)',
                      '0 0 40px rgba(139,92,246,0.6)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Repeat className="w-12 h-12 text-gray-100" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-400"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Mega Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-violet-600/20 to-cyan-600/30 blur-[120px] -z-10" />
            </div>
          </motion.div>

          {/* Right: Step List */}
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all group backdrop-blur-xl"
                  data-testid={`flywheel-step-${step.id}`}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="flex items-start gap-6">
                    {/* Animated Icon */}
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                        border: `2px solid ${step.color}80`,
                      }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-100 font-bold text-xl"
                        style={{
                          backgroundColor: step.color,
                          boxShadow: `0 0 30px ${step.color}60`,
                        }}
                      >
                        {step.id}
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-200 mb-2 font-display">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>

                    {/* Icon Badge */}
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{
                        backgroundColor: `${step.color}20`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                  </div>

                  {/* Hover glow */}
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
        </div>
      </div>
    </section>
  );
}
