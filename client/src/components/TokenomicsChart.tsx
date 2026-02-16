import { motion } from "framer-motion";
import { TrendingUp, Flame, Lock, Users } from "lucide-react";

export default function TokenomicsChart() {
  const features = [
    {
      icon: TrendingUp,
      title: "Deflationary Model",
      description: "10% of all platform revenue automatically converts to $VOICE and burns forever",
      gradient: "from-purple-500 to-violet-600",
      color: "#8B5CF6",
    },
    {
      icon: Flame,
      title: "Buyback & Burn",
      description: "Permanent token removal creates increasing scarcity as platform grows",
      gradient: "from-orange-500 to-red-600",
      color: "#F97316",
    },
    {
      icon: Lock,
      title: "Team Vesting",
      description: "12-month linear vesting ensures long-term alignment with token holders",
      gradient: "from-cyan-500 to-blue-600",
      color: "#06B6D4",
    },
    {
      icon: Users,
      title: "Community First",
      description: "60% of supply allocated to public & ecosystem development",
      gradient: "from-pink-500 to-purple-600",
      color: "#EC4899",
    },
  ];

  return (
    <section className="relative py-40 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Subtle Animated Grid */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '80px 80px'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Subtle Floating Energy Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-cyan-600 rounded-full blur-[150px]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gray-200">Powered by </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                $VOICE Token
              </span>
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-[80px] -z-10" />
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            The world's first AI voice agent token with built-in deflationary mechanics
          </p>
        </motion.div>

        {/* Feature Grid - Centered Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/50 transition-all group backdrop-blur-xl"
                  data-testid={`tokenomics-card-${index}`}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start gap-6">
                    {/* Animated Gradient Icon */}
                    <motion.div
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-1`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full h-full rounded-2xl bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-10 h-10 text-purple-300" strokeWidth={2} />
                      </div>
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-200 mb-3 font-display">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Animated Border Accent */}
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
