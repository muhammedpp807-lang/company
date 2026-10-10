import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Reveal } from "./Reveal";

/* ============================================================
   STUDIO CHRONICLE — horizontal card row that advances with
   vertical scroll. Each card is a chapter of the house.
   ============================================================ */

const ENTRIES = [
  {
    year: "2021 — 2023",
    title: "Prototype",
    place: "Tirupur, one rack",
    detail: "Handmade kids' tees at a Sunday market, 40 pieces at a time.",
  },
  {
    year: "2025 — 2026",
    title: "First Studio",
    place: "Avinashi Road, Tirupur",
    detail: "Patterns, samples, and the first 200 customers by word of mouth.",
  },
  {
    year: "2026",
    title: "Vol. 01 — Stock The Street",
    place: "TOMSTILL Kids & Boys",
    detail: "Eighteen streetwear pieces launch across all three doors.",
  },
  {
    year: "Next",
    title: "The Horizon",
    place: "Tirupur · Flagship",
    detail: "More doors, a repair programme, and slower releases.",
  },
];

export const Chronicle: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-38%"]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* Mobile: native swipe */
  if (reduce) {
    return (
      <section className="py-20">
        <div className="px-5">
          <Reveal>
            <p className="label-caps text-clay">01 / The house so far</p>
            <h2 className="mt-4 text-4xl font-extrabold uppercase tracking-tight">Studio chronicle.</h2>
          </Reveal>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5">
          {ENTRIES.map((e) => (
            <div key={e.title} className="relative w-[78vw] shrink-0 snap-center rounded-3xl border border-paper/10 bg-void/50 p-7 backdrop-blur-sm">
              <span className="absolute right-5 top-5 text-paper/30">
                <Plus size={16} strokeWidth={2.4} />
              </span>
              <p className="label-caps text-clay">{e.year}</p>
              <p className="mt-4 text-xl font-extrabold uppercase">{e.title}</p>
              <p className="mt-1 text-[13px] text-paper/50">{e.place}</p>
              <p className="mt-4 text-[13px] leading-relaxed text-paper/60">{e.detail}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="Studio chronicle">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-12 w-full max-w-[1440px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal y={18}>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-clay/70" />
                  <p className="label-caps text-clay">01 / The house so far</p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold uppercase leading-none tracking-tight">
                  Studio chronicle.
                </h2>
              </Reveal>
            </div>
            <div className="flex items-center gap-4">
              <span className="label-caps text-paper/35">Scroll</span>
              <div className="h-px w-28 overflow-hidden bg-paper/12">
                <motion.div className="h-full origin-left bg-clay" style={{ scaleX: bar }} />
              </div>
            </div>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-6 px-5 md:px-10">
          {ENTRIES.map((e, i) => (
            <article
              key={e.title}
              className="group relative flex h-[46vh] w-[78vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-paper/10 bg-void/55 p-8 backdrop-blur-sm transition-all duration-500 hover:border-clay/40 hover:bg-void/75 hover:shadow-[0_20px_70px_-30px_rgba(91,127,255,0.6)] md:w-[34vw] md:p-10"
              data-cursor="VIEW"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-clay/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* corner marker */}
              <span className="absolute right-6 top-6 text-paper/30 transition-all duration-500 group-hover:rotate-90 group-hover:text-clay">
                <Plus size={17} strokeWidth={2.4} />
              </span>

              <div className="relative">
                <span className="text-[11px] font-bold tabular-nums tracking-[0.2em] text-clay">
                  0{i + 1}
                </span>
                <p className="mt-5 label-caps text-paper/45">{e.year}</p>
                <h3 className="mt-3 max-w-[16ch] text-2xl font-extrabold uppercase leading-tight tracking-tight md:text-3xl">
                  {e.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-paper/45">{e.place}</p>
              </div>

              <div className="relative">
                <p className="max-w-[30ch] text-[13px] leading-relaxed text-paper/60">{e.detail}</p>
                <span className="mt-6 grid size-11 place-items-center rounded-full border border-paper/15 text-paper/70 transition-all duration-500 group-hover:rotate-45 group-hover:border-clay group-hover:bg-clay group-hover:text-white">
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
