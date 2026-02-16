import { motion } from 'framer-motion';
import { Mic, Brain, Volume2, CheckCircle2, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import type { StageType, StageStatus } from '@shared/voiceAnalytics';

interface StageMetrics {
  latencyMs: number;
  confidence: number;
  status: StageStatus;
}

interface TelemetryPipelineProps {
  stages: {
    deepgram: StageMetrics;
    deepseek: StageMetrics;
    elevenlabs: StageMetrics;
  };
  className?: string;
}

interface StageConfig {
  id: StageType;
  name: string;
  icon: typeof Mic;
  color: {
    primary: string;
    border: string;
    bg: string;
    glow: string;
  };
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    id: 'deepgram',
    name: 'Deepgram STT',
    icon: Mic,
    color: {
      primary: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-500/10',
      glow: 'rgba(6, 182, 212, 0.5)',
    },
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    icon: Brain,
    color: {
      primary: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      glow: 'rgba(168, 85, 247, 0.5)',
    },
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs TTS',
    icon: Volume2,
    color: {
      primary: 'text-violet-400',
      border: 'border-violet-500/40',
      bg: 'bg-violet-500/10',
      glow: 'rgba(139, 92, 246, 0.5)',
    },
  },
];

function getStatusIcon(status: StageStatus) {
  switch (status) {
    case 'idle':
      return <div className="w-2 h-2 rounded-full bg-gray-600" />;
    case 'running':
      return <Loader2 className="w-4 h-4 animate-spin" />;
    case 'complete':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
  }
}

function getStatusColor(status: StageStatus) {
  switch (status) {
    case 'idle':
      return 'text-gray-500';
    case 'running':
      return 'text-yellow-400';
    case 'complete':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
  }
}

export function TelemetryPipeline({ stages, className = '' }: TelemetryPipelineProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-purple-500/20">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-bold text-cyan-300 font-mono tracking-wider">
          LIVE_TELEMETRY
        </span>
      </div>

      {/* Pipeline Stages */}
      <div className="space-y-3">
        {STAGE_CONFIGS.map((config, index) => {
          const metrics = stages[config.id];
          const Icon = config.icon;
          const isLast = index === STAGE_CONFIGS.length - 1;

          return (
            <div key={config.id}>
              {/* Stage Card */}
              <motion.div
                className={`relative rounded-lg border ${config.color.border} ${config.color.bg} p-3 overflow-hidden`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Animated background pulse */}
                {metrics.status === 'running' && (
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${config.color.glow} 0%, transparent 70%)`,
                    }}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Stage Content */}
                <div className="relative z-10 flex items-center gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.color.bg} border ${config.color.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.color.primary}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-bold ${config.color.primary}`}>
                        {config.name}
                      </span>
                      <div className={`flex items-center gap-1.5 ${getStatusColor(metrics.status)}`}>
                        {getStatusIcon(metrics.status)}
                        <span className="text-[10px] font-mono uppercase">
                          {metrics.status}
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {/* Latency */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono">
                          {metrics.latencyMs > 0 ? `${metrics.latencyMs.toFixed(0)}ms` : '—'}
                        </span>
                        <div className="w-12 h-1 bg-black/50 rounded-full overflow-hidden">
                          {metrics.latencyMs > 0 && (
                            <motion.div
                              className={`h-full ${config.color.bg}`}
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.min((metrics.latencyMs / 1000) * 100, 100)}%` 
                              }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Confidence */}
                      {metrics.confidence > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] opacity-60">CONF</span>
                          <span className="font-mono">
                            {(metrics.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar for running state */}
                {metrics.status === 'running' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config.color.glow}, transparent)`,
                    }}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.div>

              {/* Arrow connector */}
              {!isLast && (
                <div className="flex justify-center py-1">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Pipeline Status */}
      <div className="mt-4 pt-3 border-t border-gray-800/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-mono">PIPELINE_STATUS</span>
          <div className="flex items-center gap-2">
            {Object.values(stages).every(s => s.status === 'complete') && (
              <span className="text-green-400 font-mono">✓ ALL_SYSTEMS_OPERATIONAL</span>
            )}
            {Object.values(stages).some(s => s.status === 'running') && (
              <span className="text-yellow-400 font-mono animate-pulse">⟳ PROCESSING</span>
            )}
            {Object.values(stages).some(s => s.status === 'error') && (
              <span className="text-red-400 font-mono">⚠ ERROR_DETECTED</span>
            )}
            {Object.values(stages).every(s => s.status === 'idle') && (
              <span className="text-gray-500 font-mono">○ IDLE</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
