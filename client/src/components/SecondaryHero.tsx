import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SecondaryHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Purple Wave Background */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Animated Wave Paths */}
          <motion.path
            d="M0,400 C150,350 350,450 500,400 L500,600 L0,600 Z"
            fill="url(#waveGrad1)"
            initial={{ d: "M0,400 C150,350 350,450 500,400 L500,600 L0,600 Z" }}
            animate={{
              d: [
                "M0,400 C150,350 350,450 500,400 L500,600 L0,600 Z",
                "M0,420 C150,370 350,470 500,420 L500,600 L0,600 Z",
                "M0,400 C150,350 350,450 500,400 L500,600 L0,600 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.path
            d="M0,450 C200,400 300,500 500,450 L500,600 L0,600 Z"
            fill="url(#waveGrad2)"
            initial={{ d: "M0,450 C200,400 300,500 500,450 L500,600 L0,600 Z" }}
            animate={{
              d: [
                "M0,450 C200,400 300,500 500,450 L500,600 L0,600 Z",
                "M0,470 C200,420 300,520 500,470 L500,600 L0,600 Z",
                "M0,450 C200,400 300,500 500,450 L500,600 L0,600 Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          <motion.path
            d="M0,500 C250,450 350,550 500,500 L500,600 L0,600 Z"
            fill="url(#waveGrad1)"
            opacity="0.5"
            initial={{ d: "M0,500 C250,450 350,550 500,500 L500,600 L0,600 Z" }}
            animate={{
              d: [
                "M0,500 C250,450 350,550 500,500 L500,600 L0,600 Z",
                "M0,520 C250,470 350,570 500,520 L500,600 L0,600 Z",
                "M0,500 C250,450 350,550 500,500 L500,600 L0,600 Z",
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </svg>
        
        {/* Black to transparent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
      </div>

      {/* Animated Starfield */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
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

      {/* Massive Purple Glows */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600/20 border-2 border-purple-500/40 backdrop-blur-xl mb-12"
          style={{
            boxShadow: "0 0 60px rgba(139,92,246,0.6)",
          }}
        >
          <Sparkles className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-bold text-purple-200 uppercase tracking-wider">
            Revolutionizing Voice AI
          </span>
        </motion.div>

        {/* Massive Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-display text-6xl lg:text-8xl font-black mb-8 leading-tight"
          data-testid="text-secondary-headline"
        >
          <motion.span
            className="block mb-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.4)]">
              Automate
            </span>
          </motion.span>
          
          <motion.span
            className="block mb-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.4)]">
              Everything
            </span>
          </motion.span>
          
          <motion.span
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-fuchsia-300"
              style={{
                filter: "drop-shadow(0 0 60px rgba(168,85,247,1)) drop-shadow(0 0 100px rgba(139,92,246,0.8))",
              }}
            >
              With AI Voice
            </span>
            <div className="absolute -inset-16 bg-gradient-to-r from-purple-600/60 via-violet-500/60 to-fuchsia-600/50 blur-[120px] -z-10" 
              style={{
                animation: "pulse 4s ease-in-out infinite",
              }}
            />
          </motion.span>
          
          <motion.span
            className="block mt-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300"
              style={{
                filter: "drop-shadow(0 0 50px rgba(168,85,247,0.8))",
              }}
            >
              Agents
            </span>
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
          className="text-xl lg:text-2xl text-purple-100/90 max-w-4xl mx-auto mb-12 leading-relaxed"
          style={{
            textShadow: "0 0 40px rgba(168,85,247,0.3)",
          }}
          data-testid="text-secondary-description"
        >
          Deploy autonomous agents that handle calls, close deals, and grow your business{" "}
          <span className="font-bold text-white">while you sleep</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Join Waitlist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 border-2 border-purple-400/40 font-black text-xl text-white relative overflow-hidden group min-w-[240px]"
            style={{
              boxShadow: "0 0 80px rgba(139,92,246,0.8)",
            }}
            data-testid="button-join-waitlist"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Join Waitlist
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Button Glow Pulse */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 80px rgba(139,92,246,0.8)",
                  "0 0 120px rgba(139,92,246,1)",
                  "0 0 80px rgba(139,92,246,0.8)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </motion.button>

          {/* Pricing Button */}
          <Link href="/#faq">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 rounded-2xl bg-black/40 border-2 border-purple-500/40 backdrop-blur-xl font-bold text-xl text-white hover:bg-black/60 hover:border-purple-400/60 transition-all min-w-[180px]"
              style={{
                boxShadow: "0 0 40px rgba(139,92,246,0.3)",
              }}
              data-testid="button-pricing"
            >
              Pricing
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-purple-200/70"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" 
              style={{ animationDelay: "0.5s" }}
            />
            <span>Setup in 5 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
