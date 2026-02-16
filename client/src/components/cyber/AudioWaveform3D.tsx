import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveform3DProps {
  waveformData?: number[]; // 0 to 1, audio amplitude data
  isActive?: boolean;
  className?: string;
  color?: 'purple' | 'cyan' | 'green';
}

export function AudioWaveform3D({ 
  waveformData = [], 
  isActive = false,
  className = '',
  color = 'purple',
}: AudioWaveform3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  // Color schemes
  const colorSchemes = {
    purple: {
      primary: 'rgba(168, 85, 247, 0.8)',
      secondary: 'rgba(139, 92, 246, 0.6)',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
    cyan: {
      primary: 'rgba(6, 182, 212, 0.8)',
      secondary: 'rgba(8, 145, 178, 0.6)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
    green: {
      primary: 'rgba(34, 197, 94, 0.8)',
      secondary: 'rgba(22, 163, 74, 0.6)',
      glow: 'rgba(34, 197, 94, 0.3)',
    },
  };

  const colors = colorSchemes[color];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      // Reset transform before scaling to avoid compounding
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      const centerY = height / 2;
      const barCount = 64; // Number of frequency bars
      const barWidth = width / barCount;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        // Get amplitude from data or generate smooth idle animation
        let amplitude: number;
        
        if (isActive && waveformData.length > 0) {
          // Use real audio data (interpolate if needed)
          const dataIndex = Math.floor((i / barCount) * waveformData.length);
          amplitude = waveformData[dataIndex] || 0;
        } else {
          // Idle state: smooth sine wave animation
          const offset = (timeRef.current + i * 0.2) * 0.05;
          amplitude = (Math.sin(offset) * 0.5 + 0.5) * 0.3; // 0 to 0.3
        }

        // Add subtle 3D perspective effect
        const perspective = 1 - (Math.abs(i - barCount / 2) / barCount) * 0.3;
        const barHeight = amplitude * height * 0.8 * perspective;

        // Bar position
        const x = i * barWidth + gap;
        const y = centerY - barHeight / 2;

        // Create gradient for 3D effect
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(0.5, colors.secondary);
        gradient.addColorStop(1, colors.primary);

        // Draw main bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - gap, barHeight);

        // Draw holographic glow
        if (isActive && amplitude > 0.2) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = colors.glow;
          ctx.fillRect(x, y, barWidth - gap, barHeight);
          ctx.shadowBlur = 0;
        }

        // Draw reflection (mirrored bottom)
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = gradient;
        ctx.scale(1, -0.5);
        ctx.fillRect(x, -centerY - barHeight * 0.5, barWidth - gap, barHeight);
        ctx.restore();
      }

      // Draw center line
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Update time for animation
      timeRef.current += 1;

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [waveformData, isActive, colors]);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(168,85,247,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* Holographic overlay */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: isActive 
            ? `0 0 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
            : 'none',
        }}
      />
    </motion.div>
  );
}
