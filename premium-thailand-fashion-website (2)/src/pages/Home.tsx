import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, MapPin, Store, Package } from "lucide-react";
import { useStore } from "../lib/store";
import { useRouter } from "../lib/router";
import { ProductCard } from "../components/ProductCard";
import { FloatingCard } from "../components/FloatingCard";
import { Marquee } from "../components/Marquee";
import { Principles } from "../components/Principles";
import { Chronicle } from "../components/Chronicle";
import { Reveal, StaggerGroup, StaggerItem, SectionHeading } from "../components/Reveal";
import { RevealImage, CharReveal } from "../components/RevealImage";
import { DawnMark } from "../components/Logo";
import { formatPrice, STORES } from "../data/catalog";

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

/* sequenced hero entrance — brand → headline → text → CTA */
const rise: Variants = {
  hidden: { opacity: 0, y: 46 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ============================================================
   HERO — "STOCK THE STREET."
   Sequenced entrance, then a scroll transformation: the storefront
   image scales down, the headline lifts, and the neon sign
   flickers. Nothing is removed abruptly.
   ============================================================ */
const Hero: React.FC = () => {
  const { content, products } = useStore();
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.86]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-34%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.5]);

  const drop = products.find((p) => p.featured) ?? products[0];

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-28 md:pt-32 noise">
      {/* ember glow + grid */}
      <motion.div style={{ scale: glowScale }} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-20 size-[520px] rounded-full bg-clay/12 blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 size-[400px] rounded-full bg-clay-deep/10 blur-[130px]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 md:grid-cols-[1.1fr_1fr] md:gap-6 md:px-10">
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

          <h1 className="mt-6 text-[clamp(3.2rem,9vw,8rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em]">
            <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
              {content.heroTitleA}
            </motion.span>
            <motion.span
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="neon-text block"
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
                className="group inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-clay-deep hover:shadow-[0_12px_44px_rgba(232,69,44,0.55)]"
              >
                Shop the drop
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => navigate({ name: "lookbook" })}
                className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:border-clay hover:bg-clay hover:text-white"
              >
                The lookbook
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>

          <motion.div custom={5} variants={rise} initial="hidden" animate="show">
            <div className="mt-12 flex items-center gap-8 label-caps text-paper/45">
              <span>Vol. 01 — Stock The Street</span>
              <span className="h-px w-8 bg-paper/20" />
              <span>Ages 2–13Y</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- storefront + floating cards ---------- */}
        <div className="relative order-1 md:order-2">
          <motion.div
            style={{ scale: imgScale, y: imgY }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden rounded-[28px] border border-paper/10 shadow-[0_40px_100px_rgba(232,69,44,0.16)]"
          >
            <img
              src="https://images.pexels.com/photos/38443852/pexels-photo-38443852.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500"
              alt="TOMSTILL storefront lit at night — the first impression of the house"
              className="size-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/55 via-transparent to-transparent" />

            {/* neon sign plate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.9 }}
              className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-clay/30 bg-void/70 px-5 py-4 backdrop-blur-xl"
            >
              <div>
                <p className="neon-text text-lg font-extrabold uppercase tracking-[0.08em]">TOMSTILL</p>
                <p className="label-caps mt-1 text-[8px] text-paper/50">Kids &amp; Boys</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-clay/15">
                <DawnMark size={18} />
              </span>
            </motion.div>
          </motion.div>

          {/* floating product card */}
          <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]) }} className="absolute -right-3 top-8 z-10 md:-right-8">
            <FloatingCard depth={0.9} duration={6.5} delay={0.9}>
              <button
                onClick={() => drop && navigate({ name: "product", slug: drop.slug })}
                className="group w-44 overflow-hidden rounded-2xl border border-paper/12 bg-cream/90 p-3 text-left shadow-[0_24px_60px_rgba(11,9,8,0.8)] backdrop-blur-xl transition-colors hover:border-clay/50 md:w-52"
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-[8px] text-clay">New Arrival</span>
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
                <p className="text-[10px] font-bold tabular-nums text-paper/55">{drop && formatPrice(drop.price)}</p>
              </button>
            </FloatingCard>
          </motion.div>

          {/* numbered stock card */}
          <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]) }} className="absolute -left-2 bottom-10 z-10 md:-left-10">
            <FloatingCard depth={0.5} duration={8} delay={1.25}>
              <div className="rounded-2xl border border-paper/12 bg-void p-4 text-paper shadow-[0_24px_60px_rgba(11,9,8,0.85)]">
                <p className="text-3xl font-extrabold tracking-tight text-clay">01</p>
                <p className="label-caps mt-1 text-[8px] text-paper/60">In Stock</p>
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
   NEW ARRIVALS — editorial, asymmetric
   ============================================================ */
