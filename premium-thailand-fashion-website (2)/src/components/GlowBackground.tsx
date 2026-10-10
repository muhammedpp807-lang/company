import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   Ambient glow layer — drifting light blobs and a slow scan
   line. Sits behind the scroll-driven wireframe backdrop.
   (Grid + vignette now live in ScrollBackdrop.)
   ============================================================ */

export const GlowBackground: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* drifting glow blobs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-40 top-[-10%] size-[46rem] rounded-full bg-clay/[0.10] blur-[160px]"
            animate={{ x: [0, 70, 0], y: [0, 50, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-15%] top-[35%] size-[38rem] rounded-full bg-clay-deep/[0.09] blur-[150px]"
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute bottom-[-10%] left-[30%] size-[34rem] rounded-full bg-clay/[0.07] blur-[140px]"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
        </>
      )}

      {/* scan line */}
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-transparent via-clay/[0.05] to-transparent"
          animate={{ y: ["-20vh", "110vh"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
};
