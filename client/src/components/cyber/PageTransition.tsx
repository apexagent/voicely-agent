import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
  mode?: "fade" | "slide" | "scale" | "cyber";
}

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3 },
  },
  cyber: {
    initial: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
    },
    exit: { 
      opacity: 0, 
      y: -10,
      filter: "blur(2px)",
    },
    transition: { 
      duration: 0.15,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Page transition wrapper with multiple animation modes
 * Part of 10/10 elite component library - wrap pages for smooth transitions
 */
export function PageTransition({ children, mode = "cyber" }: PageTransitionProps) {
  const [location] = useLocation();
  const config = transitions[mode];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={config.initial}
        animate={config.animate}
        exit={config.exit}
        transition={config.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
