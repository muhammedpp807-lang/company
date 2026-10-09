import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/* ============================================================
   RevealImage — premium masked image reveal.
   A clip-path curtain opens as the element enters view, while
   the image itself scales 1.14 → 1 and drifts on parallax.
   GPU-friendly (clip-path + transform only).
   ============================================================ */

type Direction = "up" | "down" | "left" | "right" | "center";

const CLIP_FROM: Record<Direction, string> = {
  up: "inset(0% 0% 100% 0%)",
  down: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(50% 0% 50% 0%)",
};

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  direction?: Direction;
  parallax?: number; // 0 = none, 1 = strong
  duration?: number;
  priority?: boolean;
  glow?: boolean;
}

export const RevealImage: React.FC<RevealImageProps> = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  direction = "up",
  parallax = 0.6,
  duration = 1.25,
  priority = false,
  glow = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`${parallax * 10}%`, `-${parallax * 10}%`]
  );

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={
        reduce
          ? { clipPath: "inset(0% 0% 0% 0%)" }
          : { clipPath: CLIP_FROM[direction] }
      }
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ y }}
        initial={reduce ? false : { scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: duration + 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`size-full object-cover ${imgClassName}`}
      />
      {glow && (
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_60px_-20px_rgba(91,127,255,0.45)]" />
      )}
    </motion.div>
  );
};

/* ---------- accent curtain wipe (used for section dividers) ---------- */
export const CurtainReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative ${className}`}
      initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {!reduce && (
        <motion.span
          className="glow-rule pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
        />
      )}
      {children}
    </motion.div>
  );
};

/* ---------- character-by-character heading reveal ---------- */
export const CharReveal: React.FC<{
  text: string;
  className?: string;
  stagger?: number;
}> = ({ text, className = "", stagger = 0.025 }) => {
  const reduce = useReducedMotion();
  const chars = text.split("");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? {} : { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};
