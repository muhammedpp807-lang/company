/* ============================================================
   ARUN® — Lightweight hash router
   Keeps URLs shareable (#/shop, #/product/slug) while working
   on any static host. Swap for react-router + BrowserRouter
   when deployed behind a server with SPA fallback.
   ============================================================ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Route =
  | { name: "home" }
  | { name: "shop"; category?: string }
  | { name: "product"; slug: string }
  | { name: "lookbook" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "checkout" }
  | { name: "admin" };

export const routeToHash = (r: Route): string => {
  switch (r.name) {
    case "home":
      return "#/";
    case "shop":
      return r.category ? `#/shop?c=${encodeURIComponent(r.category)}` : "#/shop";
    case "product":
      return `#/product/${r.slug}`;
    default:
      return `#/${r.name}`;
  }
};

export const hashToRoute = (hash: string): Route => {
  const h = hash.replace(/^#\/?/, "");
  if (h === "" ) return { name: "home" };
  const [path, query] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "shop") {
    const c = new URLSearchParams(query || "").get("c") || undefined;
    return { name: "shop", category: c };
  }
  if (parts[0] === "product" && parts[1]) return { name: "product", slug: parts[1] };
  if (["lookbook", "about", "contact", "checkout", "admin"].includes(parts[0])) {
    return { name: parts[0] as Exclude<Route["name"], "home" | "shop" | "product"> };
  }
  return { name: "home" };
};

interface RouterValue {
  route: Route;
  navigate: (r: Route) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<Route>(() => hashToRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => {
      setRoute(hashToRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((r: Route) => {
    const h = routeToHash(r);
    if (window.location.hash === h) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = h;
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
};
