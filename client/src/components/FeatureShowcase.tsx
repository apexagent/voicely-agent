import { motion } from "framer-motion";
import { Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import aiAgentImage from "@assets/generated_images/AI_agent_working_holographic_data_5413f5ac.png";

export default function FeatureShowcase() {
  const features = [
    {
      icon: Brain,
      title: "Natural Conversations",
      description: "Sounds human, responds instantly, never gets tired",
      color: "#8B5CF6",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: Zap,
      title: "Smart Integrations",
      description: "Connects with your CRM, calendar, and tools",
      color: "#06B6D4",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: Sparkles,
      title: "Continuous Learning",
      description: "Gets smarter with every conversation",
      color: "#A855F7",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

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
            backgroundSize: '70px 70px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '70px 70px'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Subtle Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600 rounded-full blur-[120px]"
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider">
              Your New AI Agent Is Here
            </span>
          </motion.div>

          <h2 className="font-display text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gray-200">Your Wish Is </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                Their Command
              </span>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-3xl -z-10" />
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            AI agents that understand context, remember conversations, and execute complex tasks
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Refined AI Agent Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative order-2 lg:order-1"
          >
            {/* Subtle Rotating Ring */}
            <motion.div
              className="absolute inset-0 -inset-x-8 -inset-y-8"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 500 500" className="w-full h-full opacity-15">
                <circle
                  cx="250"
                  cy="250"
                  r="220"
                  fill="none"
                  stroke="url(#featureGrad1)"
                  strokeWidth="2"
                  strokeDasharray="20 10"
                />
                <defs>
                  <linearGradient id="featureGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* AI Agent Portrait */}
            <div className="relative z-10">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                src={aiAgentImage}
                alt="AI Agent Working with Data"
                className="w-full h-auto drop-shadow-2xl rounded-2xl"
                data-testid="img-ai-agent-holographic"
              />
              {/* Subtle Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-violet-600/15 to-transparent blur-2xl rounded-2xl" />
            </div>

            {/* Professional Glow */}
            <div className="absolute -inset-8 bg-gradient-to-b from-purple-600/25 via-violet-600/25 to-cyan-600/25 blur-[80px] -z-10" />
          </motion.div>

          {/* Right: Feature Cards */}
          <div className="space-y-6 order-1 lg:order-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/50 transition-all group backdrop-blur-xl"
                  data-testid={`feature-card-${index}`}
                  whileHover={{ scale: 1.02, x: 10 }}
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

                  {/* Subtle Animated Border Accent */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color}00, ${feature.color}, ${feature.color}00)`,
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.7 }}
                  />

                  {/* Subtle Hover Glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none blur-xl"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}20, transparent)`,
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
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4"
            >
              <Button
                onClick={() => {
                  const agentSection = document.getElementById('meet-your-workforce');
                  if (agentSection) {
                    agentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-gray-100 px-8 py-6 text-lg font-semibold w-full group"
                style={{
                  boxShadow: "0 0 30px rgba(139,92,246,0.4)",
                }}
                data-testid="button-learn-more-feature"
              >
                <span className="flex items-center justify-center gap-2">
                  Learn More About AI Agents
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
