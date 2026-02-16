import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityEntry {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface NeonActivityFeedProps {
  activities: ActivityEntry[];
  maxItems?: number;
  className?: string;
  'data-testid'?: string;
}

/**
 * Neon-accented activity feed with animated entries
 * Real-time updates with smooth transitions
 */
export function NeonActivityFeed({
  activities,
  maxItems = 10,
  className,
  'data-testid': testId
}: NeonActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      color: 'text-green-400',
      border: 'border-green-500/30',
      bg: 'bg-green-500/5',
      glow: 'shadow-[0_0_10px_rgba(34,197,94,0.2)]',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-400',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/5',
      glow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
      glow: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    },
    info: {
      icon: Info,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    },
  };

  return (
    <div
      className={cn(
        'bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6',
        className
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">LIVE</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {displayActivities.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-300',
                  config.border,
                  config.bg,
                  config.glow,
                  'hover:border-opacity-80'
                )}
                data-testid={`${testId}-item-${index}`}
              >
                {/* Neon accent line */}
                <div className={cn('absolute left-0 top-0 h-full w-1 rounded-l-lg', config.bg)} />

                <div className="flex items-start gap-3 ml-2">
                  <div className={cn('p-2 rounded-lg', config.bg)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-gray-500 font-mono shrink-0">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {activity.description}
                    </p>

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 font-mono"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {displayActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
