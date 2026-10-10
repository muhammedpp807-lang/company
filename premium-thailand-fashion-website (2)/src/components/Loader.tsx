import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DawnMark } from "./Logo";

/* ============================================================
   Loading experience — fast (~2s), then the site reveals.
   ============================================================ */

export const Loader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1600;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min((t - start) / DURATION, 1);
      // ease-out so it feels fast at the end
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 320);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-void text-paper noise"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading TOMSTILL"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid size-16 place-items-center rounded-2xl border border-paper/15 bg-paper/5"
      >
        <DawnMark size={30} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-6 text-3xl font-extrabold tracking-tight"
      >
        TOMSTILL<span className="text-clay">®</span>
      </motion.p>

      <div className="mt-10 flex w-56 items-center justify-between label-caps text-paper/50">
        <span>Loading</span>
        <span className="tabular-nums text-paper">{progress}%</span>
      </div>
      <div className="mt-3 h-px w-56 overflow-hidden bg-paper/15">
        <motion.div
          className="h-full bg-clay"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <p className="absolute bottom-8 label-caps text-paper/30">Tirupur · Est. 2026</p>
    </motion.div>
  );
};
