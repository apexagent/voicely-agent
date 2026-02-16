import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';
import type { SentimentLabel } from '@shared/voiceAnalytics';

interface SentimentGaugeProps {
  score: number; // -1 to 1
  label: SentimentLabel;
  confidence: number; // 0 to 1
  className?: string;
}

const sentimentConfig = {
  positive: {
    icon: Smile,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    glow: 'rgba(34,197,94,0.5)',
  },
  neutral: {
    icon: Meh,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/40',
    glow: 'rgba(234,179,8,0.5)',
  },
  negative: {
    icon: Frown,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/40',
    glow: 'rgba(239,68,68,0.5)',
  },
};

export function SentimentGauge({ 
  score = 0, 
  label = 'neutral', 
  confidence = 0.5, 
  className = '' 
}: SentimentGaugeProps) {
  // Clamp and sanitize numeric inputs to valid ranges
  const safeScore = Math.max(-1, Math.min(1, isNaN(score) ? 0 : score));
  const safeConfidence = Math.max(0, Math.min(1, isNaN(confidence) ? 0.5 : confidence));
  const safeLabel = (label || 'neutral') as 'positive' | 'neutral' | 'negative';
  const config = sentimentConfig[safeLabel] || sentimentConfig.neutral;
  const Icon = config.icon;
  
  // Convert score (-1 to 1) to gauge position (0 to 100)
  const gaugePosition = ((safeScore + 1) / 2) * 100;

  return (
    <div className={`p-4 rounded-xl bg-black/60 border border-gray-800/50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-mono">SENTIMENT</div>
            <motion.div 
              className={`text-sm font-bold ${config.color}`}
              key={safeLabel}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {safeLabel.toUpperCase()}
            </motion.div>
          </div>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {(safeConfidence * 100).toFixed(0)}% CONF
        </div>
      </div>

      {/* Gauge Visualization */}
      <div className="space-y-2">
        {/* Score bar */}
        <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)',
            opacity: 0.3,
          }} />
          
          {/* Score indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-1"
            style={{
              left: `${gaugePosition}%`,
              background: config.glow,
              boxShadow: `0 0 12px ${config.glow}`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Score labels */}
        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
          <span>NEGATIVE</span>
          <span>NEUTRAL</span>
          <span>POSITIVE</span>
        </div>

        {/* Numeric score */}
        <div className="text-center">
          <motion.span 
            className={`text-2xl font-bold ${config.color} font-mono`}
            key={safeScore}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {safeScore.toFixed(2)}
          </motion.span>
        </div>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.glow} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
