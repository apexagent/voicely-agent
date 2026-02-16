import { motion } from "framer-motion";
import { Clock, Shield, Zap } from "lucide-react";
import agentWorkingImage from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762607585724.png";

export default function BenefitsCircular() {
  const benefits = [
    {
      icon: Clock,
      title: "Always Available",
      description: "24/7/365 uptime guaranteed",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Instant Scaling",
      description: "Handle unlimited calls",
      gradient: "from-pink-500 to-purple-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-gray-200">An Employee That</span>
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                Never Gets Sick
              </span>
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-600/30 via-violet-600/30 to-cyan-600/30 blur-2xl sm:blur-3xl -z-10" />
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Reliability you can count on, every single day
          </p>
        </motion.div>

        {/* Main Content Grid: Agent Image + Benefits - Mobile Optimized */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          {/* Left: AI Agent Working 24/7 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30">
              <img
                src={agentWorkingImage}
                alt="AI Agent Working 24/7"
                className="w-full h-auto"
                data-testid="img-agent-working"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Floating Badge - Mobile responsive */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="bg-black/60 backdrop-blur-xl border border-purple-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-200 font-display">
                        8,760 Hours
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300">
                        Working every year, no breaks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-cyan-600/20 blur-2xl sm:blur-3xl -z-10" />
          </motion.div>

          {/* Right: Three Circular Benefits - Mobile Optimized */}
          <div className="space-y-6 sm:space-y-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                  data-testid={`benefit-${index}`}
                >
                  <div className="flex items-center gap-4 sm:gap-6 bg-gradient-to-br from-[#0F1020]/80 to-[#0A0B1E]/80 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-500/40 transition-all group">
                    {/* Circular Icon - Mobile responsive */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-violet-600/10 flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500/50 transition-all">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${benefit.gradient} p-0.5`}>
                          <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      {/* Soft glow */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-20 blur-xl sm:blur-2xl transition-opacity -z-10`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-200 mb-1 sm:mb-2 font-display">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
