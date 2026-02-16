import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SubtitleDisplayProps {
  text: string;
  duration?: number;
  className?: string;
}

export function SubtitleDisplay({
  text,
  duration = 5000,
  className = "",
}: SubtitleDisplayProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [text, duration]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className={`max-w-3xl mx-auto px-6 py-4 ${className}`}
        >
          <p
            className="text-center text-lg md:text-xl font-medium text-white/90 leading-relaxed"
            style={{
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
