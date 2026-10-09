import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ============================================================
   Cursor — premium desktop-only cursor.
   • trailing dot + ring
   • ring expands over interactive elements
   • contextual label from [data-cursor="VIEW"]
   Disabled on touch / coarse pointers.
   ============================================================ */

export const Cursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const ringX = useSpring(mx, { stiffness: 300, damping: 26, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 300, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(labelled ? labelled.dataset.cursor || null : null);
      setHovering(
        !!t.closest?.("a, button, [role='button'], input, select, textarea, label, [data-hover]")
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [mx, my]);

  if (!enabled) return null;

  const labelled = !!label;

  return (
    <>
      {/* crisp dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[240] size-1.5 rounded-full bg-clay"
        style={{ x: mx, y: my, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 2.6 : 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* ring / label */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[239] flex items-center justify-center rounded-full border backdrop-blur-[2px]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: labelled ? 78 : hovering ? 50 : 32,
          height: labelled ? 78 : hovering ? 50 : 32,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor: labelled ? "rgba(91,127,255,0.95)" : "rgba(242,245,251,0.03)",
          borderColor: labelled ? "rgba(91,127,255,0)" : "rgba(242,245,251,0.28)",
          boxShadow: labelled ? "0 0 34px rgba(91,127,255,0.6)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="label-caps text-[9px] text-white"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
