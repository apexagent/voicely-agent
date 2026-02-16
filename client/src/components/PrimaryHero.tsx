import { motion } from "framer-motion";
import { Activity, Zap, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import aiAgentImage from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";

export default function PrimaryHero() {
  const features = [
    {
      icon: Activity,
      title: "Natural Conversations",
      description: "Sounds human, responds instantly, never gets tired",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Smart Integrations",
      description: "Connects with your CRM, calendar, and tools",
      color: "cyan",
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description: "Gets smarter with every conversation",
      color: "violet",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Starfield */}
      <div className="absolute inset-0">
        {[...Array(120)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Massive Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[900px] h-[900px] bg-purple-600/25 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/15 rounded-full blur-[220px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-5xl lg:text-8xl font-black mb-6 leading-tight"
            data-testid="text-primary-headline"
          >
            <motion.span
              className="block mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span 
                className="text-gray-200"
                style={{
                  textShadow: "0 0 60px rgba(139,92,246,0.4)",
                }}
              >
                Your Wish Is
              </span>
            </motion.span>

            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400"
                style={{
                  filter: "drop-shadow(0 0 60px rgba(168,85,247,1)) drop-shadow(0 0 100px rgba(139,92,246,0.8))",
                }}
              >
                Their Command
              </span>
              {/* MASSIVE Background Glow */}
              <div className="absolute -inset-16 bg-gradient-to-r from-purple-600/60 via-violet-500/60 to-cyan-600/50 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: "4s" }} />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            AI agents that understand context, remember conversations, and execute complex tasks
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT - Premium AI Agent Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Premium Frame */}
            <div 
              className="relative rounded-3xl overflow-hidden border-2 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-xl p-3"
              style={{
                borderImage: "linear-gradient(135deg, #8B5CF6, #06B6D4, #8B5CF6) 1",
                boxShadow: "0 0 120px rgba(139,92,246,0.7), inset 0 0 100px rgba(139,92,246,0.05)",
              }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30">
                <img
                  src={aiAgentImage}
                  alt="Advanced AI Agent Interface"
                  className="w-full h-auto"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10" />

                {/* Floating Stats Badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-8 left-8 px-5 py-3 rounded-xl bg-black/90 backdrop-blur-xl border border-purple-500/40"
                  style={{
                    boxShadow: "0 0 40px rgba(139,92,246,0.6)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <span className="text-xs font-bold text-purple-300">Processing</span>
                  </div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    247 Tasks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-8 right-8 px-5 py-3 rounded-xl bg-black/90 backdrop-blur-xl border border-cyan-500/40"
                  style={{
                    boxShadow: "0 0 40px rgba(6,182,212,0.6)",
                  }}
                >
                  <div className="text-xs font-bold text-cyan-300 mb-1">Active Now</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    99.9%
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border-l-4 border-t-4 border-purple-400/70 rounded-tl-3xl"
              style={{ filter: "drop-shadow(0 0 25px rgba(139,92,246,0.6))" }}
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-4 border-b-4 border-cyan-400/70 rounded-br-3xl"
              style={{ filter: "drop-shadow(0 0 25px rgba(6,182,212,0.6))" }}
            />

            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-purple-400/40"
              animate={{
                scale: [1, 1.04, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />

            {/* Mega Glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] blur-[180px] -z-10"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.7), rgba(6,182,212,0.4), transparent)",
              }}
            />

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${-10 + Math.random() * 120}%`,
                  top: `${-10 + Math.random() * 120}%`,
                  backgroundColor: i % 2 === 0 ? '#8B5CF6' : '#06B6D4',
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.2, 0.9, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>

          {/* RIGHT - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorMap = {
                purple: { 
                  bg: 'bg-purple-600/10', 
                  border: 'border-purple-500/40', 
                  icon: 'bg-purple-600/20',
                  iconBorder: 'border-purple-500/50',
                  text: 'text-purple-400',
                  glow: '0 0 50px rgba(139,92,246,0.4)',
                },
                cyan: { 
                  bg: 'bg-cyan-600/10', 
                  border: 'border-cyan-500/40', 
                  icon: 'bg-cyan-600/20',
                  iconBorder: 'border-cyan-500/50',
                  text: 'text-cyan-400',
                  glow: '0 0 50px rgba(6,182,212,0.4)',
                },
                violet: { 
                  bg: 'bg-violet-600/10', 
                  border: 'border-violet-500/40', 
                  icon: 'bg-violet-600/20',
                  iconBorder: 'border-violet-500/50',
                  text: 'text-violet-400',
                  glow: '0 0 50px rgba(167,139,250,0.4)',
                },
              };
              const colors = colorMap[feature.color as keyof typeof colorMap];

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className={`relative p-8 rounded-2xl border-2 backdrop-blur-xl ${colors.bg} ${colors.border} group cursor-pointer`}
                  style={{
                    boxShadow: colors.glow,
                  }}
                >
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <motion.div
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl ${colors.icon} border-2 ${colors.iconBorder} flex items-center justify-center`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-200 mb-3 font-display">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color === 'purple' ? 'rgba(139,92,246,0.4)' : feature.color === 'cyan' ? 'rgba(6,182,212,0.4)' : 'rgba(167,139,250,0.4)'}, transparent)`,
                    }}
                  />
                </motion.div>
              );
            })}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="pt-4"
            >
              <motion.button
                onClick={() => {
                  const agentSection = document.getElementById('meet-your-workforce');
                  if (agentSection) {
                    agentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 border-2 border-purple-400/40 font-black text-lg text-gray-100 relative overflow-hidden group"
                style={{
                  boxShadow: "0 0 60px rgba(139,92,246,0.7)",
                }}
                data-testid="button-learn-more-hero"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Brain className="w-6 h-6" />
                  Learn More About AI Agents
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
