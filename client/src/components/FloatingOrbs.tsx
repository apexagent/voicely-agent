import { motion } from "framer-motion";
import orbImage from "@assets/generated_images/Purple_energy_orb_sphere_cb4f0d4a.png";

interface FloatingOrbsProps {
  count?: number;
}

export default function FloatingOrbs({ count = 3 }: FloatingOrbsProps) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 80 + Math.random() * 60,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.startX}%`,
            top: `${orb.startY}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        >
          <img
            src={orbImage}
            alt=""
            className="w-full h-full opacity-60"
            style={{
              filter: "blur(2px) drop-shadow(0 0 40px rgba(139,92,246,0.8))",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
