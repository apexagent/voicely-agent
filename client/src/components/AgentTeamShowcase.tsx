import { motion } from "framer-motion";
import { Sparkles, Phone, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import agentTeam from "@assets/8af82dde-3ec2-4d2d-b2c5-e15af307a6fc_1762432372359.png";

export default function AgentTeamShowcase() {
  const agents = [
    {
      name: "Luna",
      role: "Sales Agent",
      specialty: "Closing deals & conversions",
      icon: TrendingUp,
      color: "cyan",
      position: "left-[8%]",
    },
    {
      name: "Aria",
      role: "Support Agent",
      specialty: "Customer service excellence",
      icon: MessageSquare,
      color: "purple",
      position: "left-[32%]",
    },
    {
      name: "Nova",
      role: "Appointment Agent",
      specialty: "Scheduling & coordination",
      icon: Calendar,
      color: "violet",
      position: "left-[56%]",
    },
    {
      name: "Stella",
      role: "Call Handler",
      specialty: "24/7 phone operations",
      icon: Phone,
      color: "amber",
      position: "left-[80%]",
    },
  ];

  return (
    <section className="relative py-40 overflow-hidden">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-200/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[140px]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-xl mb-8"
            style={{
              boxShadow: "0 0 40px rgba(139,92,246,0.4)",
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">
              Your AI Workforce
            </span>
          </motion.div>

          <h2 className="font-display text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-gray-200">Meet Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 relative inline-block">
              AI Agents
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-[80px] -z-10" />
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Specialized AI Agents, each expertly trained to handle specific business needs. Available 24/7 to transform your operations.
          </p>
        </motion.div>

        {/* Main Agent Team Image with Interactive Overlays */}
        <div className="relative">
          {/* Glowing Frame Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image with Premium Frame */}
            <div 
              className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-xl p-2"
              style={{
                boxShadow: "0 0 120px rgba(139,92,246,0.5), inset 0 0 100px rgba(139,92,246,0.05)",
              }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20">
                <img
                  src={agentTeam}
                  alt="AI Agent Team"
                  className="w-full h-auto"
                />
                
                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10" />
              </div>
            </div>

            {/* Interactive Agent Labels */}
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`absolute bottom-8 ${agent.position} -translate-x-1/2 group cursor-pointer`}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Agent Info Card */}
                  <div 
                    className="relative bg-black/90 backdrop-blur-2xl border-2 rounded-2xl px-5 py-4 min-w-[200px]"
                    style={{
                      borderColor: `rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.5)`,
                      boxShadow: `0 0 40px rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.4)`,
                    }}
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center`}
                        style={{
                          backgroundImage: agent.color === 'cyan' 
                            ? 'linear-gradient(to bottom right, rgba(6,182,212,0.3), rgba(8,145,178,0.2))'
                            : agent.color === 'purple'
                            ? 'linear-gradient(to bottom right, rgba(139,92,246,0.3), rgba(124,58,237,0.2))'
                            : agent.color === 'violet'
                            ? 'linear-gradient(to bottom right, rgba(168,85,247,0.3), rgba(147,51,234,0.2))'
                            : 'linear-gradient(to bottom right, rgba(251,191,36,0.3), rgba(245,158,11,0.2))',
                        }}
                      >
                        <Icon 
                          className={`w-5 h-5`}
                          style={{
                            color: agent.color === 'cyan' ? '#06B6D4' : agent.color === 'purple' ? '#8B5CF6' : agent.color === 'violet' ? '#A855F7' : '#FBBf24',
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-base font-black text-gray-200">{agent.name}</div>
                        <div 
                          className="text-xs font-bold"
                          style={{
                            color: agent.color === 'cyan' ? '#06B6D4' : agent.color === 'purple' ? '#8B5CF6' : agent.color === 'violet' ? '#A855F7' : '#FBBf24',
                          }}
                        >
                          {agent.role}
                        </div>
                      </div>
                    </div>
                    
                    {/* Specialty */}
                    <div className="text-xs text-gray-400 leading-tight">
                      {agent.specialty}
                    </div>

                    {/* Connecting Line */}
                    <div 
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(to bottom, rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.8), transparent)`,
                      }}
                    />
                  </div>

                  {/* Glow Effect on Hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-2xl"
                    style={{
                      background: `radial-gradient(circle, rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.6), transparent)`,
                    }}
                  />
                </motion.div>
              );
            })}

            {/* Corner Accents */}
            <div className="absolute -top-3 -left-3 w-24 h-24 border-l-4 border-t-4 border-purple-500/60 rounded-tl-3xl" />
            <div className="absolute -top-3 -right-3 w-24 h-24 border-r-4 border-t-4 border-cyan-500/60 rounded-tr-3xl" />
            <div className="absolute -bottom-3 -left-3 w-24 h-24 border-l-4 border-b-4 border-violet-500/60 rounded-bl-3xl" />
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-4 border-b-4 border-amber-500/60 rounded-br-3xl" />

            {/* Pulsing Border Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-purple-400/30"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 4 === 0 ? 'rgba(6,182,212,0.8)' : i % 4 === 1 ? 'rgba(139,92,246,0.8)' : i % 4 === 2 ? 'rgba(168,85,247,0.8)' : 'rgba(251,191,36,0.8)',
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  boxShadow: "0 0 20px currentColor",
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}

            {/* Mega Glow Behind Image */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] blur-[100px] -z-10"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.6), rgba(6,182,212,0.4), transparent)",
              }}
            />
          </motion.div>
        </div>

        {/* Features Grid Below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border hover:border-opacity-60 transition-all"
                style={{
                  borderColor: `rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.3)`,
                  boxShadow: `0 0 0px rgba(${agent.color === 'cyan' ? '6,182,212' : agent.color === 'purple' ? '139,92,246' : agent.color === 'violet' ? '168,85,247' : '251,191,36'}, 0.2)`,
                }}
              >
                <Icon 
                  className="w-8 h-8 mb-4"
                  style={{
                    color: agent.color === 'cyan' ? '#06B6D4' : agent.color === 'purple' ? '#8B5CF6' : agent.color === 'violet' ? '#A855F7' : '#FBBf24',
                  }}
                />
                <h3 className="text-xl font-bold text-gray-200 mb-2">{agent.name}</h3>
                <div 
                  className="text-sm font-semibold mb-3"
                  style={{
                    color: agent.color === 'cyan' ? '#06B6D4' : agent.color === 'purple' ? '#8B5CF6' : agent.color === 'violet' ? '#A855F7' : '#FBBf24',
                  }}
                >
                  {agent.role}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {agent.specialty}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-500 opacity-50" />
    </section>
  );
}
