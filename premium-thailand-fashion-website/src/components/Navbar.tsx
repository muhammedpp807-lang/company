import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { useRouter, Route } from "../lib/router";
import { useStore } from "../lib/store";

const LINKS: { label: string; route: Route }[] = [
  { label: "Shop", route: { name: "shop" } },
  { label: "Collections", route: { name: "shop", category: "New" } },
  { label: "Lookbook", route: { name: "lookbook" } },
  { label: "About", route: { name: "about" } },
];

export const Navbar: React.FC = () => {
  const { route, navigate } = useRouter();
  const { cartCount, openCart, wishlist, content } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (r: Route) => {
    setMenuOpen(false);
    navigate(r);
  };

  const active = (name: string) =>
    route.name === name || (name === "shop" && (route.name === "shop" || route.name === "product"));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120]">
        {/* announcement strip — editable in Admin → Content */}
        <div
          className={`overflow-hidden bg-void text-paper transition-all duration-500 ${
            scrolled ? "max-h-0" : "max-h-10"
          }`}
        >
          <p className="truncate px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/80 md:text-[11px]">
            {content.announcement}
          </p>
        </div>

        <nav
          className={`transition-all duration-500 ${
            scrolled
              ? "border-b border-paper/10 bg-void/85 shadow-[0_8px_30px_rgba(4,5,10,0.6)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
          aria-label="Main navigation"
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 md:px-10">
            <Logo onClick={() => go({ name: "home" })} />

            {/* desktop links */}
            <div className="hidden items-center gap-9 md:flex">
              {LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.route)}
                  className={`group relative text-[13px] font-bold uppercase tracking-[0.16em] transition-colors ${
                    active(l.route.name === "shop" ? "shop" : l.route.name)
                      ? "text-clay"
                      : "text-paper/70 hover:text-ink"
                  }`}
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-clay transition-transform duration-400 group-hover:origin-left group-hover:scale-x-100" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => go({ name: "shop" })}
                className="grid size-10 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/8 hover:text-ink"
                aria-label="Search products"
              >
                <Search size={19} strokeWidth={2.2} />
              </button>
              <button
                onClick={() => go({ name: "shop" })}
                className="relative hidden size-10 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/8 hover:text-ink md:grid"
                aria-label={`Wishlist, ${wishlist.length} items`}
              >
                <Heart size={19} strokeWidth={2.2} className={wishlist.length ? "fill-clay text-clay" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-clay text-[9px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={openCart}
                className="relative grid size-10 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/8 hover:text-ink"
                aria-label={`Open bag, ${cartCount} items`}
              >
                <ShoppingBag size={19} strokeWidth={2.2} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-0 top-0.5 grid size-4.5 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold text-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-paper/8 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={21} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[180] flex flex-col bg-void text-paper noise"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
            <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-clay/12 blur-[130px]" />

            <div className="relative flex items-center justify-between px-5 py-4">
              <Logo dark onClick={() => go({ name: "home" })} />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-paper/20"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col justify-center gap-1 px-8" aria-label="Mobile navigation">
              {[...LINKS, { label: "Contact", route: { name: "contact" } as Route }, { label: "Your Bag", route: { name: "checkout" } as Route }].map(
                (l, i) => (
                  <motion.button
                    key={l.label}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => go(l.route)}
                    className="group flex items-baseline gap-4 border-b border-paper/10 py-4 text-left"
                  >
                    <span className="label-caps text-[9px] text-clay">0{i + 1}</span>
                    <span className="text-4xl font-extrabold uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                      {l.label}
                    </span>
                  </motion.button>
                )
              )}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative flex items-center justify-between px-8 pb-10 label-caps text-paper/40"
            >
              <span>Bangkok · Thailand</span>
              <span>@arun.studio</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
