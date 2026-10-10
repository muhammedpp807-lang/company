import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Ruler,
  Truck,
  RotateCcw,
  Leaf,
} from "lucide-react";
import { useStore } from "../lib/store";
import { useRouter } from "../lib/router";
import { formatPrice } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { SectionHeading } from "../components/Reveal";
import { CharReveal } from "../components/RevealImage";

const ACCORDIONS = (product: ReturnType<typeof useStore>["products"][number]) => [
  {
    icon: Leaf,
    title: "Material & Care",
    body: `${product.material}. Machine wash cold with like colours, hang in shade to dry. Warm iron if needed — do not tumble dry. Built to be handed down.`,
  },
  {
    icon: Ruler,
    title: "Fit & Sizing",
    body: `${product.fit}. Our age bands run true — measure the chest and pick the matching band. Between bands? Size up for a season of growth.`,
  },
  {
    icon: Truck,
    title: "Shipping",
    body: "India: 1–3 working days (free over ₹2,000). Rest of world: 5–9 days, tracked end to end. Duties included at checkout.",
  },
  {
    icon: RotateCcw,
    title: "Returns",
    body: "30 days, unworn with tags. Exchanges are always free in India — we collect from your door.",
  },
];

/* caption columns under the product — storyboard style */
const CAPTIONS = [
  { k: "Fabric", v: "Sourced from the knitwear capital, milled to our own weight." },
  { k: "Print", v: "Hand screen-printed in small runs, so no two are identical." },
  { k: "Fit", v: "Adult proportions, scaled down for the next generation." },
  { k: "Frame", v: "100% of the page — the product, nothing else." },
];

