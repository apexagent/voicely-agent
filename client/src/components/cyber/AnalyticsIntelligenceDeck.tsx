import { motion } from 'framer-motion';
import { Clock, MessageCircle, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentage: number; // 0-100 for circular progress
  color: 'purple' | 'cyan' | 'green' | 'violet';
  icon: typeof Clock;
}

interface AnalyticsIntelligenceDeckProps {
  durationSeconds: number;
  talkListenRatio: {
    userSeconds: number;
    agentSeconds: number;
  };
  conversionProbability?: number;
  interruptionCount: number;
  className?: string;
}

const colorClasses = {
  purple: {
    text: 'text-purple-400',
    ring: 'stroke-purple-500',
    glow: 'rgba(168,85,247,0.5)',
    bg: 'bg-purple-500/20',
  },
  cyan: {
    text: 'text-cyan-400',
    ring: 'stroke-cyan-500',
    glow: 'rgba(6,182,212,0.5)',
    bg: 'bg-cyan-500/20',
  },
  green: {
    text: 'text-green-400',
    ring: 'stroke-green-500',
    glow: 'rgba(34,197,94,0.5)',
    bg: 'bg-green-500/20',
  },
  violet: {
    text: 'text-violet-400',
    ring: 'stroke-violet-500',
    glow: 'rgba(139,92,246,0.5)',
    bg: 'bg-violet-500/20',
  },
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function CircularProgress({ 
  percentage, 
  color, 
  size = 56 
}: { 
  percentage: number; 
  color: keyof typeof colorClasses;
  size?: number;
}) {
  const colors = colorClasses[color];
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={colors.ring}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          filter: `drop-shadow(0 0 8px ${colors.glow})`,
        }}
      />
    </svg>
  );
}

export function AnalyticsIntelligenceDeck({
  durationSeconds = 0,
  talkListenRatio,
  conversionProbability = 0,
  interruptionCount = 0,
  className = '',
}: AnalyticsIntelligenceDeckProps) {
  // Calculate talk/listen percentage with safe defaults
  const userSeconds = talkListenRatio?.userSeconds ?? 0;
  const agentSeconds = talkListenRatio?.agentSeconds ?? 0;
  const totalTime = userSeconds + agentSeconds;
  const talkPercentage = totalTime > 0 
    ? (userSeconds / totalTime) * 100 
    : 50;
  
  const listenPercentage = totalTime > 0
    ? (agentSeconds / totalTime) * 100
    : 50;

  const kpis: AnalyticsKPI[] = [
    {
      label: 'Duration',
      value: formatDuration(durationSeconds),
      percentage: Math.min((durationSeconds / 300) * 100, 100), // Cap at 5 min
      color: 'cyan',
      icon: Clock,
    },
    {
      label: 'Talk/Listen',
      value: talkPercentage.toFixed(0),
      unit: '%',
      percentage: talkPercentage,
      color: 'purple',
      icon: MessageCircle,
    },
    {
      label: 'Conversion',
      value: (conversionProbability * 100).toFixed(0),
      unit: '%',
      percentage: conversionProbability * 100,
      color: 'green',
      icon: TrendingUp,
      trend: conversionProbability > 0.5 ? 'up' : 'neutral',
    },
    {
      label: 'Engagement',
      value: Math.max(0, 100 - (interruptionCount * 5)),
      unit: '%',
      percentage: Math.max(0, 100 - (interruptionCount * 5)),
      color: 'violet',
      icon: Activity,
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/20">
        <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
        <span className="text-xs font-bold text-purple-300 font-mono tracking-wider">
          ANALYTICS_INTELLIGENCE
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, index) => {
          const colors = colorClasses[kpi.color];
          const Icon = kpi.icon;

          return (
            <motion.div
              key={kpi.label}
              className="relative rounded-lg bg-black/60 border border-gray-800/50 p-3 overflow-hidden hover-elevate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at top right, ${colors.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon & Circular Progress */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${colors.bg} border border-gray-800/50`}>
                    <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                  </div>
                  <CircularProgress 
                    percentage={kpi.percentage} 
                    color={kpi.color}
                    size={44}
                  />
                </div>

                {/* Label */}
                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">
                  {kpi.label}
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-1">
                  <motion.span 
                    className={`text-xl font-bold ${colors.text}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={kpi.value}
                  >
                    {kpi.value}
                  </motion.span>
                  {kpi.unit && (
                    <span className="text-xs text-gray-500">{kpi.unit}</span>
                  )}
                </div>

                {/* Trend indicator */}
                {kpi.trend === 'up' && (
                  <div className="mt-1 text-[10px] text-green-400 font-mono">
                    ▲ POSITIVE
                  </div>
                )}
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.glow}, transparent)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Talk/Listen Ratio Visualization */}
      {totalTime > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-black/60 border border-gray-800/50">
          <div className="text-[10px] text-gray-500 font-mono uppercase mb-2">
            CONVERSATION_BALANCE
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${talkPercentage}%` }}
              transition={{ duration: 0.8 }}
              style={{
                boxShadow: '0 0 8px rgba(168,85,247,0.5)',
              }}
            />
            <motion.div
              className="bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${listenPercentage}%` }}
              transition={{ duration: 0.8 }}
              style={{
                boxShadow: '0 0 8px rgba(6,182,212,0.5)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
            <span className="text-purple-400">USER: {talkPercentage.toFixed(0)}%</span>
            <span className="text-cyan-400">AI: {listenPercentage.toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
