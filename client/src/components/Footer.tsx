import { Link } from "wouter";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";
import { useState } from "react";

// Holographic Scan Line Component
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.4) 50%, transparent 100%)",
        height: "80px",
      }}
      animate={{
        y: ["-80px", "100%"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Energy Ring Component
function EnergyRings() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-3xl border-2"
          style={{
            borderColor: i % 2 === 0 ? "rgba(139,92,246,0.3)" : "rgba(6,182,212,0.3)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <footer className="relative bg-gradient-to-b from-[#0A0B1E] via-black to-black border-t border-purple-500/20 overflow-hidden">
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0 opacity-40">
        {/* Animated Grid Pattern */}
        <motion.div 
          className="absolute inset-0" 
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Enhanced Radial Glow Effects */}
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "#8B5CF6" : "#06B6D4",
              boxShadow: `0 0 ${i % 3 === 0 ? "15px" : "10px"} currentColor`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* ULTRA Premium Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16"
        >
          <div 
            className="relative bg-gradient-to-br from-purple-600/10 via-violet-600/5 to-cyan-600/10 border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-2xl overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
            
            {/* Holographic Scan Line */}
            {isHovering && <ScanLine />}
            
            {/* Energy Rings */}
            <EnergyRings />

            {/* Corner Cyber Brackets */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500/60 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/60 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/60 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/60 rounded-br-2xl" />
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              {/* Left: CTA Info */}
              <div>
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-4"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(139,92,246,0.3)",
                      "0 0 40px rgba(139,92,246,0.6)",
                      "0 0 20px rgba(139,92,246,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-semibold text-purple-300">Start Building Today</span>
                </motion.div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-3">
                  Build Your AI Voice Workforce
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Deploy autonomous AI agents that handle calls, close deals, and grow your business 24/7. Join 10,000+ businesses already using AI voice agents.
                </p>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-4">
                <Link href="/mobile/contact">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-gray-100 font-bold px-8 py-6 text-lg shadow-lg hover:shadow-purple-500/50"
                    data-testid="button-create-first-agent"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Talk to Alice
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-lg backdrop-blur-xl"
                    data-testid="button-try-demo-footer"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 border-t border-purple-500/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-purple-300 transition-colors text-sm" data-testid="link-footer-home">
                Home
              </Link>
              <Link href="/mobile/industries" className="text-gray-300 hover:text-purple-300 transition-colors text-sm" data-testid="link-footer-industries">
                Industries
              </Link>
              <Link href="/mobile/agent" className="text-gray-300 hover:text-purple-300 transition-colors text-sm" data-testid="link-footer-agent">
                Agent
              </Link>
              <a href="mailto:voicelyagent@gmail.com" className="text-gray-300 hover:text-purple-300 transition-colors text-sm" data-testid="link-footer-contact">
                Contact
              </a>
            </div>

            {/* Instagram Icon */}
            <motion.a
              href="https://instagram.com/voicelyagent.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/10 to-violet-600/10 border-2 border-purple-500/20 flex items-center justify-center text-purple-300 transition-all group backdrop-blur-xl overflow-hidden"
              whileHover={{ 
                scale: 1.15, 
              }}
              whileTap={{ scale: 0.95 }}
              data-testid="link-instagram"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity"
              />
              <SiInstagram className="relative z-10 w-5 h-5 group-hover:scale-125 transition-all" />
            </motion.a>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              © 2026 <span className="text-purple-300 font-bold">Voicely Agent</span>
            </p>
          </div>
        </motion.div>

        {/* Dramatic Bottom Accent Line */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </footer>
  );
}