const NewArrivals: React.FC = () => {
  const { products } = useStore();
  const { navigate } = useRouter();
  const items = products.filter((p) => p.newArrival).slice(0, 4);

  const layout = ["lg:col-span-7", "lg:col-span-5 lg:mt-28", "lg:col-span-5", "lg:col-span-7 lg:mt-28"];

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
              Discover the latest pieces — fresh off the rail and ready to stock.
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
            >
              <div className="aspect-[3/4] overflow-hidden bg-bone">
                <img src={p.images[0]} alt={p.name} className="size-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-5 pt-16 text-paper">
                <span className="label-caps text-[8px] text-clay">0{i + 1}</span>
                <p className="mt-1 text-lg font-extrabold uppercase leading-tight">{p.name}</p>
                <p className="text-xs font-bold tabular-nums text-paper/70">{formatPrice(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

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
            <p className="text-sm font-bold tabular-nums text-paper/85">{formatPrice(p.price)}</p>
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

          <button
            onClick={() => navigate({ name: "shop" })}
            className="group grid h-[58vh] w-[26vw] shrink-0 place-items-center rounded-[28px] border border-paper/12 bg-cream"
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
   LARGE TYPOGRAPHY — "BIG STYLE. SMALL SIZES."
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.09] blur-[160px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal y={16}>
          <p className="label-caps text-clay">Manifesto</p>
        </Reveal>

        <motion.h3
          style={{ scale }}
          className="mt-8 text-center text-[clamp(2.6rem,9vw,8rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-18% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          aria-label="Big style, small sizes"
        >
          {["Big", "Style.", "Small", "Sizes."].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                variants={word}
                className={`inline-block ${i === 1 || i === 3 ? "neon-text" : ""}`}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <motion.div style={{ y: imgY }} className="overflow-hidden rounded-3xl border border-paper/10">
            <RevealImage
              src="https://images.pexels.com/photos/18761008/pexels-photo-18761008.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250"
              alt="Mannequins styled in the TOMSTILL Vol. 01 collection"
              className="aspect-[4/5] w-full md:aspect-square"
              direction="left"
              parallax={0.4}
            />
          </motion.div>
          <div>
            <Reveal delay={0.1}>
              <p className="text-xl font-bold leading-snug md:text-2xl">
                Adult proportions, cut for the next generation. We don't shrink
                anything down — we build it properly, from the ground up.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/55">
                Every TOMSTILL piece is graded on real kids, tested on real
                concrete, and made to survive being handed down. That's the whole
                brief.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   STOREFRONT — the shop window, big
   ============================================================ */
const Storefront: React.FC = () => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative h-[85vh] min-h-[520px]">
        <motion.img
          src="https://images.pexels.com/photos/19047723/pexels-photo-19047723.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1200"
          alt="The TOMSTILL shopfront at night, lit from within"
          loading="lazy"
          style={{ y }}
          className="absolute inset-0 size-full scale-[1.18] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-void/55" />

        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <div className="mx-auto w-full max-w-[1440px]">
            <Reveal y={20}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-clay/70" />
                <p className="label-caps text-clay">The shopfront</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 max-w-3xl text-[clamp(2.4rem,7vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
                <CharReveal text="Step inside." />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate({ name: "shop" })}
                  className="group inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-clay-deep hover:shadow-[0_12px_44px_rgba(232,69,44,0.5)]"
                >
                  Shop the floor
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
                <button
                  onClick={() => navigate({ name: "contact" })}
                  className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] transition-all hover:border-clay hover:bg-clay hover:text-white"
                >
                  Wholesale enquiry
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-8 max-w-md text-[13px] leading-relaxed text-paper/50">
                Every TOMSTILL door carries the same rails and the same neon —
                the only thing that changes is the light coming through the glass.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   CATEGORIES
   ============================================================ */
const CATEGORY_TILES = [
  { name: "Tees", image: img(31995223), blurb: "Heavyweight cotton, hand-printed graphics" },
  { name: "Jackets", image: img(18761008), blurb: "Varsity, coach and bomber shells" },
  { name: "Hoodies", image: img(5706273), blurb: "480gsm loopback, built to be handed down" },
  { name: "Bottoms", image: img(5698851), blurb: "Cargos, track pants and wide drape" },
  { name: "Caps", image: img(30940601), blurb: "The finishing piece on every fit" },
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
        className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/[0.08] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative">
        <Reveal y={20}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-clay/70" />
            <p className="label-caps text-clay">Browse</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]">
            Shop by <span className="neon-text">category.</span>
          </h2>
        </Reveal>
      </div>

      <StaggerGroup className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {CATEGORY_TILES.map((c, i) => (
          <StaggerItem key={c.name} y={56} className={i === 0 ? "lg:col-span-2" : ""}>
            <button
              onClick={() => navigate({ name: "shop", category: c.name })}
              className={`group relative block w-full overflow-hidden rounded-3xl border border-paper/10 text-left transition-all duration-500 hover:border-clay/45 hover:shadow-[0_24px_70px_-30px_rgba(232,69,44,0.55)] ${
                i === 0 ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[16/11]"
              }`}
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
              <span className="absolute right-5 top-5 text-paper/30 transition-all duration-500 group-hover:rotate-90 group-hover:text-clay">
                <Plus size={16} strokeWidth={2.4} />
              </span>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
};

/* ============================================================
   STORELOCATIONS — "THREE DOORS, ONE COLLECTION"
   ============================================================ */
const StoreLocations: React.FC = () => {
  const { navigate } = useRouter();
  const icons = [Store, MapPin, MapPin, MapPin];

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-40" />
      <div className="pointer-events-none absolute -right-40 top-1/4 size-[420px] rounded-full bg-clay/[0.08] blur-[140px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <Reveal y={20}>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-clay/70" />
                <p className="label-caps text-clay">Visit us — all locations</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.03em]">
                <CharReveal text="Three doors," />
                <br />
                <span className="neon-text">
                  <CharReveal text="one collection." stagger={0.02} />
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-paper/60">
                The TOMSTILL monogram hangs over every door. Walk into any of
                them and you'll find the same rails, in the same order.
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2" stagger={0.09}>
            {STORES.map((s, i) => {
              const Icon = icons[i] ?? MapPin;
              return (
                <StaggerItem key={s.city} y={40}>
                  <div className="group flex h-full flex-col bg-void p-7 transition-colors duration-500 hover:bg-cream">
                    <div className="flex items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-xl border border-paper/12 bg-clay/15 text-clay transition-colors duration-300 group-hover:bg-clay group-hover:text-white">
                        <Icon size={18} />
                      </span>
                      <span className="text-[11px] font-bold tabular-nums tracking-[0.2em] text-paper/25">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-extrabold uppercase tracking-tight">{s.city}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-paper/55">{s.detail}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        <Reveal delay={0.2}>
          <button
            onClick={() => navigate({ name: "contact" })}
            className="group mt-12 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
          >
            Stock TOMSTILL in your store
            <span className="grid size-9 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-white">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
};

/* ============================================================
   WHOLESALE / STOCK THE STREET CTA
   ============================================================ */
const Wholesale: React.FC = () => {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[500px]">
        <motion.img
          src="https://images.pexels.com/photos/29356751/pexels-photo-29356751.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1200"
          alt="A neon-lit street at night — the world TOMSTILL is built for"
          loading="lazy"
          style={{ y }}
          className="absolute inset-0 size-full scale-[1.2] object-cover"
        />
        <div className="absolute inset-0 bg-void/60" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/15 blur-[130px]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-paper">
          <Reveal>
            <p className="label-caps text-paper/70">Finale — wholesale enquiry</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
              <CharReveal text="Stock the" />
              <br />
              <span className="neon-text">
                <CharReveal text="street." stagger={0.02} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-paper/60">
              We wholesale to selected doors. Tell us where you are and what you
              need the street to wear next.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate({ name: "contact" })}
                className="group inline-flex items-center gap-3 rounded-full bg-clay px-9 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:scale-[1.03] hover:bg-clay-deep glow-strong"
              >
                Open an enquiry
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => navigate({ name: "shop" })}
                className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.18em] transition-all hover:border-clay hover:bg-clay hover:text-white"
              >
                Shop retail
                <Package size={15} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   LOOKBOOK PREVIEW
   ============================================================ */
const LookbookPreview: React.FC = () => {
  const { navigate } = useRouter();
  const looks = [
    { img: "https://images.pexels.com/photos/29356751/pexels-photo-29356751.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1200", id: "LOOK 01", title: "The Street At Night", cls: "lg:mt-0", ratio: "aspect-[3/4]" },
    { img: "https://images.pexels.com/photos/38443852/pexels-photo-38443852.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1150", id: "LOOK 02", title: "The Golddigio", cls: "lg:mt-24", ratio: "aspect-[4/5]" },
    { img: "https://images.pexels.com/photos/19047723/pexels-photo-19047723.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1200", id: "LOOK 03", title: "The Shopfront", cls: "lg:mt-48", ratio: "aspect-[3/4]" },
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
                Vol. 01 <span className="neon-text">editorial.</span>
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
                aria-label={`Open lookbook — ${l.title}`}
              >
                <RevealImage
                  src={l.img}
                  alt={`${l.id} — ${l.title} from the TOMSTILL Vol. 01 lookbook`}
                  className={`${l.ratio} w-full`}
                  direction={i === 1 ? "down" : "up"}
                  parallax={0.5}
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
   HOME
   ============================================================ */
export const Home: React.FC = () => (
  <>
    <Hero />
    <Marquee
      items={["Stock The Street", "Vol. 01", "Kids & Boys", "Ages 2–13Y", "Heavyweight Cotton", "Small Batch"]}
    />
    <Chronicle />
    <NewArrivals />
    <HorizontalDrop />
    <Principles />
    <Statement />
    <Categories />
    <Storefront />
    <StoreLocations />
    <Wholesale />
    <LookbookPreview />
  </>
);
