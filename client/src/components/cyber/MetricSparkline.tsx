import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface MetricSparklineProps {
  data: number[];
  color?: "purple" | "cyan" | "green" | "red" | "yellow";
  height?: number;
  strokeWidth?: number;
  className?: string;
}

const colors = {
  purple: "#a855f7",
  cyan: "#06b6d4",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#eab308",
};

/**
 * Inline sparkline chart for showing metric trends
 * Part of 10/10 elite component library
 */
export function MetricSparkline({
  data,
  color = "purple",
  height = 32,
  strokeWidth = 2,
  className = "",
}: MetricSparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors[color]}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
