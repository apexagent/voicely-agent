import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { VOICELY_LOGO_URL } from "@/lib/constants";

interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "pulse" | "cyber" | "branded";
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
}

/**
 * Premium loading state component with multiple variants
 * Part of 10/10 elite component library
 */
export function LoadingState({
  message = "Loading...",
  variant = "cyber",
  size = "md",
  className = "",
  "data-testid": testId,
}: LoadingStateProps) {
  const sizeMap = {
    sm: { spinner: 20, text: "text-sm", logo: 28 },
    md: { spinner: 32, text: "text-base", logo: 48 },
    lg: { spinner: 48, text: "text-lg", logo: 72 },
  };

  const { spinner: spinnerSize, text: textSize, logo: logoSize } = sizeMap[size];

  if (variant === "spinner") {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`} data-testid={testId}>
        <Loader2 className="animate-spin text-purple-500" size={spinnerSize} />
        {message && <p className={`mt-4 text-gray-400 ${textSize}`}>{message}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`} data-testid={testId}>
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {message && <p className={`mt-4 text-gray-400 ${textSize}`}>{message}</p>}
      </div>
    );
  }

  if (variant === "branded") {
    const ringSize = logoSize + 24;
    const ringThickness = size === "sm" ? 3 : size === "md" ? 4 : 6;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`} data-testid={testId}>
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          {/* Spinning gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, #A855F7 0%, #06B6D4 50%, #A855F7 100%)`,
              padding: `${ringThickness}px`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), white calc(100% - ${ringThickness}px))`,
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), white calc(100% - ${ringThickness}px))`,
            }}
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={prefersReducedMotion ? {} : {
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Voicely logo in center with fallback background */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center"
              style={{ 
                width: logoSize, 
                height: logoSize,
              }}
            >
              <img 
                src={VOICELY_LOGO_URL} 
                alt="Voicely" 
                className="rounded-full w-full h-full object-cover"
                onError={(e) => {
                  // Hide broken image on error, fallback gradient shows
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
        
        {message && (
          <motion.p
            className={`mt-6 text-gray-400 ${textSize}`}
            animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
            transition={prefersReducedMotion ? {} : {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Cyber variant
  return (
    <div className={`flex flex-col items-center justify-center p-12 ${className}`} data-testid={testId}>
      <div className="relative">
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-cyan-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: spinnerSize, height: spinnerSize }}
        />
        
        {/* Pulsing inner circle */}
        <motion.div
          className="absolute inset-2 rounded-full bg-purple-500/20"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Center dot */}
        <div
          className="relative rounded-full bg-purple-500"
          style={{
            width: spinnerSize / 4,
            height: spinnerSize / 4,
            top: (spinnerSize * 3) / 8,
            left: (spinnerSize * 3) / 8,
          }}
        />
      </div>
      
      {message && (
        <motion.p
          className={`mt-6 text-gray-400 ${textSize}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
