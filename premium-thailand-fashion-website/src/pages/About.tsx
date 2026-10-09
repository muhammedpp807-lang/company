import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Recycle, HandHeart, MapPin } from "lucide-react";
import { useRouter } from "../lib/router";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { RevealImage, CharReveal, CurtainReveal } from "../components/RevealImage";
import { FloatingCard } from "../components/FloatingCard";
import { Marquee } from "../components/Marquee";
import { Wireframe } from "../components/Wireframe";

const TIMELINE = [
  {
    year: "2024",
    title: "The question",
    text: "Two friends in a Bangkok apartment start re-cutting deadstock shirting on weekends — just to see if better basics could exist here.",
  },
  {
    year: "2025",
    title: "The studio",
    text: "A room in Sukhumvit becomes a studio. First patterns, first samples, first 200 customers found entirely by word of mouth.",
  },
  {
    year: "2026",
    title: "First Light",
    text: "ARUN launches Vol. 01 — eighteen considered pieces, natural fabrics, small batches. The dawn mark is drawn and never changes again.",
  },
  {
    year: "Next",
    title: "The horizon",
    text: "A flagship space in Bangkok, a repair programme, and a promise kept: nothing made that we wouldn't wear a hundred times.",
  },
];

const PILLARS = [
  {
    icon: Recycle,
    title: "Natural first",
    text: "Cotton, linen, wool — fibres that breathe in the tropics and age with grace. Recycled synthetics only where performance demands it.",
  },
  {
    icon: HandHeart,
    title: "Small batch",
    text: "Runs of 60–120 pieces. When a size sells out, it's gone — we'd rather run out than overmake.",
  },
  {
    icon: MapPin,
    title: "Made in Thailand",
    text: "Cut, sewn and finished within 40 km of our studio, by partners we visit every week.",
  },
];

export const About: React.FC = () => {
  const { navigate } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  return (
    <div className="pt-24 md:pt-32">
      {/* ---------- hero ---------- */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal y={18}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-clay/70" />
              <p className="label-caps text-clay">The House</p>
            </div>
          </Reveal>
          <h1 className="mt-5 text-[clamp(2.8rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]">
            <CharReveal text="Born at" />
            <br />
            <span className="text-clay">
              <CharReveal text="dawn. Bangkok." stagger={0.02} />
            </span>
          </h1>
        </div>

        <div className="relative mt-14">
          <motion.div
            style={{ y, scale }}
            className="relative h-[52vh] overflow-hidden border-y border-paper/10 md:h-[68vh]"
          >
            <RevealImage
              src="/images/about-hero.jpg"
              alt="The ARUN atelier in Bangkok — fabric rolls, garment racks and morning light"
              className="size-full"
              direction="up"
              parallax={0.3}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/45 to-transparent" />
          </motion.div>
          <FloatingCard depth={0.7} className="absolute -bottom-6 left-5 md:left-16" duration={7}>
            <div className="rounded-2xl border border-paper/12 bg-void/95 p-5 shadow-2xl backdrop-blur-xl">
              <p className="label-caps text-[8px] text-clay">The Studio</p>
              <p className="mt-1 text-sm font-extrabold uppercase">Sukhumvit 31, Bangkok</p>
              <p className="text-[10px] text-paper/50">Cut & sewn within 40 km of this room</p>
            </div>
          </FloatingCard>
        </div>
      </section>

      <div className="h-16 md:h-24" />

      {/* ---------- story ---------- */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal y={18}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-clay/70" />
                <p className="label-caps text-clay">Why ARUN exists</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
                <CharReveal text="Clothes worth" />
                <br />
                <span className="text-clay">
                  <CharReveal text="keeping." stagger={0.02} />
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-lg font-semibold leading-relaxed text-paper/80">
                Fast fashion taught us to buy more and love less. ARUN is our
                answer — a small house making the pieces you reach for without
                thinking, then keep for years.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">
                Our name is Thai for <em>dawn</em> — the hour this city is most
                itself, before the heat and the noise. That's the standard we cut
                to: quiet, exact, warmer than expected. Every pattern is drawn in
                our Sukhumvit studio, graded on real bodies, and produced in
                small runs by family-run workshops we know by name.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">
                We are not a drop factory. We release one volume at a time, let
                it live, and listen before the next. It's slower. It's supposed
                to be.
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="space-y-4">
            {PILLARS.map((p) => (
              <StaggerItem key={p.title}>
                <div className="group rounded-3xl border border-paper/10 bg-cream/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_20px_60px_rgba(91,127,255,0.18)]">
                  <span className="grid size-12 place-items-center rounded-2xl border border-paper/12 bg-clay/15 text-clay transition-colors duration-300 group-hover:bg-clay group-hover:text-white">
                    <p.icon size={20} />
                  </span>
                  <p className="mt-5 text-base font-extrabold uppercase tracking-wide">{p.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/55">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <div className="my-24 md:my-36">
        <Marquee items={["Natural Fabrics", "Small Batch", "Made in Thailand", "Fair Workshops", "Repair Over Replace"]} />
      </div>

      {/* ---------- timeline ---------- */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <Reveal y={18}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-clay/70" />
            <p className="label-caps text-clay">The road so far</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            A short <span className="text-clay">history.</span>
          </h2>
        </Reveal>

        <CurtainReveal className="mt-14">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 md:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1} className="bg-void">
                <div className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-cream">
                  <p className="text-4xl font-extrabold tracking-tight text-clay/90">{t.year}</p>
                  <p className="mt-3 text-sm font-extrabold uppercase tracking-wide">{t.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/55">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </CurtainReveal>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <div className="relative overflow-hidden rounded-[32px] bg-void px-8 py-20 text-center text-paper noise md:py-28">
          <div className="pointer-events-none absolute -right-24 top-0 size-[400px] opacity-25">
            <motion.div
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="size-full"
            >
              <Wireframe shape="torus" size={400} spin={0.4} opacity={0.5} strokeWidth={0.9} />
            </motion.div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-0 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/20 blur-[120px]" />
          <Reveal>
            <p className="label-caps text-paper/50">Join us</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
              <CharReveal text="Wear your dawn." />
            </h2>
            <button
              onClick={() => navigate({ name: "shop" })}
              className="group mx-auto mt-9 inline-flex items-center gap-3 rounded-full bg-clay px-9 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.03] glow-strong"
            >
              Shop Vol. 01
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
