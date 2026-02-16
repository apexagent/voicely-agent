import { motion } from 'framer-motion';
import { 
  Info, 
  Calendar, 
  AlertTriangle, 
  ShoppingCart, 
  Headphones, 
  Phone, 
  MessageSquare 
} from 'lucide-react';
import type { IntentLabel } from '@shared/voiceAnalytics';

interface IntentGaugeProps {
  label: IntentLabel;
  confidence: number; // 0 to 1
  className?: string;
}

const intentConfig: Record<IntentLabel, {
  icon: typeof Info;
  color: string;
  bg: string;
  border: string;
  glow: string;
  displayName: string;
}> = {
  information_request: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    glow: 'rgba(59,130,246,0.5)',
    displayName: 'Info Request',
  },
  booking_appointment: {
    icon: Calendar,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/40',
    glow: 'rgba(168,85,247,0.5)',
    displayName: 'Booking',
  },
  complaint: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/40',
    glow: 'rgba(239,68,68,0.5)',
    displayName: 'Complaint',
  },
  sales_inquiry: {
    icon: ShoppingCart,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    glow: 'rgba(34,197,94,0.5)',
    displayName: 'Sales Inquiry',
  },
  support_request: {
    icon: Headphones,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/40',
    glow: 'rgba(6,182,212,0.5)',
    displayName: 'Support',
  },
  follow_up: {
    icon: Phone,
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/40',
    glow: 'rgba(139,92,246,0.5)',
    displayName: 'Follow-Up',
  },
  general_conversation: {
    icon: MessageSquare,
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/40',
    glow: 'rgba(156,163,175,0.5)',
    displayName: 'General Chat',
  },
};

export function IntentGauge({ 
  label = 'general_conversation', 
  confidence = 0.5, 
  className = '' 
}: IntentGaugeProps) {
  const safeLabel = (label || 'general_conversation') as IntentLabel;
  // Clamp and sanitize confidence to valid range (0-1)
  const safeConfidence = Math.max(0, Math.min(1, isNaN(confidence) ? 0.5 : confidence));
  const config = intentConfig[safeLabel] || intentConfig.general_conversation;
  const Icon = config.icon;
  
  // Convert confidence to percentage
  const confidencePercentage = safeConfidence * 100;

  return (
    <div className={`relative p-4 rounded-xl bg-black/60 border border-gray-800/50 overflow-hidden ${className}`}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${config.glow} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div 
              className={`p-2 rounded-lg ${config.bg} border ${config.border}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Icon className={`w-4 h-4 ${config.color}`} />
            </motion.div>
            <div>
              <div className="text-xs text-gray-500 font-mono">INTENT</div>
              <motion.div 
                className={`text-sm font-bold ${config.color}`}
                key={safeLabel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {config.displayName}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Confidence meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">CONFIDENCE</span>
            <motion.span 
              className={`font-bold ${config.color} font-mono`}
              key={safeConfidence}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {confidencePercentage.toFixed(0)}%
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${config.glow}, transparent)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Glow overlay */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${confidencePercentage}%`,
                background: config.glow,
                boxShadow: `0 0 10px ${config.glow}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: safeConfidence > 0.7 ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Confidence tiers */}
          <div className="flex gap-1 mt-3">
            {[
              { label: 'LOW', threshold: 0.33 },
              { label: 'MED', threshold: 0.66 },
              { label: 'HIGH', threshold: 1.0 },
            ].map((tier) => {
              const isActive = safeConfidence >= (tier.threshold - 0.33);
              return (
                <div
                  key={tier.label}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? config.bg : 'bg-gray-900'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 6px ${config.glow}` : 'none',
                  }}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-1">
            <span>LOW</span>
            <span>MEDIUM</span>
            <span>HIGH</span>
          </div>
        </div>
      </div>

      {/* Animated border pulse */}
      {safeConfidence > 0.7 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.glow}, transparent)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
