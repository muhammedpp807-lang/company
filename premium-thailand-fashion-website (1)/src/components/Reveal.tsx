import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ============================================================
   Scroll-reveal primitives — GPU-friendly opacity/transform
   ============================================================ */

const easeOut = [0.22, 1, 0.36, 1] as const;

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}> = ({ children, delay = 0, y = 48, className, once = true }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
};

/** Container that staggers its <StaggerItem> children */
export const StaggerGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}> = ({ children, className, stagger = 0.09 }) => {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  y?: number;
}> = ({ children, className, y = 56 }) => {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: reduce ? {} : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: easeOut },
    },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
};

/** Per-word reveal for large typography */
export const WordReveal: React.FC<{
  words: string[];
  className?: string;
  wordClassName?: string;
  stagger?: number;
  delay?: number;
}> = ({ words, className, wordClassName = "", stagger = 0.14, delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-18% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={words.join(" ")}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: reduce ? {} : { y: "115%", rotate: 4 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1, ease: easeOut },
              },
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

/** Section heading with kicker + rule */
export const SectionHeading: React.FC<{
  kicker: string;
  title: React.ReactNode;
  dark?: boolean;
  className?: string;
}> = ({ kicker, title, dark, className = "" }) => (
  <div className={className}>
    <Reveal>
      <div className="flex items-center gap-3">
        <span className={`h-px w-10 ${dark ? "bg-paper/40" : "bg-ink/30"}`} />
        <span className={`label-caps ${dark ? "text-paper/60" : "text-ink/60"}`}>{kicker}</span>
      </div>
    </Reveal>
    <Reveal delay={0.08}>
      <h2
        className={`mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </Reveal>
  </div>
);
