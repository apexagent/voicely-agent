import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Users } from "lucide-react";
import eliteTeam from "@assets/46a33eb8-1990-4376-8578-fc81920432b6_1762432848246.png";

const agents = [
  {
    name: "Sarah Chen",
    role: "Lead Sales Agent",
    specialty: "Enterprise Deals",
    color: "cyan",
    stats: "94.2% Close Rate",
    position: { left: "8%", top: "50%" },
  },
  {
    name: "Maya Williams",
    role: "Customer Success",
    specialty: "VIP Support",
    color: "purple",
    stats: "4.9/5.0 Rating",
    position: { left: "35%", top: "50%" },
  },
  {
    name: "Aisha Johnson",
    role: "Operations Lead",
    specialty: "Call Routing",
    color: "violet",
    stats: "99.8% Uptime",
    position: { left: "62%", top: "50%" },
  },
  {
    name: "Emma Rodriguez",
    role: "Technical Support",
    specialty: "Problem Solving",
    color: "blue",
    stats: "2.3min Avg Time",
    position: { left: "88%", top: "50%" },
  },
];

const features = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Bank-level encryption for all conversations",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Instant Response Time",
    description: "Zero wait times, 24/7 availability",
    color: "purple",
  },
  {
    icon: Users,
    title: "Multi-Agent Collaboration",
    description: "Seamless handoffs between specialists",
    color: "violet",
  },
  {
    icon: Sparkles,
    title: "Continuous Learning",
    description: "AI that gets smarter with every call",
    color: "blue",
  },
];

export default function EliteAgentTeam() {
  return (
    <section className="py-40 relative overflow-hidden">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Starfield */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
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
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 right-1/4 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/40 backdrop-blur-xl mb-8"
            style={{
              boxShadow: "0 0 50px rgba(6,182,212,0.4)",
            }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">
              Elite Voice Workforce
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl lg:text-8xl font-black mb-6 leading-tight"
          >
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400">
                Meet Your AI Team
              </span>
              <div className="absolute -inset-12 bg-gradient-to-r from-cyan-600/50 via-purple-600/50 to-violet-600/50 blur-[100px] -z-10" />
            </span>
          </motion.h2>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Enterprise-ready AI agents trained to handle any call with professionalism and precision
          </p>
        </div>

        {/* Main Team Image with Interactive Overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mb-20"
        >
          {/* Premium Frame */}
          <div 
            className="relative rounded-3xl overflow-hidden border-2 bg-gradient-to-br from-black/60 to-cyan-900/20 backdrop-blur-xl p-2"
            style={{
              borderImage: "linear-gradient(135deg, #06B6D4, #8B5CF6, #A855F7) 1",
              boxShadow: "0 0 120px rgba(6,182,212,0.6), inset 0 0 100px rgba(6,182,212,0.05)",
            }}
          >
            {/* Inner Border */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/30">
              <img
                src={eliteTeam}
                alt="Elite AI Voice Agent Team"
                className="w-full h-auto"
              />
              
              {/* Subtle Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-transparent to-purple-600/5" />

              {/* Interactive Agent Markers */}
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  className="absolute group cursor-pointer"
                  style={{
                    left: agent.position.left,
                    top: agent.position.top,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Pulsing Indicator */}
                  <motion.div
                    className={`w-6 h-6 rounded-full bg-${agent.color}-400 relative z-10`}
                    style={{
                      boxShadow: `0 0 30px rgba(6,182,212,0.9)`,
                      backgroundColor: agent.color === 'cyan' ? '#22D3EE' : 
                                     agent.color === 'purple' ? '#A855F7' :
                                     agent.color === 'violet' ? '#A78BFA' : '#60A5FA',
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />

                  {/* Expanding Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: agent.color === 'cyan' ? '#22D3EE' : 
                                   agent.color === 'purple' ? '#A855F7' :
                                   agent.color === 'violet' ? '#A78BFA' : '#60A5FA',
                    }}
                    animate={{
                      scale: [1, 2.5, 3],
                      opacity: [0.6, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />

                  {/* Info Card on Hover */}
                  <div 
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/95 backdrop-blur-xl rounded-xl px-5 py-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 min-w-[240px]"
                    style={{
                      boxShadow: agent.color === 'cyan' ? '0 0 40px rgba(6,182,212,0.6)' :
                                 agent.color === 'purple' ? '0 0 40px rgba(139,92,246,0.6)' :
                                 agent.color === 'violet' ? '0 0 40px rgba(167,139,250,0.6)' : '0 0 40px rgba(96,165,250,0.6)',
                      borderWidth: '2px',
                      borderColor: agent.color === 'cyan' ? '#22D3EE' :
                                   agent.color === 'purple' ? '#A855F7' :
                                   agent.color === 'violet' ? '#A78BFA' : '#60A5FA',
                    }}
                  >
                    <div className="text-gray-200 font-black text-base mb-1">{agent.name}</div>
                    <div 
                      className="text-sm font-bold mb-2"
                      style={{
                        color: agent.color === 'cyan' ? '#22D3EE' :
                               agent.color === 'purple' ? '#A855F7' :
                               agent.color === 'violet' ? '#A78BFA' : '#60A5FA',
                      }}
                    >
                      {agent.role}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{agent.specialty}</div>
                    <div className="text-xs font-bold text-gray-200 bg-white/10 rounded-full px-3 py-1 inline-block">
                      {agent.stats}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* "Ready to Serve" Badge */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/90 backdrop-blur-xl border-2 border-cyan-500/60"
                style={{
                  boxShadow: "0 0 50px rgba(6,182,212,0.8)",
                }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-cyan-400"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [1, 0.6, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    4 Elite Agents Ready to Serve
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Corner Accents - All 4 Corners */}
          <div className="absolute -top-4 -left-4 w-32 h-32 border-l-4 border-t-4 border-cyan-500/70 rounded-tl-3xl" />
          <div className="absolute -top-4 -right-4 w-32 h-32 border-r-4 border-t-4 border-purple-500/70 rounded-tr-3xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 border-l-4 border-b-4 border-violet-500/70 rounded-bl-3xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-4 border-b-4 border-blue-500/70 rounded-br-3xl" />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                backgroundColor: ['#06B6D4', '#8B5CF6', '#A78BFA', '#60A5FA'][i % 4],
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Mega Glow Behind Image */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[150px] -z-10"
            style={{
              background: "radial-gradient(circle, rgba(6,182,212,0.5), rgba(139,92,246,0.4), rgba(168,85,247,0.3), transparent)",
            }}
          />
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorMap = {
              cyan: { bg: 'bg-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', shadow: '0 0 40px rgba(6,182,212,0.3)' },
              purple: { bg: 'bg-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400', shadow: '0 0 40px rgba(139,92,246,0.3)' },
              violet: { bg: 'bg-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400', shadow: '0 0 40px rgba(168,85,247,0.3)' },
              blue: { bg: 'bg-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400', shadow: '0 0 40px rgba(96,165,250,0.3)' },
            };
            const colors = colorMap[feature.color as keyof typeof colorMap];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`p-6 rounded-2xl border backdrop-blur-xl ${colors.bg} ${colors.border}`}
                style={{
                  boxShadow: colors.shadow,
                }}
              >
                <Icon className={`w-10 h-10 ${colors.text} mb-4`} />
                <h3 className="text-lg font-bold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 via-purple-500 to-violet-600 opacity-60" />
    </section>
  );
}
