import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isPlaying?: boolean;
  className?: string;
  barCount?: number;
  onInteract?: () => void;
}

export default function VoiceWaveform({
  isPlaying = false,
  className = "",
  barCount = 60,
  onInteract
}: VoiceWaveformProps) {
  const [mouseX, setMouseX] = useState(0.5);
  const [mouseY, setMouseY] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouseX(Math.max(0, Math.min(1, x)));
    setMouseY(Math.max(0, Math.min(1, y)));
  };

  const handleClick = () => {
    if (onInteract) {
      onInteract();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-32 flex items-center justify-center gap-1 cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      data-testid="waveform-visualization"
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const position = i / barCount;
        const distanceFromMouse = Math.abs(position - mouseX);
        const proximityFactor = Math.max(0, 1 - distanceFromMouse * 3);
        
        // Create wave pattern
        const baseHeight = isPlaying 
          ? 20 + Math.sin(position * Math.PI * 4 + Date.now() / 200) * 15
          : 15;
        
        const mouseInfluence = proximityFactor * 40 * (1 - mouseY);
        const finalHeight = baseHeight + mouseInfluence;
        
        // Color based on proximity and position
        const hue = 258; // Purple hue
        const saturation = 85 + proximityFactor * 15;
        const lightness = 60 + proximityFactor * 20;
        
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full transition-colors duration-150"
            style={{
              background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
              boxShadow: proximityFactor > 0.3 
                ? `0 0 ${10 + proximityFactor * 20}px hsl(${hue}, ${saturation}%, ${lightness}%)`
                : 'none',
            }}
            animate={{
              height: `${finalHeight}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          />
        );
      })}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}
