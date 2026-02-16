import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "text" | "card" | "stat" | "table" | "chart";
  count?: number;
  className?: string;
}

/**
 * Premium skeleton loading states with pulse animation
 * Part of 10/10 elite component library
 */
export function SkeletonLoader({
  variant = "text",
  count = 1,
  className = "",
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "text":
        return (
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "h-4 bg-gradient-to-r from-purple-500/10 via-purple-500/20 to-purple-500/10 rounded",
                  i === count - 1 ? "w-2/3" : "w-full",
                  className
                )}
              >
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ))}
          </div>
        );

      case "card":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent",
                  className
                )}
              >
                <div className="space-y-4">
                  <div className="h-6 w-1/2 bg-purple-500/10 rounded" />
                  <div className="h-4 w-full bg-purple-500/10 rounded" />
                  <div className="h-4 w-3/4 bg-purple-500/10 rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-purple-500/10 rounded" />
                    <div className="h-16 bg-purple-500/10 rounded" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "stat":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent",
                  className
                )}
              >
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-purple-500/10 rounded" />
                  <div className="h-8 w-2/3 bg-purple-500/20 rounded" />
                  <div className="h-3 w-1/2 bg-purple-500/10 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "table":
        return (
          <div className={cn("space-y-2", className)}>
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border border-purple-500/20 rounded-lg bg-purple-500/5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-purple-500/20 rounded" />
              ))}
            </div>
            {/* Rows */}
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-4 gap-4 p-4 border border-purple-500/10 rounded-lg"
              >
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 bg-purple-500/10 rounded" />
                ))}
              </motion.div>
            ))}
          </div>
        );

      case "chart":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent",
              className
            )}
          >
            <div className="space-y-4">
              <div className="h-6 w-1/3 bg-purple-500/10 rounded" />
              <div className="h-64 bg-purple-500/5 rounded flex items-end gap-2 p-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-purple-500/20 rounded"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${20 + Math.random() * 80}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
}
