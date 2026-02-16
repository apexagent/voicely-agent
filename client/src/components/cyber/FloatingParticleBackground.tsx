import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface FloatingParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

export function FloatingParticleBackground({ 
  particleCount = 80,
  className = ""
}: FloatingParticleBackgroundProps) {
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      "rgba(139, 92, 246, 0.3)",
      "rgba(6, 182, 212, 0.3)",
      "rgba(139, 92, 246, 0.2)",
      "rgba(6, 182, 212, 0.2)"
    ];

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B1E] via-[#0F0F23] to-[#000000]" />
      
      {/* Radial blur gradient from center */}
      <div className="absolute inset-0 bg-radial-gradient opacity-50"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(10, 11, 30, 0.8) 70%)"
        }}
      />

      {/* Optional animated grid overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Large purple glow in center */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)",
          filter: "blur(80px)"
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Cyan accent glow */}
      <motion.div
        className="absolute left-1/4 top-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent)",
          filter: "blur(60px)"
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
}
