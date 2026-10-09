import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
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
import { formatTHB } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { Reveal, SectionHeading } from "../components/Reveal";
import { CharReveal } from "../components/RevealImage";

const ACCORDIONS = (product: ReturnType<typeof useStore>["products"][number]) => [
  {
    icon: Leaf,
    title: "Material & Care",
    body: `${product.material}. Machine wash cold with like colours, hang in shade to dry. Warm iron if needed — do not tumble dry. Designed to soften, never to sag.`,
  },
  {
    icon: Ruler,
    title: "Fit & Sizing",
    body: `${product.fit}. Model is 178 cm and wears size M. Between sizes? Our team answers fit questions within a day — hello@tomstill-studio.com.`,
  },
  {
    icon: Truck,
    title: "Shipping",
    body: "Thailand: 1–3 working days (free over THB 2,000). Asia-Pacific: 3–6 days. Rest of world: 5–9 days, tracked end to end. Duties included at checkout.",
  },
  {
    icon: RotateCcw,
    title: "Returns",
    body: "30 days, unworn with tags, no questions asked. Exchanges are always free in Thailand — we collect from your door.",
  },
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

  const onZoomMove = (e: React.MouseEvent) => {
    const r = imgRef.current?.getBoundingClientRect();
    if (!r) return;
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
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
              priceCurrency: "THB",
              availability:
                product.inventory > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      {/* breadcrumb */}
      <Reveal y={16}>
        <div className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-paper/45">
          <button onClick={() => navigate({ name: "home" })} className="transition-colors hover:text-ink">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate({ name: "shop" })} className="transition-colors hover:text-ink">
            Shop
          </button>
          <span>/</span>
          <button
            onClick={() => navigate({ name: "shop", category: product.category })}
            className="transition-colors hover:text-ink"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* ============ GALLERY ============ */}
        <div>
          <div className="flex gap-4">
            {/* thumbnails (desktop) */}
            {product.images.length > 1 && (
              <div className="hidden w-20 shrink-0 flex-col gap-3 md:flex">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    aria-label={`View image ${i + 1} of ${product.name}`}
                    className={`aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all ${
                      imgIndex === i ? "border-clay" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* main image */}
            <div className="relative flex-1">
              <motion.div
                ref={imgRef}
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.15, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-[24px] border border-paper/10 bg-bone"
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={onZoomMove}
                data-cursor="ZOOM"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIndex}
                    src={product.images[imgIndex]}
                    alt={`${product.name} — view ${imgIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: origin }}
                    className={`absolute inset-0 size-full object-cover transition-transform duration-300 ${
                      zoom ? "scale-[1.7]" : "scale-100"
                    }`}
                  />
                </AnimatePresence>
                {product.newArrival && (
                  <span className="absolute left-4 top-4 rounded-full bg-clay px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white glow-soft">
                    New Season
                  </span>
                )}
              </motion.div>

              {/* mobile arrows */}
              {product.images.length > 1 && (
                <div className="mt-4 flex items-center justify-between md:hidden">
                  <button
                    onClick={() => setImgIndex((imgIndex - 1 + product.images.length) % product.images.length)}
                    className="grid size-11 place-items-center rounded-full border border-paper/15"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <div className="flex gap-1.5">
                    {product.images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === imgIndex ? "w-5 bg-clay" : "w-1.5 bg-paper/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setImgIndex((imgIndex + 1) % product.images.length)}
                    className="grid size-11 place-items-center rounded-full border border-paper/15"
                    aria-label="Next image"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============ DETAILS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="label-caps text-clay">{product.category} · {product.season}</p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
            <CharReveal text={product.name} stagger={0.018} />
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-2xl font-extrabold tabular-nums">{formatTHB(product.price)}</p>
            {product.compareAt && (
              <p className="text-base text-paper/40 line-through tabular-nums">
                {formatTHB(product.compareAt)}
              </p>
            )}
            <span className="label-caps text-[9px] text-paper/40">incl. duties</span>
          </div>

          <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-paper/65">{product.description}</p>

          {/* colors */}
          <div className="mt-8">
            <p className="label-caps text-paper/45">Color — {activeColor}</p>
            <div className="mt-3 flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-pressed={activeColor === c.name}
                  aria-label={`Color ${c.name}`}
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
                  className={`h-11 min-w-12 rounded-full border px-3 text-[12px] font-bold transition-all ${
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

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={`grid size-13 place-items-center rounded-full border transition-all active:scale-90 ${
                wished ? "border-clay bg-clay text-white glow-soft" : "border-paper/15 hover:border-paper"
              }`}
            >
              <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
                <Heart size={18} className={wished ? "fill-white" : ""} />
              </motion.span>
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

          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-paper/40">
            {product.inventory > 15
              ? "In stock — ships within 48h"
              : `Only ${product.inventory} left — small batch`}
          </p>

          {/* accordions */}
          <div className="mt-10 divide-y divide-paper/10 border-y border-paper/10">
            {ACCORDIONS(product).map((acc, i) => (
              <div key={acc.title}>
                <button
                  onClick={() => setOpenAcc(openAcc === i ? null : i)}
                  aria-expanded={openAcc === i}
                  className="flex w-full items-center justify-between py-4.5 text-left"
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
                      <p className="pb-5 pl-7 text-[13px] leading-relaxed text-paper/60">{acc.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-28">
          <div className="flex items-end justify-between">
            <SectionHeading kicker="Complete the look" title={<>Pairs<br />well with</>} />
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
