import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Phone, TrendingUp, Clock, DollarSign, Calendar, Sparkles } from "lucide-react";
import { HolographicBorder } from "./HolographicBorder";

interface AgentPerformancePanelProps {
  agentId: string;
  agentName: string;
}

interface Analytics {
  callsToday: number;
  callsThisWeek: number;
  totalCalls: number;
  successRate: number;
  avgDuration: number;
  revenueGenerated: number;
  avgResponseTime: number;
  trendData: Array<{ date: string; calls: number }>;
}

export function AgentPerformancePanel({ agentId, agentName }: AgentPerformancePanelProps) {
  const { data, isLoading } = useQuery<{ analytics: Analytics }>({
    queryKey: ["/api/agents", agentId, "analytics"],
    enabled: !!agentId,
  });

  const analytics = data?.analytics;

  if (isLoading) {
    return (
      <HolographicBorder color="cyan" intensity="medium">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      </HolographicBorder>
    );
  }

  if (!analytics) {
    return (
      <HolographicBorder color="cyan" intensity="medium">
        <div className="p-6 text-center">
          <p className="text-gray-400 text-sm">No analytics data available</p>
        </div>
      </HolographicBorder>
    );
  }

  return (
    <HolographicBorder color="cyan" intensity="high">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Live Performance</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span>REAL-TIME</span>
          </div>
        </div>

        {/* System Log */}
        <div className="bg-black/40 rounded-md p-3 font-mono text-xs space-y-1">
          <div className="text-green-400">&gt;&gt; ANALYTICS_ENGINE: Online</div>
          <div className="text-cyan-400">&gt;&gt; AGENT: {agentName}</div>
          <div className="text-green-400">&gt;&gt; DATA_SYNC: Active</div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calls Today */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-cyan-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold">TODAY</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {analytics.callsToday}
            </div>
            <div className="text-xs text-gray-400">calls handled</div>
          </motion.div>

          {/* Calls This Week */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <Phone className="w-4 h-4" />
              <span className="text-xs font-semibold">THIS WEEK</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {analytics.callsThisWeek}
            </div>
            <div className="text-xs text-gray-400">calls handled</div>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">SUCCESS RATE</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {analytics.successRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">conversion rate</div>
          </motion.div>

          {/* Revenue Generated */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-yellow-400">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold">REVENUE</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${analytics.revenueGenerated.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">total generated</div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Phone className="w-3 h-3" />
              <span>Total</span>
            </div>
            <div className="text-lg font-bold text-white">
              {analytics.totalCalls.toLocaleString()}
            </div>
          </div>

          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>Avg Time</span>
            </div>
            <div className="text-lg font-bold text-purple-400">
              {analytics.avgResponseTime.toFixed(1)}s
            </div>
          </div>

          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>Duration</span>
            </div>
            <div className="text-lg font-bold text-cyan-400">
              {Math.floor(analytics.avgDuration / 60)}m {Math.floor(analytics.avgDuration % 60)}s
            </div>
          </div>
        </div>

        {/* 7-Day Trend Sparkline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">7-DAY CALL TREND</span>
            <span className="text-xs text-cyan-400 font-mono">
              {analytics.trendData.reduce((sum, d) => sum + d.calls, 0)} calls
            </span>
          </div>
          <div className="h-16 flex items-end justify-between gap-1">
            {analytics.trendData.map((day, i) => {
              const maxCalls = Math.max(...analytics.trendData.map(d => d.calls), 1);
              const heightPercent = (day.calls / maxCalls) * 100;
              return (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm min-h-[4px] relative group"
                  title={`${day.date}: ${day.calls} calls`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {day.date.split('-').slice(1).join('/')}: {day.calls}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-black/40 rounded-md p-2 font-mono text-xs text-green-400 flex items-center justify-between">
          <span>&gt; Analytics refreshed</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-cyan-400 animate-pulse" />
            <div className="w-1 h-3 bg-cyan-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-1 h-3 bg-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </HolographicBorder>
  );
}
