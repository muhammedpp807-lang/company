import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { looks } from "../data/catalog";
import { useRouter } from "../lib/router";
import { Reveal } from "../components/Reveal";
import { Marquee } from "../components/Marquee";
import { Wireframe } from "../components/Wireframe";
import { RevealImage, CurtainReveal } from "../components/RevealImage";
import { FloatingCard } from "../components/FloatingCard";

/* One editorial look — alternating layout, parallax image, meta panel.
   Every other look overlaps its neighbour for a portfolio feel. */
const LookItem: React.FC<{ look: (typeof looks)[number]; index: number }> = ({ look, index }) => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -55, reduce ? 0 : 55]);
  const flipped = index % 2 === 1;

  /* alternate the reveal direction so the page never feels repetitive */
  const dirs = ["up", "left", "right", "down"] as const;
  const dir = dirs[index % dirs.length];

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 items-center gap-8 md:gap-14 lg:grid-cols-2 ${
        index > 0 ? "mt-24 md:mt-40" : ""
      }`}
    >
      {/* image */}
      <div className={`relative ${flipped ? "lg:order-2" : ""}`}>
        <Reveal>
          <div
            className="group relative overflow-hidden rounded-[28px] border border-paper/10"
            data-cursor="VIEW"
            onClick={() => navigate({ name: "shop" })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate({ name: "shop" })}
            aria-label={`Shop the pieces from ${look.id} — ${look.title}`}
          >
            <motion.div style={{ y }} className="will-change-transform">
              <RevealImage
                src={look.image}
                alt={`${look.id} — ${look.title}: ${look.subtitle}`}
                className={`aspect-[4/5] w-full lg:aspect-[5/6] ${flipped ? "lg:aspect-[4/5]" : ""}`}
                direction={dir}
                parallax={0.2}
                glow
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
            <span className="text-outline-paper absolute left-6 top-5 text-5xl font-extrabold md:text-6xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="absolute right-5 top-5 text-paper/40 transition-all duration-500 group-hover:rotate-90 group-hover:text-clay">
              <Plus size={18} strokeWidth={2.4} />
            </span>
            <span className="absolute bottom-5 right-5 grid size-12 place-items-center rounded-full bg-clay/80 opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100">
              <ArrowUpRight size={18} className="text-white" />
            </span>
          </div>
        </Reveal>

        {/* floating label — only on alternating looks, desktop */}
        {index % 2 === 1 && (
          <FloatingCard depth={0.7} duration={7.5} className="absolute -left-4 top-10 hidden lg:block">
            <div className="rounded-full border border-paper/12 bg-void/90 px-4 py-2 backdrop-blur-xl">
              <span className="label-caps text-[8px]">{look.mood.split(" · ")[0]}</span>
            </div>
          </FloatingCard>
        )}
      </div>

      {/* meta */}
      <div className={`${flipped ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
        <Reveal delay={0.1}>
          <p className="label-caps text-clay">{look.id}</p>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-6xl">
            {look.title}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper/60">{look.subtitle}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-6 flex flex-wrap gap-2">
            {look.pieces.map((p) => (
              <span
                key={p}
                className="rounded-full border border-paper/15 bg-cream/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-paper/70"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-paper/40">{look.mood}</p>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="group mt-7 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
          >
            Shop this look
            <span className="grid size-9 place-items-center rounded-full border border-paper/25 transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-white">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
        </Reveal>
      </div>
    </div>
  );
};

export const Lookbook: React.FC = () => (
  <div className="pt-24 md:pt-32">
    {/* header */}
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <Reveal y={18}>
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-clay/70" />
          <p className="label-caps text-clay">Vol. 01 — First Light</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,7.5vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]">
          The <span className="text-clay">Lookbook.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">
          Eight studies in movement — shot between Bangkok studios, concrete and
          early light. Every look is shoppable.
        </p>
      </Reveal>
    </div>

    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 md:px-10 md:pt-24">
      {looks.map((look, i) => (
        <LookItem key={look.id} look={look} index={i} />
      ))}
    </div>

    <Marquee
      dark
      slow
      items={["First Light", "Hard Shadows", "Soft Focus", "Golden Hour", "Uniform", "Night Shift"]}
    />

    {/* closing statement over a wireframe */}
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-28 top-0 size-[440px] opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="size-full"
        >
          <Wireframe shape="orbit" size={440} spin={0.3} opacity={0.5} strokeWidth={0.9} />
        </motion.div>
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10 md:py-36">
        <CurtainReveal>
          <p className="label-caps text-paper/50">End of volume</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
            Next volume drops at dawn — <span className="text-clay">stay close.</span>
          </h2>
        </CurtainReveal>
      </div>
    </div>
  </div>
);
