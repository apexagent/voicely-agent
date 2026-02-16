import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import globalOpsImage from "@assets/ab32c347-b05c-439d-b132-8e9dd136c284 (1)_1763024575866.png";

export default function GlobalActivityMap() {
  return (
    <section className="py-40 relative overflow-hidden">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[170px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/15 rounded-full blur-[160px]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600/20 border border-cyan-500/40 backdrop-blur-xl mb-8"
            style={{
              boxShadow: "0 0 40px rgba(6,182,212,0.4)",
            }}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">
              Real-Time Operations
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl lg:text-7xl font-black mb-6 leading-tight"
          >
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Global Operations
              </span>
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-600/40 via-blue-600/40 to-purple-600/40 blur-[80px] -z-10" />
            </span>
          </motion.h2>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI agents handling calls in real-time, across every timezone, 24/7/365
          </p>
        </div>

        {/* Global Operations Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/30"
            style={{
              boxShadow: "0 0 100px rgba(6,182,212,0.5)",
            }}
          >
            <img
              src={globalOpsImage}
              alt="Global AI Voice Operations Center"
              className="w-full h-auto"
              loading="lazy"
            />
            
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
        >
          <div className="text-center p-8 bg-cyan-600/10 rounded-2xl border-2 border-cyan-500/40 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 50px rgba(6,182,212,0.3)",
            }}
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 font-display mb-3">24/7</div>
            <div className="text-base text-gray-300 font-semibold">Global Coverage</div>
          </div>
          <div className="text-center p-8 bg-purple-600/10 rounded-2xl border-2 border-purple-500/40 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 50px rgba(139,92,246,0.3)",
            }}
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-violet-400 font-display mb-3">
              50+
            </div>
            <div className="text-base text-gray-300 font-semibold">Languages</div>
          </div>
          <div className="text-center p-8 bg-violet-600/10 rounded-2xl border-2 border-violet-500/40 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 50px rgba(168,85,247,0.3)",
            }}
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-400 font-display mb-3">
              7
            </div>
            <div className="text-base text-gray-300 font-semibold">Continents</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 via-purple-500 to-violet-600 opacity-50" />
    </section>
  );
}
