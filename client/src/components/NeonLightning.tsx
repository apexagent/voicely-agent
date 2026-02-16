import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Bolt, Sparkles } from "lucide-react";
import aiAgentImage from "@assets/generated_images/Elegant_AI_agent_portrait_purple_34004845.png";

export default function NeonLightning() {
  const capabilities = [
    { icon: Bolt, text: "Lightning-fast responses", color: "#F59E0B" },
    { icon: Zap, text: "Unstoppable availability", color: "#8B5CF6" },
    { icon: Sparkles, text: "Infinite scalability", color: "#06B6D4" },
  ];

  return (
    <section className="relative py-40 overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Subtle Animated Grid */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '80px 80px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Subtle Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-600 rounded-full blur-[150px]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-xl"
            >
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider">
                Our AI Agents Are Ready
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-display text-6xl lg:text-8xl font-bold mb-8 leading-tight"
              data-testid="text-lightning-headline"
            >
              <span className="text-gray-200">To Do</span>
              <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                  Anything
                </span>
                <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-3xl -z-10" />
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-10 leading-relaxed"
            >
              Harness the precision of AI. Our voice agents respond instantly, handle any volume, and deliver exceptional results.
            </motion.p>

            {/* Capability Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-10"
            >
              {capabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-center gap-4 bg-gradient-to-r from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-all group backdrop-blur-xl"
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${cap.color}20, ${cap.color}40)`,
                        border: `2px solid ${cap.color}40`,
                      }}
                    >
                      <Icon 
                        className="w-7 h-7 text-purple-300" 
                        style={{
                          filter: `drop-shadow(0 0 8px ${cap.color}60)`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-semibold text-gray-200">{cap.text}</span>
                    
                    {/* Subtle hover glow */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none blur-lg"
                      style={{
                        background: `radial-gradient(circle at left, ${cap.color}15, transparent)`,
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-gray-100 px-10 py-7 text-lg font-semibold group"
                style={{
                  boxShadow: "0 0 40px rgba(139,92,246,0.5)",
                }}
                data-testid="button-get-started-lightning"
              >
                <span className="flex items-center gap-3">
                  Get Started Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Refined AI Agent Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            {/* Subtle Rotating Ring */}
            <motion.div
              className="absolute inset-0 -inset-x-12 -inset-y-6"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 500 500" className="w-full h-full opacity-20">
                <circle
                  cx="250"
                  cy="250"
                  r="230"
                  fill="none"
                  stroke="url(#lightningGrad1)"
                  strokeWidth="2"
                  strokeDasharray="25 15"
                />
                <defs>
                  <linearGradient id="lightningGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* AI Agent Portrait */}
            <div className="relative z-10">
              <motion.img
                src={aiAgentImage}
                alt="Professional AI Agent"
                className="w-full h-auto drop-shadow-2xl rounded-2xl"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(139,92,246,0.6))",
                }}
                data-testid="img-lightning-agent"
              />
              {/* Subtle Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-violet-600/15 to-transparent blur-2xl rounded-2xl" />
            </div>

            {/* Professional Glow */}
            <div className="absolute -inset-12 bg-gradient-to-b from-purple-600/30 via-violet-600/30 to-cyan-600/20 blur-[100px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
