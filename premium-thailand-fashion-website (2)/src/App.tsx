import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { RouterProvider, useRouter } from "./lib/router";
import { StoreProvider, useStore } from "./lib/store";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlowBackground } from "./components/GlowBackground";
import { ScrollBackdrop } from "./components/ScrollBackdrop";
import { ScrollProgress, BackToTop } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductPage } from "./pages/ProductPage";
import { Lookbook } from "./pages/Lookbook";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Checkout } from "./pages/Checkout";
import { Admin } from "./pages/Admin";

/* Global toast — paired with store.showToast */
const Toast: React.FC = () => {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="fixed bottom-6 left-1/2 z-[220] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-clay px-5 py-3.5 text-[12px] font-bold text-white shadow-2xl glow-strong"
          role="status"
          aria-live="polite"
        >
          <span className="grid size-5 place-items-center rounded-full bg-white/20">
            <Check size={12} />
          </span>
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const routeKey = (r: ReturnType<typeof useRouter>["route"]) =>
  r.name === "product" ? `product-${r.slug}` : r.name;

const Pages: React.FC = () => {
  const { route } = useRouter();
  const { closeCart } = useStore();

  useEffect(() => {
    closeCart();
  }, [route, closeCart]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={routeKey(route)}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {route.name === "home" && <Home />}
        {route.name === "shop" && <Shop initialCategory={route.category} />}
        {route.name === "product" && <ProductPage slug={route.slug} />}
        {route.name === "lookbook" && <Lookbook />}
        {route.name === "about" && <About />}
        {route.name === "contact" && <Contact />}
        {route.name === "checkout" && <Checkout />}
        {route.name === "admin" && <Admin />}
      </motion.main>
    </AnimatePresence>
  );
};

const Shell: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("main-content");
          el?.setAttribute("tabindex", "-1");
          el?.focus();
          el?.scrollIntoView();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-clay focus:px-5 focus:py-3 focus:text-[12px] focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>

      {/* scroll progress rail */}
      <ScrollProgress />

      {/* ambient layers */}
      <GlowBackground />
      <ScrollBackdrop />

      <div className="relative z-10">
        <Navbar />
        <CartDrawer />
        <span id="main-content" />
        <Pages />
        <Footer />
      </div>

      <BackToTop />
      <Toast />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <StoreProvider>
          <Shell />
        </StoreProvider>
      </RouterProvider>
    </ErrorBoundary>
  );
}
