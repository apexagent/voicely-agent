import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelV2Props {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered" | "glow";
  blur?: "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
  glowColor?: "purple" | "cyan" | "violet" | "blue";
}

const variantStyles = {
  default: "bg-black/40 backdrop-blur-md border border-purple-500/20",
  elevated: "bg-gradient-to-br from-purple-900/20 via-black/40 to-transparent backdrop-blur-lg border border-purple-500/30 shadow-lg shadow-purple-500/10",
  bordered: "bg-black/60 backdrop-blur-xl border-2 border-purple-500/40",
  glow: "bg-black/30 backdrop-blur-md border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.3)]",
};

const blurLevels = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-xl",
};

const paddingLevels = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const glowColors = {
  purple: "shadow-purple-500/20 hover:shadow-purple-500/30",
  cyan: "shadow-cyan-500/20 hover:shadow-cyan-500/30",
  violet: "shadow-violet-500/20 hover:shadow-violet-500/30",
  blue: "shadow-blue-500/20 hover:shadow-blue-500/30",
};

/**
 * Enhanced glass morphism panel - v2 with advanced styling options
 * Part of 10/10 elite component library
 */
export function GlassPanelV2({
  children,
  variant = "default",
  blur,
  padding = "md",
  className = "",
  animated = true,
  glowColor = "purple",
}: GlassPanelV2Props) {
  const Component = animated ? motion.div : "div";
  
  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300",
        variantStyles[variant],
        blur && blurLevels[blur],
        paddingLevels[padding],
        variant === "glow" && glowColors[glowColor],
        "hover-elevate",
        className
      )}
    >
      {/* Animated gradient overlay for elevated/glow variants */}
      {(variant === "elevated" || variant === "glow") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
