import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Scissors, Ruler, Leaf, Weight, Infinity as InfinityIcon, MapPin } from "lucide-react";
import { Wireframe } from "./Wireframe";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

/* ============================================================
   DESIGN PRINCIPLES — numbered editorial grid over a glowing
   wireframe structure. The signature "considered foundation"
   section, revealed on scroll.
   ============================================================ */

const PRINCIPLES = [
  {
    icon: Scissors,
    title: "Cut",
    text: "Every pattern is graded on real kids in six age bands — never shrunk from an adult block.",
  },
  {
    icon: Ruler,
    title: "Precision",
    text: "Seams, hems and cuffs are built to take a beating. Millimetres are the whole argument.",
  },
  {
    icon: Leaf,
    title: "Fabric",
    text: "Heavyweight cotton first, milled in the knitwear capital. Recycled only where performance demands it.",
  },
  {
    icon: Weight,
    title: "Weight",
    text: "240gsm on a tee, 480gsm on a hoodie. GSM is a design decision, not a spec sheet.",
  },
  {
    icon: InfinityIcon,
    title: "Hand-me-down",
    text: "If it won't survive one kid and still fit the next, it never leaves the table.",
  },
  {
    icon: MapPin,
    title: "Origin",
    text: "Cut, sewn and finished within 40 km of the studio — by partners we visit weekly.",
  },
];

export const Principles: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wireY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const wireR = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 0, reduce ? 0 : 35]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 noise md:py-36"
      aria-labelledby="principles-heading"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 size-[620px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-clay/[0.08] blur-[150px]" />

      {/* local wireframe structures that parallax with this section */}
      <motion.div
        style={{ y: wireY }}
        className="pointer-events-none absolute -left-28 top-10 hidden size-[440px] opacity-40 lg:block"
        aria-hidden="true"
      >
        <motion.div style={{ rotate: wireR }} className="size-full">
          <Wireframe shape="knot" size={440} spin={0.6} opacity={0.5} strokeWidth={0.85} />
        </motion.div>
      </motion.div>
      <motion.div
        style={{ y: wireY }}
        className="pointer-events-none absolute -right-32 bottom-6 hidden size-[400px] opacity-30 lg:block"
        aria-hidden="true"
      >
        <motion.div style={{ rotate: wireR }} className="size-full">
          <Wireframe shape="sphere" size={400} spin={-0.4} opacity={0.42} strokeWidth={0.85} />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        {/* header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <Reveal y={20}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-clay/70" />
                <p className="label-caps text-clay">02 / A considered foundation</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                id="principles-heading"
                className="mt-5 text-[clamp(2.4rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]"
              >
                Design{" "}
                <span className="relative inline-block neon-text">
                  principles.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-clay glow-soft"
                  />
                </span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <p className="max-w-md text-[15px] leading-relaxed text-paper/60">
              The ideas that guide our thinking — from the first line on the
              pattern to the final stitch. Six rules we don't break, however
              tempting the season.
            </p>
          </Reveal>
        </div>

        {/* numbered grid */}
        <StaggerGroup
          className="mt-16 grid grid-cols-1 overflow-hidden rounded-3xl border border-paper/10 bg-void/45 backdrop-blur-sm md:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {PRINCIPLES.map((p, i) => (
            <StaggerItem key={p.title} y={44}>
              <div className="group relative flex h-full flex-col border-paper/8 p-8 transition-colors duration-500 hover:bg-cream/60 md:p-10 [&:not(:last-child)]:border-b lg:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r">
                <span className="absolute right-6 top-6 text-[11px] font-bold tabular-nums tracking-[0.2em] text-paper/25 transition-colors duration-500 group-hover:text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute right-5 bottom-5 text-paper/25 transition-all duration-500 group-hover:rotate-90 group-hover:text-clay">
                  <Plus size={15} strokeWidth={2.4} />
                </span>

                <span className="grid size-12 place-items-center rounded-2xl border border-paper/12 bg-void/60 text-clay transition-all duration-500 group-hover:border-clay/50 group-hover:shadow-[0_0_28px_-4px_rgba(232,69,44,0.55)]">
                  <p.icon size={20} strokeWidth={1.7} />
                </span>

                <h3 className="mt-7 text-lg font-extrabold uppercase tracking-[0.06em]">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-[32ch] text-[13px] leading-relaxed text-paper/55">{p.text}</p>

                <span className="glow-rule mt-8 h-px w-0 opacity-0 transition-all duration-700 group-hover:w-full group-hover:opacity-100" />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};
