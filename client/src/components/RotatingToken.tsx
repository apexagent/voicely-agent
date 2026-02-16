import { motion } from "framer-motion";
import { Coins } from "lucide-react";

export default function RotatingToken() {
  return (
    <div className="relative w-full max-w-md mx-auto h-96 flex items-center justify-center perspective-1000">
      {/* Orbiting Particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-purple-400 glow-purple"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * 150,
                Math.cos(((angle + 180) * Math.PI) / 180) * 150,
                Math.cos((angle * Math.PI) / 180) * 150,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * 150,
                Math.sin(((angle + 180) * Math.PI) / 180) * 150,
                Math.sin((angle * Math.PI) / 180) * 150,
              ],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        );
      })}

      {/* Main Token */}
      <motion.div
        className="relative w-64 h-64"
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 flex items-center justify-center border-8 border-purple-400/30"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: "0 0 100px rgba(139,92,246,0.8), 0 0 200px rgba(168,85,247,0.6), inset 0 0 60px rgba(139,92,246,0.5)",
          }}
        >
          <div className="text-center">
            <Coins className="w-20 h-20 text-white mb-4 mx-auto" />
            <div className="text-4xl font-bold text-white font-display">$VOICE</div>
            <div className="text-sm text-purple-200 mt-2">AI Token</div>
          </div>
          
          {/* Inner Glow Rings */}
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-purple-300/40"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-12 rounded-full border-2 border-purple-300/30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-700 via-purple-600 to-violet-500 flex items-center justify-center border-8 border-violet-400/30"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 0 100px rgba(168,85,247,0.8), 0 0 200px rgba(139,92,246,0.6), inset 0 0 60px rgba(168,85,247,0.5)",
          }}
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-white font-display mb-2">∞</div>
            <div className="text-xl text-violet-200">Deflationary</div>
          </div>
        </div>
      </motion.div>

      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute top-0 left-1/2 w-4 h-4 -ml-2 rounded-full bg-purple-400 glow-purple" />
        <div className="absolute bottom-0 left-1/2 w-4 h-4 -ml-2 rounded-full bg-violet-400 glow-purple-bright" />
      </motion.div>
    </div>
  );
}
