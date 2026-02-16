import { useEffect, useRef } from "react";

interface VoiceWaveformSimpleProps {
  isActive: boolean;
  color?: string;
}

export function VoiceWaveformSimple({ isActive, color = "cyan" }: VoiceWaveformSimpleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>(Array(24).fill(0));
  const velocityRef = useRef<number[]>(Array(24).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barCount = 24;
    
    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barCount;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        if (isActive) {
          const target = Math.random() * 0.3 + 0.4 + Math.sin(Date.now() / 200 + i) * 0.3;
          const spring = (target - barsRef.current[i]) * 0.15;
          velocityRef.current[i] += spring;
          velocityRef.current[i] *= 0.85;
          barsRef.current[i] += velocityRef.current[i];
        } else {
          barsRef.current[i] *= 0.92;
          velocityRef.current[i] *= 0.85;
        }

        const barHeight = Math.max(2, barsRef.current[i] * height);
        const x = i * barWidth + barWidth * 0.2;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        if (color === "purple") {
          // Purple-pink gradient (Voicely brand colors)
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.9)');  // purple-500
          gradient.addColorStop(0.5, 'rgba(236, 72, 153, 1)');  // pink-500
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.9)');  // purple-500
        } else if (color === "cyan") {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
          gradient.addColorStop(0.5, 'rgba(8, 145, 178, 1)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.8)');
        } else if (color === "blue") {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(0.5, 'rgba(96, 165, 250, 1)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
        } else if (color === "green") {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
          gradient.addColorStop(0.5, 'rgba(110, 231, 183, 1)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.8)');
        } else if (color === "orange") {
          gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
          gradient.addColorStop(0.5, 'rgba(251, 146, 60, 1)');
          gradient.addColorStop(1, 'rgba(249, 115, 22, 0.8)');
        } else {
          // Default/fallback
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 1)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.6, barHeight);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
      data-testid="voice-waveform-canvas"
    />
  );
}
