import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface SpeechBubbleAvatarProps {
  avatarUrl?: string;
  agentName: string;
  isSpeaking: boolean;
  isActive: boolean;
  size?: "sm" | "md" | "lg";
}

export function SpeechBubbleAvatar({
  avatarUrl,
  agentName,
  isSpeaking,
  isActive,
  size = "lg"
}: SpeechBubbleAvatarProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-56 h-56",
    lg: "w-72 h-72"
  };

  const ringSize = {
    sm: 140,
    md: 240,
    lg: 304
  };

  return (
    <div 
      className="relative flex items-center justify-center" 
      data-testid="speech-bubble-avatar"
      role="img"
      aria-label={`${agentName} avatar${isSpeaking ? ', currently speaking' : ''}${isActive ? ', call active' : ''}`}
    >
      {/* Animated gradient ring when speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: ringSize[size],
            height: ringSize[size],
            background: "linear-gradient(135deg, #8B5CF6, #06B6D4, #8B5CF6)",
            padding: "4px",
            filter: "blur(8px)"
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          aria-hidden="true"
        />
      )}

      {/* Pulsing glow when active */}
      {isActive && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: ringSize[size],
            height: ringSize[size],
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent)",
            filter: "blur(30px)"
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Main avatar with pulse animation when speaking */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl`}
        animate={isSpeaking ? {
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.05 }}
        style={{
          boxShadow: isActive 
            ? "0 0 60px rgba(139, 92, 246, 0.6), 0 0 120px rgba(139, 92, 246, 0.3)"
            : "0 0 30px rgba(139, 92, 246, 0.3)"
        }}
      >
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={avatarUrl} 
            alt={agentName}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white text-4xl">
            <Bot className="w-20 h-20" />
          </AvatarFallback>
        </Avatar>

        {/* Overlay gradient when speaking */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-purple-500/20"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
