import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, Users, PhoneCall } from "lucide-react";
import type { CallStats } from "@shared/schema";

export default function LiveStats() {
  const { data, isLoading } = useQuery<{ success: boolean; stats: CallStats }>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  const stats = data?.stats;

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 animate-pulse">
            <div className="h-12 bg-purple-500/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6 hover-elevate"
        data-testid="stat-total-calls"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <PhoneCall className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-200 font-display">
              {stats.totalCalls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Calls Handled</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
          <Activity className="w-3 h-3" />
          <span>Live Counter</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6 hover-elevate"
        data-testid="stat-active-agents"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-500/20 rounded-lg">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-200 font-display">
              {stats.activeAgents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Active AI Agents</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Online Now</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6 hover-elevate"
        data-testid="stat-uptime"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Activity className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-200 font-display">
              99.99%
            </div>
            <div className="text-sm text-gray-400">Uptime SLA</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>24/7/365 Availability</span>
        </div>
      </motion.div>
    </div>
  );
}
