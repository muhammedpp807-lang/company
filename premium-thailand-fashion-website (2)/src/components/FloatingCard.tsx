import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ============================================================
   FloatingCard — slowly levitating UI card that drifts subtly
   with the cursor. `depth` controls parallax strength.
   ============================================================ */

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // 0..1 cursor-follow strength
  duration?: number; // float cycle seconds
  delay?: number;
  rotate?: number; // max tilt degrees
}

const sharedListeners = new Set<(x: number, y: number) => void>();
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    sharedListeners.forEach((fn) => fn(x, y));
  });
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = "",
  depth = 0.5,
  duration = 7,
  delay = 0,
  rotate = 3,
}) => {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.6 });

  useEffect(() => {
    const fn = (x: number, y: number) => {
      mx.set(x * depth * 26);
      my.set(y * depth * 20);
    };
    sharedListeners.add(fn);
    return () => {
      sharedListeners.delete(fn);
    };
  }, [depth, mx, my]);

  const x = sx;
  const y = sy;
  const rot = useTransform(sx, (v) => v * rotate * 0.4);

  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} style={{ x, y, rotate: rot }}>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
