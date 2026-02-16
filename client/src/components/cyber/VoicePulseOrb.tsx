import { motion } from "framer-motion";

interface VoicePulseOrbProps {
  isActive: boolean;
  isSpeaking: boolean;
  size?: "sm" | "md" | "lg";
  primaryColor?: string;
  secondaryColor?: string;
}

export function VoicePulseOrb({
  isActive,
  isSpeaking,
  size = "lg",
  primaryColor = "#8B5CF6",
  secondaryColor = "#06B6D4",
}: VoicePulseOrbProps) {
  const sizeMap = {
    sm: 120,
    md: 180,
    lg: 240,
  };

  const orbSize = sizeMap[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Energy rings - optimized with transform/opacity only */}
      {isActive && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute rounded-full border-2"
              style={{
                width: orbSize,
                height: orbSize,
                borderColor: i % 2 === 0 ? secondaryColor : primaryColor,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: isSpeaking ? 0.8 : 2.0,
                repeat: Infinity,
                delay: i * (isSpeaking ? 0.15 : 0.6),
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Main orb container */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: orbSize,
          height: orbSize,
        }}
        animate={
          isActive && isSpeaking
            ? { scale: [1, 1.05, 1] }
            : {}
        }
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Holographic base layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, 
                ${secondaryColor}50 0%, 
                ${primaryColor}30 30%,
                transparent 60%
              ),
              radial-gradient(circle at 70% 70%, 
                ${primaryColor}35 0%, 
                transparent 50%
              )
            `,
            boxShadow: `
              0 0 60px ${secondaryColor}40,
              0 0 90px ${primaryColor}30,
              inset 0 0 40px ${secondaryColor}15
            `,
          }}
        />

        {/* Static scanlines - no animation */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${secondaryColor}15 2px,
              ${secondaryColor}15 3px
            )`,
            opacity: 0.6,
          }}
        />

        {/* Static hexagonal grid - no animation */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(30deg, ${secondaryColor}20 8%, transparent 8.5%),
              linear-gradient(150deg, ${secondaryColor}20 8%, transparent 8.5%)
            `,
            backgroundSize: '40px 70px',
            backgroundPosition: '0 0, 20px 35px',
          }}
        />

        {/* Single rotating gradient - transform only */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent 0deg, 
              ${secondaryColor}50 90deg, 
              transparent 180deg, 
              ${primaryColor}50 270deg, 
              transparent 360deg
            )`,
            opacity: 0.4,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Pulsing glow when active - opacity only */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${secondaryColor}30, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Holographic core - scale and opacity only */}
        {isActive && (
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: '20%',
              background: `
                radial-gradient(circle,
                  rgba(255, 255, 255, 0.5) 0%,
                  ${secondaryColor}70 35%,
                  ${primaryColor}50 70%,
                  transparent 100%
                )
              `,
              filter: 'blur(10px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Intense center when speaking - scale and opacity only */}
        {isActive && isSpeaking && (
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: '28%',
              background: `
                radial-gradient(circle,
                  rgba(255, 255, 255, 0.8) 0%,
                  ${secondaryColor}80 40%,
                  ${primaryColor}60 80%,
                  transparent 100%
                )
              `,
              filter: "blur(15px)",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Edge ring */}
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: `${secondaryColor}60`,
            boxShadow: `
              0 0 20px ${secondaryColor}60,
              inset 0 0 15px ${secondaryColor}30
            `,
            opacity: isActive ? 0.8 : 0.5,
          }}
        />

        {/* Particle bursts when speaking - transform and opacity only */}
        {isActive && isSpeaking && (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? secondaryColor : primaryColor,
                  top: '50%',
                  left: '50%',
                  filter: 'blur(1px)',
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 4) * (orbSize / 2)],
                  y: [0, Math.sin((i * Math.PI) / 4) * (orbSize / 2)],
                  opacity: [0.8, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}

        {/* Atmospheric glow - optimized blur */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `
              0 0 80px ${secondaryColor}40,
              0 0 120px ${primaryColor}30
            `,
            filter: 'blur(30px)',
            opacity: isActive ? 0.7 : 0.3,
          }}
        />
      </motion.div>
    </div>
  );
}
