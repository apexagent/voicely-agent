import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface ParticleRingProps {
  size?: number;
  particleCount?: number;
  color?: string;
  secondaryColor?: string;
  speed?: "slow" | "medium" | "fast";
  className?: string;
}

export function ParticleRing({
  size = 300,
  particleCount = 16,
  color = "#8b5cf6",
  secondaryColor = "#06b6d4",
  speed = "medium",
  className = "",
}: ParticleRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const speedMap = { slow: 25, medium: 18, fast: 10 };
  const duration = speedMap[speed];
  const radius = size / 2 - 20;

  const particles = useMemo(() => 
    [...Array(particleCount)].map((_, i) => ({
      angle: (i / particleCount) * 2 * Math.PI,
      size: 3 + (i % 3),
      isSecondary: i % 3 === 0,
    })), [particleCount]
  );

  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }} data-testid="particle-ring">
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      data-testid="particle-ring"
    >
      {/* Outer ring glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 60%, ${color}15 70%, transparent 80%)`,
        }}
      />

      {/* Orbiting particles - outer ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(particleCount)].map((_, i) => {
          const angle = (i / particleCount) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const particleSize = 3 + Math.random() * 4;
          const isSecondary = i % 3 === 0;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: particleSize,
                height: particleSize,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                backgroundColor: isSecondary ? secondaryColor : color,
                boxShadow: `0 0 ${particleSize * 2}px ${isSecondary ? secondaryColor : color}`,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* Inner ring - counter-rotating */}
      <motion.div
        className="absolute"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          left: "15%",
          top: "15%",
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: duration * 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(Math.floor(particleCount / 2))].map((_, i) => {
          const angle = (i / (particleCount / 2)) * 2 * Math.PI;
          const innerRadius = (size * 0.7) / 2 - 15;
          const x = Math.cos(angle) * innerRadius;
          const y = Math.sin(angle) * innerRadius;
          const particleSize = 2 + Math.random() * 3;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: particleSize,
                height: particleSize,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                backgroundColor: secondaryColor,
                boxShadow: `0 0 ${particleSize * 2}px ${secondaryColor}`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* Center pulsing core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 100%)`,
          boxShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Connecting lines effect */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15 }}
      >
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 2 * Math.PI;
          const x1 = size / 2;
          const y1 = size / 2;
          const x2 = x1 + Math.cos(angle) * radius;
          const y2 = y1 + Math.sin(angle) * radius;

          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 4"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
