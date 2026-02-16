import { Variants, Transition } from "framer-motion";

/**
 * Shared motion primitives for consistent animations across the platform
 * Part of 10/10 elite component library
 */

// ============================================================================
// HOVER PARALLAX
// ============================================================================

/**
 * 3D hover parallax effect for cards and interactive elements
 * Usage:
 * ```tsx
 * <motion.div
 *   onMouseMove={createHoverParallax(setRotate)}
 *   onMouseLeave={resetHoverParallax(setRotate)}
 *   style={{ ...parallaxStyle(rotateX, rotateY) }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export const createHoverParallax = (
  setRotate: (value: { x: number; y: number }) => void,
  intensity: number = 10
) => {
  return (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * intensity;
    const rotateY = ((centerX - x) / centerX) * intensity;
    setRotate({ x: rotateX, y: rotateY });
  };
};

export const resetHoverParallax = (
  setRotate: (value: { x: number; y: number }) => void
) => {
  return () => setRotate({ x: 0, y: 0 });
};

export const parallaxStyle = (rotateX: number, rotateY: number) => ({
  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
  transition: "transform 0.1s ease-out",
});

// ============================================================================
// CHART REVEAL ANIMATIONS
// ============================================================================

/**
 * Chart reveal animation variants for Recharts components
 * Usage:
 * ```tsx
 * <motion.div variants={chartRevealContainer} initial="hidden" animate="visible">
 *   <AreaChart ... />
 * </motion.div>
 * ```
 */
export const chartRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const chartRevealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Staggered bar reveal for bar charts
 */
export const barRevealVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (index: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

/**
 * Line draw animation for line charts
 */
export const lineDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Reusable page transition variants
 */
export const pageTransitions = {
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
    initial: { opacity: 0, y: 20, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, filter: "blur(4px)" },
    transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

/**
 * Stagger container for list animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

/**
 * Common entrance animations for components
 */
export const entranceAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

/**
 * Common hover animation configurations
 */
export const hoverEffects = {
  lift: {
    whileHover: { y: -4, transition: { duration: 0.2 } },
  },
  scale: {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  },
  glow: {
    whileHover: {
      boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
      transition: { duration: 0.2 },
    },
  },
  rotate: {
    whileHover: { rotate: 5, transition: { duration: 0.2 } },
  },
};

// ============================================================================
// SPRING CONFIGS
// ============================================================================

/**
 * Pre-configured spring transitions
 */
export const springConfigs = {
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 15,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },
  wobbly: {
    type: "spring" as const,
    stiffness: 180,
    damping: 12,
  },
};

// ============================================================================
// EASING CURVES
// ============================================================================

/**
 * Custom easing curves for smooth animations
 */
export const easingCurves = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  snappy: [0.34, 1.56, 0.64, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

export default {
  createHoverParallax,
  resetHoverParallax,
  parallaxStyle,
  chartRevealContainer,
  chartRevealItem,
  barRevealVariants,
  lineDrawVariants,
  pageTransitions,
  staggerContainer,
  staggerItem,
  entranceAnimations,
  hoverEffects,
  springConfigs,
  easingCurves,
};
