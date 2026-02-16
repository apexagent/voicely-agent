import { motion } from "framer-motion";

interface ParticleFieldProps {
  count?: number;
  color?: "purple" | "cyan" | "violet" | "mixed";
  size?: "sm" | "md" | "lg";
  speed?: "slow" | "medium" | "fast";
  className?: string;
}

const colorMap = {
  purple: ["#a855f7", "#9333ea", "#7c3aed"],
  cyan: ["#06b6d4", "#0891b2", "#0e7490"],
  violet: ["#8b5cf6", "#7c3aed", "#6d28d9"],
  mixed: ["#a855f7", "#06b6d4", "#8b5cf6", "#ec4899"],
};

const sizeMap = {
  sm: [1, 2],
  md: [2, 3],
  lg: [3, 4],
};

const speedMap = {
  slow: [4, 6],
  medium: [2, 4],
  fast: [1, 2],
};

/**
 * Floating particle field background effect
 * Part of 10/10 elite component library
 */
export function ParticleField({
  count = 30,
  color = "mixed",
  size = "sm",
  speed = "medium",
  className = "",
}: ParticleFieldProps) {
  const colors = colorMap[color];
  const [minSize, maxSize] = sizeMap[size];
  const [minSpeed, maxSpeed] = speedMap[speed];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const particleSize = minSize + Math.random() * (maxSize - minSize);
        const duration = minSpeed + Math.random() * (maxSpeed - minSpeed);
        const delay = Math.random() * 2;
        const particleColor = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: particleSize,
              height: particleSize,
              backgroundColor: particleColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${particleSize * 2}px ${particleColor}`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
