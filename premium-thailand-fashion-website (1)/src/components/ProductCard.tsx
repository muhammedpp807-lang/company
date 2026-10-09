import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import { Product, formatTHB } from "../data/catalog";
import { useStore } from "../lib/store";
import { useRouter } from "../lib/router";

/* Premium product card.
   `featured` renders the larger editorial variant used in the
   asymmetric New Arrivals composition; the default is the
   standard grid card. Everything else is unchanged. */
export const ProductCard: React.FC<{
  product: Product;
  index?: number;
  layout?: boolean;
  featured?: boolean;
  className?: string;
}> = ({ product, index = 0, layout = true, featured = false, className = "" }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const [hovered, setHovered] = useState(false);
  const wished = isWishlisted(product.id);

  const open = () => navigate({ name: "product", slug: product.slug });
  const aspect = featured ? "aspect-[4/5]" : "aspect-[3/4]";
  const titleSize = featured ? "text-lg md:text-2xl" : "text-[15px]";

  return (
    <motion.article
      layout={layout}
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="EXPLORE"
    >
      <button
        onClick={open}
        className="block w-full text-left"
        aria-label={`View ${product.name}`}
      >
        <div
          className={`relative ${aspect} overflow-hidden rounded-2xl border border-paper/8 bg-bone`}
        >
          <img
            src={product.images[0]}
            alt={`${product.name} — ${product.category}`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 size-full object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hovered ? "scale-[1.07]" : "scale-100"
            }`}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="rounded-full bg-clay px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white glow-soft">
                New
              </span>
            )}
            {product.compareAt && (
              <span className="rounded-full bg-clay-deep px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                −{Math.round((1 - product.price / product.compareAt) * 100)}%
              </span>
            )}
            {product.inventory <= 15 && (
              <span className="rounded-full bg-void/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-paper ring-1 ring-paper/15 backdrop-blur">
                Low stock
              </span>
            )}
          </div>

          {/* hover glow */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* reveal strip — slides up on hover */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-void/85 px-4 py-3 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 ${
              hovered ? "translate-y-0" : ""
            }`}
          >
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-paper/70">
              {product.material || product.category} · {product.sizes.length} sizes
            </p>
          </div>
        </div>
      </button>

      {/* wishlist */}
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur transition-all duration-300 active:scale-75 ${
          wished ? "bg-clay text-white glow-soft" : "bg-void/85 text-paper ring-1 ring-paper/15 hover:bg-void"
        }`}
      >
        <motion.span
          key={String(wished)}
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Heart size={15} className={wished ? "fill-white" : ""} />
        </motion.span>
      </button>

      {/* quick add */}
      <div
        className={`pointer-events-none absolute bottom-3 right-3 transition-all duration-400 ${
          hovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <button
          onClick={() => addToCart(product.id, product.sizes[Math.min(2, product.sizes.length - 1)], product.colors[0].name)}
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-clay text-white shadow-lg transition-colors hover:bg-clay-deep glow-soft"
          aria-label={`Quick add ${product.name} to bag`}
        >
          <Plus size={17} />
        </button>
      </div>

      {/* meta */}
      <div className="mt-4 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="label-caps text-[9px] text-clay">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="label-caps text-[9px] text-paper/40">{product.category}</span>
          </div>
          <h3 className={`mt-1 truncate font-extrabold uppercase tracking-tight ${titleSize}`}>
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="size-3 rounded-full border border-paper/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="ml-1 text-[10px] uppercase tracking-[0.14em] text-paper/45">
              {product.colors.map((c) => c.name).join(" / ")}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[15px] font-extrabold tabular-nums">{formatTHB(product.price)}</p>
          {product.compareAt && (
            <p className="text-[11px] text-paper/40 line-through tabular-nums">
              {formatTHB(product.compareAt)}
            </p>
          )}
          <button
            onClick={open}
            className="group/link mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-paper/55 transition-colors hover:text-clay"
          >
            View
            <ArrowUpRight size={12} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
