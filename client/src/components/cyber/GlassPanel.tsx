import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'terminal' | 'holo';
  hover?: boolean;
  glow?: boolean;
  'data-testid'?: string;
}

/**
 * Premium glassmorphism panel matching mobile 10/10 aesthetic
 * Supports terminal and holographic variants
 */
export function GlassPanel({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  glow = false,
  'data-testid': testId
}: GlassPanelProps) {
  const variants = {
    default: 'bg-black/40 backdrop-blur-xl border border-white/10',
    terminal: 'bg-black/60 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    holo: 'bg-gradient-to-br from-purple-900/20 via-black/40 to-cyan-900/20 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]',
  };

  const glowVariants = {
    default: '',
    terminal: 'hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]',
    holo: 'hover:shadow-[0_0_60px_rgba(168,85,247,0.4)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-lg overflow-hidden transition-all duration-300',
        variants[variant],
        hover && 'hover:border-white/20 cursor-pointer',
        glow && glowVariants[variant],
        className
      )}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}
