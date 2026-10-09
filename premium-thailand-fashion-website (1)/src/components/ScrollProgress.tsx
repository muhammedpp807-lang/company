import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/* ============================================================
   ScrollProgress — minimal luminous rail at the very top.
   ============================================================ */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const sparkLeft = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const sparkX = useTransform(sparkLeft, (v) => `${v * 100}%`);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-gradient-to-r from-clay-deep via-clay to-clay/40"
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {/* travelling spark riding the rail */}
      <motion.div
        style={{ left: sparkX }}
        className="pointer-events-none fixed top-0 z-[131] h-[2px] w-16 -translate-x-1/2 bg-clay/60 blur-[3px]"
        aria-hidden="true"
      />
    </>
  );
};

/* ============================================================
   BackToTop — appears once the visitor is well into the page.
   ============================================================ */
export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          className="group fixed bottom-6 right-5 z-[150] grid size-12 place-items-center rounded-full border border-paper/15 bg-void/80 text-paper backdrop-blur-xl transition-colors hover:border-clay hover:bg-clay hover:text-white md:bottom-8 md:right-8"
          aria-label="Back to top"
        >
          <ArrowUp size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_30px_-4px_rgba(91,127,255,0.8)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
