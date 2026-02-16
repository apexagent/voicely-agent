import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HoloStatBlockProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'cyan' | 'purple' | 'green' | 'red';
  className?: string;
  'data-testid'?: string;
}

/**
 * Holographic stat display with neon accents and animated values
 * Matches elite mobile aesthetic
 */
export function HoloStatBlock({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'cyan',
  className,
  'data-testid': testId
}: HoloStatBlockProps) {
  const variantColors = {
    cyan: {
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      bg: 'bg-cyan-500/5',
    },
    purple: {
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      bg: 'bg-purple-500/5',
    },
    green: {
      border: 'border-green-500/30',
      text: 'text-green-400',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      bg: 'bg-green-500/5',
    },
    red: {
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      bg: 'bg-red-500/5',
    },
  };

  const colors = variantColors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative p-6 rounded-lg border backdrop-blur-xl transition-all duration-300',
        colors.border,
        colors.glow,
        colors.bg,
        'hover:border-opacity-80 hover:shadow-2xl',
        className
      )}
      data-testid={testId}
    >
      {/* Holographic corner accents */}
      <div className={cn('absolute top-0 left-0 w-2 h-2 border-t border-l', colors.border)} />
      <div className={cn('absolute top-0 right-0 w-2 h-2 border-t border-r', colors.border)} />
      <div className={cn('absolute bottom-0 left-0 w-2 h-2 border-b border-l', colors.border)} />
      <div className={cn('absolute bottom-0 right-0 w-2 h-2 border-b border-r', colors.border)} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-mono">
            {label}
          </p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('text-3xl font-bold font-mono', colors.text)}
            data-testid={`${testId}-value`}
          >
            {value}
          </motion.p>
          
          {trend && (
            <div className="flex items-center mt-2 gap-1">
              <span
                className={cn(
                  'text-xs font-mono',
                  trend.direction === 'up' && 'text-green-400',
                  trend.direction === 'down' && 'text-red-400',
                  trend.direction === 'neutral' && 'text-gray-400'
                )}
                data-testid={`${testId}-trend`}
              >
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.direction === 'neutral' && '→'}
                {' '}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={cn('p-3 rounded-lg', colors.bg)}>
            <Icon className={cn('w-6 h-6', colors.text)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
