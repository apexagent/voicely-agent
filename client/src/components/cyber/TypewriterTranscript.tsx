import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTranscriptProps {
  text: string;
  fadeDuration?: number;
  typingSpeed?: number;
}

export function TypewriterTranscript({ 
  text, 
  fadeDuration = 5000,
  typingSpeed = 50 
}: TypewriterTranscriptProps) {
  const [displayText, setDisplayText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();
  const cursorIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setDisplayText("");
    setShowCursor(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowCursor(false);

        if (fadeTimeoutRef.current) {
          clearTimeout(fadeTimeoutRef.current);
        }
        
        fadeTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, fadeDuration);
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [text, fadeDuration, typingSpeed]);

  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Accessible live region for screen readers - always present */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {text && `Agent says: ${text}`}
      </div>

      {/* Visual typewriter display */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto px-6 py-4"
            data-testid="typewriter-transcript"
            aria-hidden="true"
          >
            <div className="relative">
              {/* Optional semi-transparent backdrop */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg -z-10" />
              
              <p className="text-xl md:text-2xl font-medium text-white/90 text-center leading-relaxed px-6 py-3">
                {displayText}
                {showCursor && displayText.length < text.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-6 bg-purple-400 ml-1 align-middle"
                  />
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
