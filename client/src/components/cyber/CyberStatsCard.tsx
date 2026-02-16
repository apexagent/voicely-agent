import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { HolographicBorder } from "./HolographicBorder";

interface CyberStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
  };
  gradient?: string;
  dataTestId?: string;
}

export function CyberStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "#06B6D4",
  trend,
  gradient = "from-cyan-600/20 to-blue-600/20",
  dataTestId,
}: CyberStatsCardProps) {
  return (
    <HolographicBorder color="cyan" intensity="medium">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-br ${gradient} p-6 space-y-4`}
        data-testid={dataTestId}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${iconColor}40, ${iconColor}20)`,
                border: `1px solid ${iconColor}30`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {trend && (
            <div className="text-right">
              <div
                className={`text-sm font-bold ${
                  trend.value > 0
                    ? "text-green-400"
                    : trend.value < 0
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </div>
              <div className="text-xs text-gray-500">{trend.label}</div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl font-bold text-white"
          >
            {value}
          </motion.div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${iconColor}80, ${iconColor})`,
            }}
          />
        </div>
      </motion.div>
    </HolographicBorder>
  );
}
