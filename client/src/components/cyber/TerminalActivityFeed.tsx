import { motion, AnimatePresence } from "framer-motion";
import { Activity, Phone, DollarSign, TrendingUp, Clock } from "lucide-react";
import { HolographicBorder } from "./HolographicBorder";

interface ActivityItem {
  id: string;
  type: "call" | "revenue" | "milestone" | "system";
  action: string;
  amount?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface TerminalActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
}

const activityIcons = {
  call: Phone,
  revenue: DollarSign,
  milestone: TrendingUp,
  system: Activity,
};

const activityColors = {
  call: "#06B6D4",
  revenue: "#10B981",
  milestone: "#8B5CF6",
  system: "#F59E0B",
};

export function TerminalActivityFeed({
  activities,
  maxItems = 10,
  showTimestamps = true,
}: TerminalActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <HolographicBorder color="purple" intensity="medium">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Live Activity Feed</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-xs text-gray-400 font-mono">STREAMING</span>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="bg-black/60 rounded-lg p-4 font-mono text-sm space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="text-green-400 mb-3">
            &gt;&gt; SYSTEM: Activity monitor online
          </div>
          <div className="text-cyan-400 mb-3">
            &gt;&gt; FEED: Tracking {activities.length} events
          </div>

          <AnimatePresence mode="popLayout">
            {displayActivities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center py-8"
              >
                No recent activity
              </motion.div>
            ) : (
              displayActivities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const color = activityColors[activity.type];

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-white/5 transition-colors group"
                    data-testid={`activity-item-${activity.id}`}
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white text-sm leading-tight">
                            {activity.action}
                          </p>
                          {activity.amount !== undefined && (
                            <p
                              className="text-sm font-bold mt-1"
                              style={{ color }}
                            >
                              {activity.type === "revenue" ? "$" : ""}
                              {activity.amount.toLocaleString()}
                              {activity.type === "call" ? " tokens" : ""}
                            </p>
                          )}
                        </div>
                        {showTimestamps && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                        )}
                      </div>

                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10"
                            >
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">
            Showing {displayActivities.length} / {activities.length} events
          </span>
          <div className="flex gap-2">
            <div className="w-1 h-3 bg-cyan-400 animate-pulse" />
            <div className="w-1 h-3 bg-purple-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-1 h-3 bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </HolographicBorder>
  );
}
