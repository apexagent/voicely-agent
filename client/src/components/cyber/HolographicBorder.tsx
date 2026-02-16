import { motion } from "framer-motion";
import type { ReactNode } from "react";

const colorMap = {
  purple: "var(--cyber-purple)",
  cyan: "var(--cyber-cyan)",
  pink: "var(--cyber-pink)",
  green: "var(--cyber-green)",
  orange: "#F59E0B",
} as const;

type BorderColor = keyof typeof colorMap;

interface HolographicBorderProps {
  children: ReactNode;
  color?: BorderColor;
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
  className?: string;
}

const glowIntensityMap = {
  low: "4px",
  medium: "8px",
  high: "12px",
};

export function HolographicBorder({ 
  children, 
  color = "purple", 
  intensity = "medium",
  animated = true,
  className = "" 
}: HolographicBorderProps) {
  const borderColor = colorMap[color];
  const glowSize = glowIntensityMap[intensity];

  return (
    <motion.div
      className={`relative rounded-lg ${className}`}
      style={{
        background: "rgba(10, 11, 30, 0.6)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 ${glowSize} ${borderColor}, inset 0 0 ${glowSize} ${borderColor}33`,
      }}
      animate={animated ? {
        boxShadow: [
          `0 0 ${glowSize} ${borderColor}, inset 0 0 ${glowSize} ${borderColor}33`,
          `0 0 calc(${glowSize} * 1.5) ${borderColor}, inset 0 0 calc(${glowSize} * 1.5) ${borderColor}44`,
          `0 0 ${glowSize} ${borderColor}, inset 0 0 ${glowSize} ${borderColor}33`,
        ],
      } : undefined}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      } : undefined}
    >
      {children}
    </motion.div>
  );
}
