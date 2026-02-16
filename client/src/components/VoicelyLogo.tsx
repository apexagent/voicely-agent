interface VoicelyLogoProps {
  variant?: "full" | "icon";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function VoicelyLogo({ 
  variant = "full", 
  className = "",
  iconClassName = "",
  textClassName = ""
}: VoicelyLogoProps) {
  
  // Voice waveform path - carefully crafted to match the reference
  const waveformPath = "M 5 20 L 15 20 Q 18 20 20 16 L 28 2 Q 30 -2 32 2 L 40 16 Q 42 20 45 20 L 55 20";
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Waveform Icon */}
      <svg 
        viewBox="0 0 60 40" 
        className={`${variant === "icon" ? "w-10 h-10" : "w-12 h-12"} ${iconClassName}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="voicely-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        <path
          d={waveformPath}
          fill="none"
          stroke="url(#voicely-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Text - Only show in full variant */}
      {variant === "full" && (
        <span className={`font-display font-bold text-2xl tracking-tight ${textClassName}`}>
          <span className="text-gray-200">oicely</span>
        </span>
      )}
    </div>
  );
}
