import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { useStore } from "../lib/store";
import { ProductCard } from "../components/ProductCard";
import { Reveal } from "../components/Reveal";
import { CATEGORIES, COLOR_WAY, SIZES, formatTHB } from "../data/catalog";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price · Low → High" },
  { key: "price-desc", label: "Price · High → Low" },
];

const FILTER_TABS = ["All", "New", ...CATEGORIES] as const;

export const Shop: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const { products } = useStore();

  const [tab, setTab] = useState<string>(
    initialCategory && FILTER_TABS.includes(initialCategory as never) ? initialCategory : "All"
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [panelOpen, setPanelOpen] = useState(false);

  /* sync tab when arriving with a category (e.g. from nav) */
  useEffect(() => {
    if (initialCategory && FILTER_TABS.includes(initialCategory as never)) {
      setTab(initialCategory);
    }
  }, [initialCategory]);

  const results = useMemo(() => {
    let list = [...products];
    if (tab === "New") list = list.filter((p) => p.newArrival);
    else if (tab !== "All") list = list.filter((p) => p.category === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (size) list = list.filter((p) => p.sizes.includes(size));
    if (color) list = list.filter((p) => p.colors.some((c) => c.name === color));
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, tab, query, sort, size, color, maxPrice]);

  const activeFilters = [size, color].filter(Boolean).length + (maxPrice < 3500 ? 1 : 0);

  const clearAll = () => {
    setSize(null);
    setColor(null);
    setMaxPrice(3500);
    setQuery("");
    setTab("All");
  };

  const FilterPanel = (
    <div className="space-y-8">
      {/* size */}
      <div>
        <p className="label-caps text-paper/45">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(size === s ? null : s)}
              aria-pressed={size === s}
              className={`grid h-10 min-w-11 place-items-center rounded-full border px-3 text-[11px] font-bold tracking-wider transition-all ${
                size === s
                  ? "border-clay bg-clay text-white glow-soft"
                  : "border-paper/15 bg-transparent hover:border-paper/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* color */}
      <div>
        <p className="label-caps text-paper/45">Color</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {Object.values(COLOR_WAY).map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(color === c.name ? null : c.name)}
              aria-pressed={color === c.name}
              aria-label={`Filter color ${c.name}`}
              className={`group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[11px] font-bold transition-all ${
                color === c.name ? "border-clay bg-clay text-white" : "border-paper/15 hover:border-paper/40"
              }`}
            >
              <span
                className="grid size-6 place-items-center rounded-full border border-paper/20"
                style={{ backgroundColor: c.hex }}
              >
                {color === c.name && <Check size={11} className="text-white mix-blend-difference" />}
              </span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* price */}
      <div>
        <div className="flex items-center justify-between">
          <p className="label-caps text-paper/45">Max price</p>
          <p className="text-[13px] font-extrabold tabular-nums">{formatTHB(maxPrice)}</p>
        </div>
        <input
          type="range"
          min={500}
          max={3500}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-4 w-full accent-clay"
          aria-label="Maximum price"
        />
      </div>

      {activeFilters > 0 && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-clay"
        >
          <X size={13} /> Clear filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      {/* header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-clay/70" />
          <p className="label-caps text-clay">The Catalogue</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-5 text-[clamp(2.8rem,7vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]">
          Shop <span className="text-clay">Tomstill.</span>
        </h1>
      </Reveal>

      {/* toolbar */}
      <div className="mt-10 flex flex-col gap-4 border-y border-paper/10 py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* tabs */}
        <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:px-0">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                tab === t ? "text-white" : "text-paper/60 hover:text-ink"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-clay glow-soft"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* search */}
          <div className="relative flex-1 lg:w-64 lg:flex-none">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, category, tag…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-paper/15 bg-transparent pl-11 pr-4 text-[13px] text-ink placeholder:text-paper/35 focus:border-clay focus:outline-none"
            />
          </div>
          {/* sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="h-11 rounded-full border border-paper/15 bg-transparent px-4 text-[12px] font-bold uppercase tracking-wide text-ink focus:border-clay focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key} className="bg-cream text-ink">
                {s.label}
              </option>
            ))}
          </select>
          {/* filters toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`relative grid size-11 shrink-0 place-items-center rounded-full border transition-colors ${
              panelOpen ? "border-clay bg-clay text-white glow-soft" : "border-paper/15 hover:border-paper/40"
            }`}
            aria-expanded={panelOpen}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={16} />
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-clay text-[9px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mobile filter panel */}
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="border-b border-paper/10 pt-6">{FilterPanel}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex gap-10">
        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 overflow-hidden lg:block"
              aria-label="Product filters"
            >
              <div className="w-64 pr-8">{FilterPanel}</div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <div className="mb-8 flex items-center justify-between">
            <p className="label-caps text-paper/45">
              {results.length} {results.length === 1 ? "piece" : "pieces"}
            </p>
            {(query || tab !== "All") && (
              <p className="text-[12px] text-paper/50">
                {query && <>for “{query}” </>}
                {tab !== "All" && <>in {tab}</>}
              </p>
            )}
          </div>

          <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-28 text-center"
            >
              <p className="text-2xl font-extrabold uppercase">Nothing found</p>
              <p className="max-w-sm text-sm text-paper/55">
                Try a different search, or clear your filters to see the full collection.
              </p>
              <button
                onClick={clearAll}
                className="mt-2 rounded-full bg-clay px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white glow-soft"
              >
                Clear everything
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