export const ProductPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { products, addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const product = products.find((p) => p.slug === slug);

  const [imgIndex, setImgIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<number | null>(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const imgRef = useRef<HTMLDivElement>(null);

  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3)
        : [],
    [products, product]
  );

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 pt-24 text-center">
        <p className="label-caps text-paper/50">404</p>
        <h1 className="text-4xl font-extrabold uppercase">Piece not found</h1>
        <p className="text-sm text-paper/55">This piece may have sold out or moved.</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-2 rounded-full bg-clay px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white glow-soft"
        >
          Back to shop
        </button>
      </div>
    );
  }

  const activeSize = size ?? product.sizes[Math.min(2, product.sizes.length - 1)];
  const activeColor = color ?? product.colors[0].name;
  const wished = isWishlisted(product.id);
  const indexNo = String(products.findIndex((p) => p.id === product.id) + 1).padStart(2, "0");

  const onZoomMove = (e: React.MouseEvent) => {
    const r = imgRef.current?.getBoundingClientRect();
    if (!r) return;
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-24 md:px-10 md:pt-32">
      {/* product structured data (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            brand: { "@type": "Brand", name: "TOMSTILL" },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "INR",
              availability:
                product.inventory > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      {/* top bar — storyboard style */}
      <div className="flex items-center justify-between border-b border-paper/10 pb-4">
        <button
          onClick={() => navigate({ name: "shop" })}
          className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50 transition-colors hover:text-clay"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </button>
        <p className="label-caps text-paper/40">
          Product {indexNo} — {product.name}
        </p>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`grid size-9 place-items-center rounded-full border transition-all active:scale-90 ${
            wished ? "border-clay bg-clay text-white glow-soft" : "border-paper/15 text-paper/70 hover:border-paper/50"
          }`}
        >
          <Heart size={15} className={wished ? "fill-white" : ""} />
        </button>
      </div>

      {/* ============ main composition ============ */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {/* ---------- full-bleed image ---------- */}
        <motion.div
          ref={imgRef}
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.15, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-paper/10 bg-bone lg:aspect-[5/6]"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={onZoomMove}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIndex}
              src={product.images[imgIndex]}
              alt={`${product.name} — view ${imgIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              style={{ transformOrigin: origin }}
              className={`absolute inset-0 size-full object-cover transition-transform duration-300 ${
                zoom ? "scale-[1.6]" : "scale-100"
              }`}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-transparent" />

          {product.newArrival && (
            <span className="absolute left-4 top-4 rounded-full bg-clay px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white glow-soft">
              New Arrival
            </span>
          )}

          {/* image counter */}
          <span className="absolute bottom-4 right-4 rounded-full bg-void/80 px-3 py-1.5 text-[10px] font-bold tabular-nums text-paper/70 backdrop-blur">
            {imgIndex + 1} / {product.images.length}
          </span>
        </motion.div>

        {/* ---------- info panel ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <p className="label-caps text-clay">
            {product.category} · {product.season}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em]">
            <CharReveal text={product.name} stagger={0.018} />
          </h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.16em] text-paper/45">
            {product.tags.slice(0, 3).join(" · ")}
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-3xl font-extrabold tabular-nums">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="text-base text-paper/40 line-through tabular-nums">
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-paper/65">
            {product.description}
          </p>

          {/* colors */}
          <div className="mt-8">
            <p className="label-caps text-paper/45">Colour — {activeColor}</p>
            <div className="mt-3 flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-pressed={activeColor === c.name}
                  aria-label={`Colour ${c.name}`}
                  className={`grid size-10 place-items-center rounded-full border-2 transition-all ${
                    activeColor === c.name ? "border-clay" : "border-transparent hover:border-paper/30"
                  }`}
                >
                  <span className="size-7 rounded-full border border-paper/20" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* sizes */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="label-caps text-paper/45">Size</p>
              <button className="text-[11px] font-bold uppercase tracking-[0.14em] text-paper/50 underline-offset-4 hover:text-clay hover:underline">
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={activeSize === s}
                  className={`h-11 min-w-14 rounded-full border px-3.5 text-[12px] font-bold transition-all ${
                    activeSize === s
                      ? "border-clay bg-clay text-white glow-soft"
                      : "border-paper/15 hover:border-paper/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + actions */}
          <div className="mt-9 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center rounded-full border border-paper/15 px-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-paper/8"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(Math.min(9, qty + 1))}
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-paper/8"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product.id, activeSize, activeColor, qty)}
              className="group flex h-13 flex-1 items-center justify-center gap-3 rounded-full bg-clay px-7 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-clay-deep glow-strong"
            >
              <ShoppingBag size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
              Add to Bag
            </button>
          </div>

          <button
            onClick={() => {
              addToCart(product.id, activeSize, activeColor, qty);
              navigate({ name: "checkout" });
            }}
            className="group mt-3 flex h-13 w-full items-center justify-center gap-3 rounded-full border border-paper/25 text-[12px] font-bold uppercase tracking-[0.16em] transition-all hover:border-clay hover:bg-clay hover:text-white"
          >
            <Zap size={15} className="transition-transform duration-300 group-hover:scale-125" />
            Buy it now
          </button>

          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-paper/40">
            {product.inventory > 15
              ? "In stock — ships within 48h"
              : `Only ${product.inventory} left — small batch`}
          </p>

          {/* accordions */}
          <div className="mt-9 divide-y divide-paper/10 border-y border-paper/10">
            {ACCORDIONS(product).map((acc, i) => (
              <div key={acc.title}>
                <button
                  onClick={() => setOpenAcc(openAcc === i ? null : i)}
                  aria-expanded={openAcc === i}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="flex items-center gap-3 text-[13px] font-extrabold uppercase tracking-wide">
                    <acc.icon size={15} className="text-clay" />
                    {acc.title}
                  </span>
                  <motion.span animate={{ rotate: openAcc === i ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-lg text-paper/50">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openAcc === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pl-7 text-[13px] leading-relaxed text-paper/60">{acc.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ============ filmstrip rail ============ */}
      <div className="mt-8 border-t border-paper/10 pt-6">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              data-active={i === imgIndex}
              aria-label={`View image ${i + 1} of ${product.name}`}
              className={`rail-thumb size-20 shrink-0 overflow-hidden rounded-xl border-2 border-transparent opacity-55 md:size-24 ${
                i === imgIndex ? "opacity-100" : ""
              }`}
            >
              <img src={img} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* ============ caption columns ============ */}
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-4">
        {CAPTIONS.map((c) => (
          <div key={c.k} className="bg-void p-6">
            <p className="label-caps text-clay">{c.k}</p>
            <p className="mt-2.5 text-[13px] leading-relaxed text-paper/55">{c.v}</p>
          </div>
        ))}
      </div>

      {/* ============ related ============ */}
      {related.length > 0 && (
        <div className="mt-28">
          <div className="flex items-end justify-between">
            <SectionHeading kicker="Complete the fit" title={<>Pairs<br />well with</>} />
            <button
              onClick={() => navigate({ name: "shop", category: product.category })}
              className="group mb-2 hidden items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-clay md:inline-flex"
            >
              <ArrowLeft size={14} className="rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              All {product.category}
            </button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
