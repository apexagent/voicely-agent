import { motion } from "framer-motion";

interface CyberBackgroundProps {
  intensity?: "low" | "medium" | "high";
  showGrid?: boolean;
  showParticles?: boolean;
  className?: string;
}

export function CyberBackground({ 
  intensity = "medium", 
  showGrid = true, 
  showParticles = true,
  className = ""
}: CyberBackgroundProps) {
  const particleCount = intensity === "high" ? 50 : intensity === "medium" ? 30 : 15;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {showGrid && (
        <div className="absolute inset-0 cyber-grid opacity-20" />
      )}
      
      {showParticles && (
        <div className="absolute inset-0">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 
                  ? "var(--cyber-purple)" 
                  : i % 3 === 1 
                  ? "var(--cyber-cyan)" 
                  : "var(--cyber-pink)",
                boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
    </div>
  );
}
