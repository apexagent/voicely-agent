import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HoloHeroBlockProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  gradient?: "purple" | "cyan" | "violet" | "blue";
  className?: string;
  children?: ReactNode;
}

const gradients = {
  purple: "from-purple-900/20 via-violet-900/20 to-cyan-900/20",
  cyan: "from-cyan-900/20 via-blue-900/20 to-purple-900/20",
  violet: "from-violet-900/20 via-purple-900/20 to-pink-900/20",
  blue: "from-blue-900/20 via-cyan-900/20 to-violet-900/20",
};

const textGradients = {
  purple: "from-purple-400 via-violet-400 to-cyan-400",
  cyan: "from-cyan-400 via-blue-400 to-purple-400",
  violet: "from-violet-400 via-purple-400 to-pink-400",
  blue: "from-blue-400 via-cyan-400 to-violet-400",
};

/**
 * Premium hero header block with holographic effects and animated background
 * Part of 10/10 elite component library
 */
export function HoloHeroBlock({
  title,
  description,
  icon: Icon,
  action,
  gradient = "purple",
  className = "",
  children,
}: HoloHeroBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-lg border border-purple-500/20 bg-gradient-to-r ${gradients[gradient]} p-8 ${className}`}
    >
      {/* Animated Radial Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.15),transparent_70%)]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children || (
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${textGradients[gradient]} bg-clip-text text-transparent flex items-center gap-3 mb-2`}>
                {Icon && <Icon className="w-10 h-10 text-purple-400" />}
                {title}
              </h1>
              {description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-gray-400"
                >
                  {description}
                </motion.p>
              )}
            </div>
            {action && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {action}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
