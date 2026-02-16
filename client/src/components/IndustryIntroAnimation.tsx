import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Heart, Home, Sparkles, Scale, Car, Shield, UtensilsCrossed,
  Wrench, Users, TrendingUp, Dumbbell, ShoppingCart, Stethoscope,
  Hotel, Dog, GraduationCap, HardHat, Building2, Plane, Mic
} from "lucide-react";

const industries = [
  { Icon: Heart, color: "#ef4444", name: "Healthcare" },
  { Icon: Home, color: "#3b82f6", name: "Real Estate" },
  { Icon: Sparkles, color: "#ec4899", name: "Spa & Wellness" },
  { Icon: Scale, color: "#f59e0b", name: "Legal" },
  { Icon: Car, color: "#f97316", name: "Automotive" },
  { Icon: Shield, color: "#22c55e", name: "Insurance" },
  { Icon: UtensilsCrossed, color: "#f43f5e", name: "Restaurants" },
  { Icon: Wrench, color: "#64748b", name: "Home Services" },
  { Icon: Users, color: "#6366f1", name: "HR" },
  { Icon: TrendingUp, color: "#10b981", name: "Finance" },
  { Icon: Dumbbell, color: "#a855f7", name: "Fitness" },
  { Icon: ShoppingCart, color: "#06b6d4", name: "E-commerce" },
  { Icon: Stethoscope, color: "#14b8a6", name: "Dental" },
  { Icon: Hotel, color: "#a855f7", name: "Hotels" },
  { Icon: Dog, color: "#84cc16", name: "Veterinary" },
  { Icon: GraduationCap, color: "#0ea5e9", name: "Education" },
  { Icon: HardHat, color: "#eab308", name: "Construction" },
  { Icon: Building2, color: "#8b5cf6", name: "Property" },
  { Icon: Plane, color: "#f472b6", name: "Travel" },
];

interface IndustryIntroAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export default function IndustryIntroAnimation({ 
  onComplete, 
  duration = 3500 
}: IndustryIntroAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'icons' | 'text' | 'fadeout'>('icons');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('voicely_intro_seen');
    if (hasSeenIntro) {
      onComplete?.();
      return;
    }
    
    setVisible(true);
    
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        sessionStorage.setItem('voicely_intro_seen', 'true');
        setVisible(false);
        onComplete?.();
      }, 800);
      return () => clearTimeout(quickTimer);
    }

    const timer1 = setTimeout(() => setPhase('text'), 1200);
    const timer2 = setTimeout(() => setPhase('fadeout'), duration - 500);
    const timer3 = setTimeout(() => {
      sessionStorage.setItem('voicely_intro_seen', 'true');
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [duration, onComplete, prefersReducedMotion]);

  if (!visible) return null;

  if (prefersReducedMotion) {
    return (
      <div 
        className="fixed inset-0 z-[100] bg-[#050510] flex items-center justify-center"
        data-testid="industry-intro-animation"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mb-6">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            AI Voice Agents
          </h2>
          <p className="text-xl text-gray-300 mt-2">for Every Industry</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#050510] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          data-testid="industry-intro-animation"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px]" />
          </div>

          <div className="relative w-full max-w-4xl px-8">
            <div className="relative h-64 flex items-center justify-center">
              {industries.map((industry, index) => {
                const Icon = industry.Icon;
                const angle = (index / industries.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={index}
                    className="absolute"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ 
                      x: phase !== 'fadeout' ? x : 0,
                      y: phase !== 'fadeout' ? y : 0,
                      scale: phase === 'icons' ? 1 : phase === 'text' ? 0.8 : 0,
                      opacity: phase === 'fadeout' ? 0 : 1,
                    }}
                    transition={{ 
                      delay: index * 0.03,
                      duration: 0.6,
                      type: "spring",
                      bounce: 0.3,
                    }}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: `${industry.color}20`,
                        border: `1px solid ${industry.color}50`,
                        boxShadow: `0 0 20px ${industry.color}30`,
                      }}
                    >
                      <Icon 
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: industry.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
              
              <motion.div
                className="absolute z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: phase !== 'fadeout' ? 1 : 0.8,
                  opacity: phase === 'fadeout' ? 0 : 1,
                }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 30px rgba(139,92,246,0.4)",
                      "0 0 60px rgba(139,92,246,0.6)",
                      "0 0 30px rgba(139,92,246,0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === 'text' ? 1 : 0,
                y: phase === 'text' ? 0 : 20,
              }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  AI Voice Agents
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 font-medium">
                for Every Industry
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'text' ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
