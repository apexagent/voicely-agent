import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface TerminalLogProps {
  logs: LogEntry[];
  maxLines?: number;
  className?: string;
  'data-testid'?: string;
}

/**
 * Terminal-style log viewer with auto-scroll and color-coded levels
 * Matches Agent Studio terminal aesthetic
 */
export function TerminalLog({ 
  logs, 
  maxLines = 20,
  className,
  'data-testid': testId
}: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const levelColors = {
    info: 'text-cyan-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  const levelPrefixes = {
    info: '[INFO]',
    success: '[OK]',
    warning: '[WARN]',
    error: '[ERROR]',
  };

  const displayLogs = logs.slice(-maxLines);

  return (
    <div
      className={cn(
        'bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg overflow-hidden',
        'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        className
      )}
      data-testid={testId}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyan-950/30 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            System Log
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">LIVE</span>
        </div>
      </div>

      {/* Log content */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
          setAutoScroll(isAtBottom);
        }}
      >
        <AnimatePresence initial={false}>
          {displayLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 font-mono text-xs"
              data-testid={`${testId}-entry-${index}`}
            >
              <span className="text-gray-500 shrink-0">{log.timestamp}</span>
              <span className={cn('shrink-0 font-bold', levelColors[log.level])}>
                {levelPrefixes[log.level]}
              </span>
              <span className="text-gray-300">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayLogs.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm font-mono">
            No log entries
          </div>
        )}
      </div>
    </div>
  );
}
