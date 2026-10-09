import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, PenTool, BadgeCheck, Feather, Fingerprint } from "lucide-react";
import { useStore } from "../lib/store";
import { useRouter } from "../lib/router";
import { ProductCard } from "../components/ProductCard";
import { FloatingCard } from "../components/FloatingCard";
import { Marquee } from "../components/Marquee";
import { Principles } from "../components/Principles";
import { Chronicle } from "../components/Chronicle";
import { Reveal, StaggerGroup, StaggerItem, SectionHeading } from "../components/Reveal";
import { Wireframe } from "../components/Wireframe";
import { RevealImage, CharReveal } from "../components/RevealImage";
import { DawnMark } from "../components/Logo";
import { formatTHB, CATEGORIES } from "../data/catalog";

/* ---------- helpers ---------- */
const img = (id: number, w = 900, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const useIsDesktop = () => {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setIs(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return is;
};

/* sequenced hero entrance — brand → headline → text → CTA → image */
const rise: Variants = {
  hidden: { opacity: 0, y: 46 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ============================================================
   HERO — sequenced entrance, then a scroll-driven
   transformation: image scales down, text lifts and fades,
   backdrop parallaxes. Nothing is removed abruptly.
   ============================================================ */
const Hero: React.FC = () => {
  const { content, products } = useStore();
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.84]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-38%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.5]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-70%"]);

  const drop = products.find((p) => p.featured) ?? products[0];

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-28 md:pt-32 noise">
      {/* parallaxing backdrop */}
      <motion.div style={{ scale: glowScale }} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-24 size-[480px] rounded-full bg-clay/12 blur-[140px]" />
        <div className="absolute right-1/4 top-1/2 size-[380px] rounded-full bg-clay-deep/10 blur-[120px]" />
      </motion.div>

      {/* decorative wireframe that parallaxes with the hero */}
      <motion.div
        style={{ y: imgY }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/4 hidden size-[440px] opacity-25 lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="size-full"
        >
          <Wireframe shape="torus" size={440} spin={0.5} opacity={0.5} strokeWidth={0.8} />
        </motion.div>
      </motion.div>

      {/* ghost wordmark */}
      <motion.p
        style={{ opacity: textOpacity, y: textY }}
        aria-hidden="true"
        className="text-outline pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[19vw] font-extrabold leading-none tracking-[0.02em]"
      >
        TOMSTILL
      </motion.p>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 md:grid-cols-[1.15fr_1fr] md:gap-6 md:px-10">
        {/* ---------- typography ---------- */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 order-2 md:order-1">
          <motion.div custom={0} variants={rise} initial="hidden" animate="show">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-clay glow-dot" />
              </span>
              <p className="label-caps text-paper/60">{content.heroKicker}</p>
            </div>
          </motion.div>

          <h1 className="mt-6 text-[clamp(3.6rem,9.5vw,8.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
            <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
              {content.heroTitleA}
            </motion.span>
            <motion.span
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="block text-clay"
            >
              {content.heroTitleB}
            </motion.span>
          </h1>

          <motion.div custom={3} variants={rise} initial="hidden" animate="show">
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-paper/65 md:text-base">
              {content.heroStatement}
            </p>
          </motion.div>

          <motion.div custom={4} variants={rise} initial="hidden" animate="show">
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate({ name: "shop" })}
                className="group inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-clay-deep hover:shadow-[0_12px_44px_rgba(91,127,255,0.55)]"
              >
                Shop Collection
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => navigate({ name: "lookbook" })}
                className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:border-clay hover:bg-clay hover:text-white hover:shadow-[0_12px_44px_rgba(91,127,255,0.4)]"
              >
                Explore Lookbook
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>

          <motion.div custom={5} variants={rise} initial="hidden" animate="show">
            <div className="mt-12 flex items-center gap-8 label-caps text-paper/45">
              <span>Vol. 01 — First Light</span>
              <span className="h-px w-8 bg-paper/20" />
              <span>Bangkok · Worldwide</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- imagery + floating cards ---------- */}
        <div className="relative order-1 md:order-2">
          <motion.div
            style={{ scale: imgScale, y: imgY }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-[28px] border border-paper/10 shadow-[0_40px_90px_rgba(4,5,10,0.7)]"
            data-cursor="VIEW"
          >
            <img
              src="/images/hero-main.jpg"
              alt="TOMSTILL Vol. 01 campaign — oversized ecru tee and charcoal wide trousers in dawn light"
              className="size-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/35 via-transparent to-transparent" />
          </motion.div>

          {/* floating product card */}
          <motion.div style={{ y: cardY }} className="absolute -right-3 top-8 z-10 md:-right-8">
            <FloatingCard depth={0.9} duration={6.5} delay={0.9}>
              <button
                onClick={() => drop && navigate({ name: "product", slug: drop.slug })}
                className="group w-44 overflow-hidden rounded-2xl border border-paper/12 bg-cream/90 p-3 text-left shadow-[0_24px_60px_rgba(4,5,10,0.7)] backdrop-blur-xl transition-colors hover:border-clay/50 md:w-52"
                data-cursor="VIEW"
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-[8px] text-clay">New Drop</span>
                  <ArrowUpRight size={13} className="text-paper/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <div className="mt-2.5 aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={drop?.images[0]}
                    alt={drop?.name}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2.5 text-[11px] font-extrabold uppercase tracking-wide">{drop?.name}</p>
                <p className="text-[10px] font-bold tabular-nums text-paper/55">{drop && formatTHB(drop.price)}</p>
              </button>
            </FloatingCard>
          </motion.div>

          {/* numbered collection card */}
          <motion.div style={{ y: cardY }} className="absolute -left-2 bottom-16 z-10 md:-left-10">
            <FloatingCard depth={0.5} duration={8} delay={1.25}>
              <div className="rounded-2xl border border-paper/12 bg-void p-4 text-paper shadow-[0_24px_60px_rgba(4,5,10,0.8)]">
                <p className="text-3xl font-extrabold tracking-tight text-clay">01</p>
                <p className="label-caps mt-1 text-[8px] text-paper/60">New Collection</p>
                <div className="mt-2.5 h-px w-full bg-paper/15">
                  <motion.div
                    className="h-full bg-clay"
                    animate={{ width: ["20%", "90%", "20%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </FloatingCard>
          </motion.div>

          {/* limited badge */}
          <motion.div style={{ y: cardY }} className="absolute -left-1 top-4 z-10 md:left-2">
            <FloatingCard depth={1.2} duration={5.5} delay={1.5} rotate={6}>
              <div className="flex items-center gap-2.5 rounded-full border border-paper/12 bg-cream/90 py-2 pl-2.5 pr-4 shadow-lg backdrop-blur-xl">
                <span className="grid size-7 place-items-center rounded-full bg-clay/15">
                  <DawnMark size={14} />
                </span>
                <span className="label-caps text-[8px]">Limited Drop</span>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        aria-hidden="true"
      >
        <span className="label-caps text-[8px] text-paper/40">Scroll</span>
        <div className="h-8 w-px overflow-hidden bg-paper/15">
          <motion.div
            className="h-3 w-px bg-clay"
            animate={{ y: [-12, 32] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================================
   NEW ARRIVALS — editorial, asymmetric composition.
   One large piece, then smaller, then large — never a flat grid.
   ============================================================ */
const NewArrivals: React.FC = () => {
  const { products } = useStore();
  const { navigate } = useRouter();
  const items = products.filter((p) => p.newArrival).slice(0, 4);

  /* asymmetric column spans + vertical offsets */
  const layout = [
    "lg:col-span-7",
    "lg:col-span-5 lg:mt-28",
    "lg:col-span-5",
    "lg:col-span-7 lg:mt-28",
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal y={20}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-clay/70" />
              <p className="label-caps text-clay">Just Landed</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
              <CharReveal text="New Arrivals" />
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-paper/60">
              Discover the latest pieces — cut in Bangkok, released in small runs.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.22} className="hidden md:block">
          <button
            onClick={() => navigate({ name: "shop" })}
            className="group mb-2 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-clay"
          >
            View all
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
        {items.map((p, i) => (
          <div key={p.id} className={layout[i] ?? "lg:col-span-6"}>
            <ProductCard product={p} index={i} featured={i === 0 || i === 3} />
          </div>
        ))}
      </div>

      <Reveal className="mt-14 text-center md:hidden">
        <button
          onClick={() => navigate({ name: "shop" })}
          className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
        >
          View all <ArrowRight size={14} />
        </button>
      </Reveal>
    </section>
  );
};

/* ============================================================
   HORIZONTAL SCROLL — pinned collection gallery
   ============================================================ */
const HorizontalDrop: React.FC = () => {
  const { products } = useStore();
  const { navigate } = useRouter();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-68%"]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const items = [
    ...products.filter((p) => p.featured),
    ...products.filter((p) => !p.featured && p.newArrival),
  ].slice(0, 6);

  /* Mobile: natural swipe row */
  if (!isDesktop || reduce) {
    return (
      <section className="py-24">
        <div className="px-5">
          <SectionHeading kicker="The Latest Drop" title={<>Vol. 01<br />Essentials</>} />
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
          {items.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigate({ name: "product", slug: p.slug })}
              className="relative w-[74vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-paper/10 text-left"
              data-cursor="VIEW"
            >
              <div className="aspect-[3/4] overflow-hidden bg-bone">
                <img src={p.images[0]} alt={p.name} className="size-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-5 pt-16 text-paper">
                <span className="label-caps text-[8px] text-clay">0{i + 1}</span>
                <p className="mt-1 text-lg font-extrabold uppercase leading-tight">{p.name}</p>
                <p className="text-xs font-bold tabular-nums text-paper/70">{formatTHB(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  /* Desktop: scroll-driven horizontal track */
  const DropCard: React.FC<{ p: (typeof items)[number]; i: number }> = ({ p, i }) => {
    const scale = useTransform(
      scrollYProgress,
      [i / items.length, (i + 0.5) / items.length, (i + 1) / items.length],
      [0.93, 1, 0.93]
    );
    return (
      <motion.button
        onClick={() => navigate({ name: "product", slug: p.slug })}
        style={{ scale }}
        className="group relative h-[58vh] w-[38vw] shrink-0 overflow-hidden rounded-[28px] border border-paper/10 text-left"
        data-cursor="VIEW"
        aria-label={`View ${p.name}`}
      >
        <motion.img
          src={p.images[0]}
          alt={`${p.name} — ${p.category}`}
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/25 to-transparent" />
        <span className="text-outline-paper absolute right-6 top-5 text-6xl font-extrabold">
          0{i + 1}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-8 text-paper">
          <p className="label-caps text-[9px] text-clay">{p.category}</p>
          <h3 className="mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight">
            {p.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold tabular-nums text-paper/85">{formatTHB(p.price)}</p>
            <span className="grid size-10 place-items-center rounded-full border border-paper/30 transition-all duration-300 group-hover:border-clay group-hover:bg-clay">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <section ref={ref} className="relative h-[340vh]" aria-label="The latest drop — horizontal gallery">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-[1440px] items-end justify-between px-10">
          <SectionHeading kicker="The Latest Drop" title={<>Vol. 01 — Essentials</>} />
          <div className="mb-3 flex items-center gap-4">
            <span className="label-caps text-paper/40">Drag the scroll</span>
            <div className="h-px w-32 bg-paper/15">
              <motion.div className="h-full origin-left bg-clay" style={{ scaleX: progress }} />
            </div>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-8 pl-10">
          {items.map((p, i) => (
            <DropCard key={p.id} p={p} i={i} />
          ))}

          {/* end card */}
          <button
            onClick={() => navigate({ name: "shop" })}
            className="group grid h-[58vh] w-[26vw] shrink-0 place-items-center rounded-[28px] border border-paper/12 bg-cream"
            data-cursor="VIEW"
          >
            <div className="text-center">
              <p className="label-caps text-paper/45">End of drop</p>
              <p className="mt-3 text-3xl font-extrabold uppercase tracking-tight transition-colors group-hover:text-clay">
                View full
                <br />
                collection
              </p>
              <span className="mx-auto mt-6 grid size-14 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-clay group-hover:bg-clay group-hover:text-white">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================
   LARGE TYPOGRAPHY — "FASHION IS IDENTITY."
   Words appear one by one with a blur-to-sharp settle.
   ============================================================ */
const Statement: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -70, reduce ? 0 : 70]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.06]);

  const word: Variants = {
    hidden: reduce ? {} : { opacity: 0, y: 70, filter: "blur(14px)", scale: 1.06 },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="relative overflow-hidden py-28 text-paper noise md:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.08] blur-[160px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal y={16}>
          <p className="label-caps text-clay">Manifesto</p>
        </Reveal>

        <motion.h3
          style={{ scale }}
          className="mt-8 text-center text-[clamp(2.8rem,9.5vw,8.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-18% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16 } } }}
          aria-label="Fashion is identity"
        >
          {["Fashion", "Is", "Identity."].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                variants={word}
                className={`inline-block ${i === 1 ? "text-outline-paper" : ""} ${i === 2 ? "text-clay" : ""}`}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <motion.div style={{ y: imgY }} className="overflow-hidden rounded-3xl border border-paper/10">
            <RevealImage
              src="/images/craft.jpg"
              alt="Macro detail of natural ecru cotton fabric"
              className="aspect-[4/5] w-full md:aspect-square"
              direction="left"
              parallax={0.4}
              glow
            />
          </motion.div>
          <div>
            <Reveal delay={0.1}>
              <p className="text-xl font-bold leading-snug md:text-2xl">
                We don't design for seasons. We design for the version of you that
                shows up every day — the commute, the studio, the long dinner that
                turns into a story.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/55">
                Every TOMSTILL piece starts as a question: will this be worn a hundred
                times and still feel like ours? If the answer isn't a confident
                yes, it never leaves the cutting table in Bangkok.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   CATEGORIES — large interactive tiles that deep-link into
   the filtered shop.
   ============================================================ */
const CATEGORY_TILES = [
  { name: CATEGORIES[0], image: img(18516743), blurb: "Heavyweight jersey, boxy cuts" },
  { name: CATEGORIES[1], image: img(7671168), blurb: "Poplin, twill and camp collars" },
  { name: CATEGORIES[2], image: img(19189055), blurb: "Wide legs, pleats and drape" },
  { name: CATEGORIES[3], image: img(6726841), blurb: "Wool, shell and heavyweight fleece" },
  { name: CATEGORIES[4], image: img(8581381), blurb: "Caps, totes and everyday carry" },
];

const Categories: React.FC = () => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -40]);

  return (
    <section ref={ref} className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.07] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal y={20}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-clay/70" />
              <p className="label-caps text-clay">Browse</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]">
              Shop by <span className="text-clay">category.</span>
            </h2>
          </Reveal>
        </div>
      </div>

      <StaggerGroup className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {CATEGORY_TILES.map((c, i) => (
          <StaggerItem key={c.name} y={56} className={i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}>
            <button
              onClick={() => navigate({ name: "shop", category: c.name })}
              className={`group relative block w-full overflow-hidden rounded-3xl border border-paper/10 text-left transition-all duration-500 hover:border-clay/45 hover:shadow-[0_24px_70px_-30px_rgba(91,127,255,0.55)] ${
                i === 0 ? "aspect-[16/11] lg:aspect-[16/9]" : "aspect-[16/11]"
              }`}
              data-cursor="VIEW"
              aria-label={`Shop ${c.name}`}
            >
              <div className="absolute inset-0">
                <RevealImage
                  src={c.image}
                  alt={`${c.name} — TOMSTILL category`}
                  className="size-full"
                  direction={i % 2 === 0 ? "left" : "right"}
                  parallax={0.5}
                  duration={1.1}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/25 to-transparent transition-opacity duration-500 group-hover:from-void/92" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 text-paper">
                <span className="label-caps text-[9px] text-clay">0{i + 1}</span>
                <h3 className="mt-2 text-2xl font-extrabold uppercase leading-none tracking-tight md:text-3xl">
                  {c.name}
                </h3>
                <p className="mt-2 max-w-[26ch] text-[12px] leading-relaxed text-paper/55">{c.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/70 transition-colors group-hover:text-clay">
                  Explore
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
};

/* ============================================================
   BRAND STORY
   ============================================================ */
const VALUES = [
  { icon: PenTool, title: "Design", text: "Silhouettes drawn from architecture, redrawn for the body." },
  { icon: BadgeCheck, title: "Quality", text: "Natural fabrics, reinforced seams, hardware that outlives trends." },
  { icon: Feather, title: "Comfort", text: "Weight and drape tuned for tropical heat and long days." },
  { icon: Fingerprint, title: "Individuality", text: "Small-batch runs — your uniform, not everyone's." },
];

const Story: React.FC = () => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -40, reduce ? 0 : 40]);

  return (
    <section ref={ref} className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <motion.div style={{ y: imgY }}>
            <RevealImage
              src="/images/story-bangkok.jpg"
              alt="Model in beige suit against modern Bangkok architecture"
              className="aspect-[4/5] w-full rounded-[28px] border border-paper/10"
              direction="up"
              parallax={0.7}
              glow
            />
          </motion.div>
          <FloatingCard depth={0.8} duration={7} className="absolute -right-2 -top-6 md:-right-8">
            <div className="rounded-2xl border border-paper/12 bg-void/95 p-4 shadow-xl backdrop-blur-xl">
              <p className="label-caps text-[8px] text-clay">Est. 2026</p>
              <p className="mt-1 text-sm font-extrabold uppercase">Bangkok, TH</p>
              <p className="text-[10px] text-paper/50">13.7563° N, 100.5018° E</p>
            </div>
          </FloatingCard>
        </div>

        <div>
          <Reveal y={20}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-clay/70" />
              <p className="label-caps text-clay">Our Story</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]">
              <CharReveal text="The story" />
              <br />
              <span className="text-clay">
                <CharReveal text="behind TOMSTILL®" stagger={0.02} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-paper/65">
              TOMSTILL began in a small Bangkok studio with a simple conviction:
              the clothes you reach for every day should be the ones worth
              keeping. We cut in small batches, work with natural fibres, and let
              the city's rhythm set the pace — early light, warm concrete, long
              evenings.
            </p>
          </Reveal>

          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="group h-full rounded-2xl border border-paper/10 bg-cream/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_16px_50px_rgba(91,127,255,0.18)]">
                  <span className="grid size-10 place-items-center rounded-xl border border-paper/12 bg-clay/15 text-clay transition-colors duration-300 group-hover:bg-clay group-hover:text-white">
                    <v.icon size={17} />
                  </span>
                  <p className="mt-4 text-sm font-extrabold uppercase tracking-wide">{v.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-paper/55">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.2}>
            <button
              onClick={() => navigate({ name: "about" })}
              className="group mt-10 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
            >
              Read the full story
              <span className="grid size-9 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-white">
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   LOOKBOOK PREVIEW — deliberately uneven composition
   ============================================================ */
const LookbookPreview: React.FC = () => {
  const { navigate } = useRouter();
  const looks = [
    { img: "/images/look-01.jpg", id: "LOOK 01", title: "First Light", cls: "lg:mt-0", ratio: "aspect-[3/4]" },
    { img: "/images/look-02.jpg", id: "LOOK 02", title: "Hard Shadows", cls: "lg:mt-24", ratio: "aspect-[4/5]" },
    { img: "/images/look-03.jpg", id: "LOOK 03", title: "Soft Focus", cls: "lg:mt-48", ratio: "aspect-[3/4]" },
  ];
  return (
    <section className="relative bg-cream/30 py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal y={20}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-clay/70" />
                <p className="label-caps text-clay">Lookbook</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]">
                Vol. 01 <span className="text-clay">editorial.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="hidden md:block">
            <button
              onClick={() => navigate({ name: "lookbook" })}
              className="group mb-2 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-clay"
            >
              All looks
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {looks.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.12} className={l.cls}>
              <button
                onClick={() => navigate({ name: "lookbook" })}
                className="group relative block w-full overflow-hidden rounded-[24px] border border-paper/10 text-left"
                data-cursor="VIEW"
                aria-label={`Open lookbook — ${l.title}`}
              >
                <RevealImage
                  src={l.img}
                  alt={`${l.id} — ${l.title} from the TOMSTILL Vol. 01 lookbook`}
                  className={`${l.ratio} w-full`}
                  direction={i === 1 ? "down" : "up"}
                  parallax={0.5}
                  glow
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-6 text-paper">
                  <p className="label-caps text-[9px] text-clay">{l.id}</p>
                  <p className="mt-1 text-xl font-extrabold uppercase tracking-tight">{l.title}</p>
                </div>
                <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-clay/80 opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100">
                  <ArrowUpRight size={16} className="text-white" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center md:hidden">
          <button
            onClick={() => navigate({ name: "lookbook" })}
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            All looks <ArrowRight size={14} />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

/* ============================================================
   COLLECTION CTA BANNER
   ============================================================ */
const CollectionBanner: React.FC = () => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative h-[72vh] min-h-[480px]">
        <motion.img
          src="/images/collection-hero.jpg"
          alt="TOMSTILL Vol. 01 First Light campaign — two models in neutral tailoring"
          loading="lazy"
          style={{ y }}
          className="absolute inset-0 size-full scale-[1.25] object-cover"
        />
        <div className="absolute inset-0 bg-void/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-paper">
          <Reveal>
            <p className="label-caps text-paper/70">Vol. 01 — First Light</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="mt-4 text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-none tracking-tight">
              The collection
            </h3>
          </Reveal>
          <Reveal delay={0.2}>
            <button
              onClick={() => navigate({ name: "shop" })}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-clay px-9 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:scale-[1.03] hover:bg-clay-deep glow-strong"
            >
              Shop now
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   HOME
   ============================================================ */
export const Home: React.FC = () => (
  <>
    <Hero />
    <Marquee
      items={["New Season", "Vol. 01 — First Light", "Bangkok", "Worldwide Shipping", "Small Batch", "Natural Fabrics"]}
    />
    <Chronicle />
    <NewArrivals />
    <HorizontalDrop />
    <Principles />
    <Statement />
    <Categories />
    <Story />
    <LookbookPreview />
    <CollectionBanner />
  </>
);
