import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { 
  Building2, Heart, Home, Utensils, Scale, Scissors, Car, 
  Plane, GraduationCap, Stethoscope, Hotel, Dog, Mic
} from "lucide-react";
import { VOICELY_LOGO_URL } from "@/lib/constants";

interface IndustryLoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const industryIcons = [
  { Icon: Heart, color: "#8b5cf6" },
  { Icon: Home, color: "#06b6d4" },
  { Icon: Utensils, color: "#8b5cf6" },
  { Icon: Scale, color: "#06b6d4" },
  { Icon: Scissors, color: "#8b5cf6" },
  { Icon: Car, color: "#06b6d4" },
  { Icon: Plane, color: "#8b5cf6" },
  { Icon: Building2, color: "#06b6d4" },
];

export function IndustryLoadingAnimation({
  className = "",
  size = "lg",
  showText = true,
}: IndustryLoadingAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeConfig = {
    sm: { orbit: 60, icon: 14, center: 28, text: "text-sm" },
    md: { orbit: 80, icon: 16, center: 36, text: "text-base" },
    lg: { orbit: 100, icon: 18, center: 44, text: "text-lg" },
  };

  const config = sizeConfig[size];
  const containerSize = config.orbit * 2 + config.icon * 2 + 20;

  const iconPositions = useMemo(() => 
    industryIcons.map((_, index) => {
      const angle = (index / industryIcons.length) * 2 * Math.PI;
      return {
        x: Math.cos(angle) * config.orbit,
        y: Math.sin(angle) * config.orbit,
      };
    }), [config.orbit]
  );

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`} data-testid="industry-loading-animation">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
          <Mic className="w-8 h-8 text-white" />
        </div>
        {showText && (
          <div className={`mt-4 text-center ${config.text}`}>
            <p className="text-white font-bold mb-1">Loading...</p>
            <p className="text-gray-400 text-sm">Agents for every industry</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      data-testid="industry-loading-animation"
    >
      <div className="relative" style={{ width: containerSize, height: containerSize }}>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {industryIcons.map((industry, index) => {
            const { Icon, color } = industry;
            const pos = iconPositions[index];
            return (
              <div
                key={index}
                className="absolute rounded-full p-1.5"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}40`,
                }}
              >
                <Icon size={config.icon} style={{ color }} />
              </div>
            );
          })}
        </motion.div>

        <div
          className="absolute flex items-center justify-center"
          style={{ width: config.center + 12, height: config.center + 12, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)",
              padding: "2px",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div
            className="rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center"
            style={{ width: config.center, height: config.center }}
          >
            <Mic className="w-1/2 h-1/2 text-white" />
          </div>
        </div>
      </div>

      {showText && (
        <div className={`mt-6 text-center ${config.text}`}>
          <p className="text-white font-bold mb-1">Building Your AI Workforce</p>
          <p className="text-gray-400 text-sm">Agents for every industry</p>
        </div>
      )}
    </div>
  );
}
