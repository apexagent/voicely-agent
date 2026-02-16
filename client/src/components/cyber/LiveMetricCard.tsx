import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveMetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  format?: 'number' | 'percent' | 'currency' | 'duration';
  updateInterval?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  'data-testid'?: string;
}

/**
 * Animated metric card with real-time value updates and trend indicators
 * Features smooth number animations and status indicators
 */
export function LiveMetricCard({
  title,
  value,
  previousValue,
  suffix,
  prefix,
  icon: Icon,
  format = 'number',
  variant = 'default',
  className,
  'data-testid': testId
}: LiveMetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsUpdating(true);
      const steps = 20;
      const stepValue = (value - displayValue) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue((prev) => {
          if (currentStep >= steps) {
            clearInterval(interval);
            setIsUpdating(false);
            return value;
          }
          return prev + stepValue;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [value, displayValue]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'duration':
        return `${val.toFixed(1)}s`;
      default:
        return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
  };

  const change = previousValue !== undefined ? ((value - previousValue) / previousValue) * 100 : 0;
  const trendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  const variantStyles = {
    default: {
      border: 'border-white/10',
      bg: 'bg-black/40',
      icon: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
    },
    success: {
      border: 'border-green-500/30',
      bg: 'bg-green-500/5',
      icon: 'text-green-400',
      iconBg: 'bg-green-500/10',
    },
    warning: {
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/5',
      icon: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
    },
    danger: {
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/10',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative p-6 rounded-lg border backdrop-blur-xl',
        styles.border,
        styles.bg,
        'transition-all duration-300 hover:border-opacity-80',
        className
      )}
      data-testid={testId}
    >
      {/* Pulsing indicator when updating */}
      {isUpdating && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider font-mono">
          {title}
        </h3>
        <div className={cn('p-2 rounded-lg', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.icon)} />
        </div>
      </div>

      <div className="space-y-2">
        <motion.div
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="flex items-baseline gap-1"
        >
          {prefix && <span className="text-2xl text-gray-400 font-mono">{prefix}</span>}
          <span className="text-4xl font-bold text-white font-mono" data-testid={`${testId}-value`}>
            {formatValue(displayValue)}
          </span>
          {suffix && <span className="text-xl text-gray-400 font-mono">{suffix}</span>}
        </motion.div>

        {previousValue !== undefined && (
          <div className="flex items-center gap-2">
            {trendDirection === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
            {trendDirection === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
            {trendDirection === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
            <span
              className={cn(
                'text-sm font-mono',
                trendDirection === 'up' && 'text-green-400',
                trendDirection === 'down' && 'text-red-400',
                trendDirection === 'neutral' && 'text-gray-400'
              )}
              data-testid={`${testId}-trend`}
            >
              {change > 0 && '+'}
              {change.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
