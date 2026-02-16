import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Clock } from "lucide-react";

interface AnalyticsData {
  sentiment: string;
  intent: string;
  score: string;
  responseTime: string;
}

interface AnalyticsSummaryProps {
  analytics: AnalyticsData;
}

export function AnalyticsSummary({ analytics }: AnalyticsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3" data-testid="analytics-summary">
      {/* Sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4"
      >
        <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          SENTIMENT
        </div>
        <div className="text-2xl font-bold text-cyan-400">
          {analytics.sentiment}
        </div>
      </motion.div>

      {/* Intent */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4"
      >
        <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-2">
          <Target className="w-3 h-3" />
          INTENT
        </div>
        <div className="text-sm font-bold text-cyan-400 leading-tight">
          {analytics.intent}
        </div>
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4"
      >
        <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          SCORE
        </div>
        <div className="text-2xl font-bold text-cyan-400">
          {analytics.score}
        </div>
      </motion.div>

      {/* Response Time */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4"
      >
        <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          RESPONSE TIME
        </div>
        <div className="text-2xl font-bold text-cyan-400">
          {analytics.responseTime}
        </div>
      </motion.div>
    </div>
  );
}
