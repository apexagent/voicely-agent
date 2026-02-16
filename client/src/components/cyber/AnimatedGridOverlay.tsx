import { motion } from "framer-motion";

interface AnimatedGridOverlayProps {
  gridSize?: number;
  opacity?: number;
  color?: "purple" | "cyan" | "violet";
  animated?: boolean;
  className?: string;
}

const colors = {
  purple: "rgba(147, 51, 234, 0.03)",
  cyan: "rgba(6, 182, 212, 0.03)",
  violet: "rgba(139, 92, 246, 0.03)",
};

/**
 * Animated grid overlay for cyber aesthetic backgrounds
 * Part of 10/10 elite component library
 */
export function AnimatedGridOverlay({
  gridSize = 20,
  opacity = 1,
  color = "purple",
  animated = true,
  className = "",
}: AnimatedGridOverlayProps) {
  const gridColor = colors[color];
  
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 2px, transparent 2px), linear-gradient(90deg, ${gridColor} 2px, transparent 2px)`,
            backgroundSize: `${gridSize * 5}px ${gridSize * 5}px`,
          }}
          animate={{
            backgroundPosition: ["0px 0px", `${gridSize * 5}px ${gridSize * 5}px`],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}
