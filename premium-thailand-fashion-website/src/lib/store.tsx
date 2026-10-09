/* ============================================================
   ARUN® — STORE (cart · wishlist · orders · admin CRUD)
   ------------------------------------------------------------
   FIREBASE INTEGRATION POINT
   This prototype persists to localStorage so it runs anywhere.
   To go live:
     1. Replace the localStorage adapter below with Firestore
        (products → `products` collection, orders → `orders`).
     2. Store product imagery in Firebase Storage and keep
        download URLs in the product documents.
     3. Gate the Admin page with Firebase Authentication
        (never ship passwords in frontend code — the admin
        passcode here is a clearly-labelled placeholder).
   ============================================================ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { products as seedProducts, Product } from "../data/catalog";

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface OrderLine extends CartItem {
  name: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  payment: string;
  status: "Processing" | "Packed" | "Shipped";
}

export interface SiteContent {
  announcement: string;
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroStatement: string;
  aboutIntro: string;
}

const DEFAULT_CONTENT: SiteContent = {
  announcement: "New Season — Vol. 01 'First Light' — Free shipping in Thailand over THB 2,000",
  heroKicker: "New Season · Bangkok",
  heroTitleA: "WEAR",
  heroTitleB: "YOUR DAWN.",
  heroStatement:
    "ARUN is a fashion house based in Bangkok — considered essentials, confident silhouettes and natural fabrics, made for the way you move.",
  aboutIntro:
    "ARUN — Thai for dawn — began in a small Bangkok studio with a simple conviction: that the clothes you reach for every day should be the ones worth keeping.",
};

/* ---------- localStorage helpers ---------- */
const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fail silently */
  }
};

const KEYS = {
  cart: "arun-cart",
  wishlist: "arun-wishlist",
  orders: "arun-orders",
  products: "arun-products-override",
  content: "arun-content",
};

interface StoreValue {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  content: SiteContent;
  isCartOpen: boolean;
  toast: string | null;
  cartCount: number;
  subtotal: number;
  addToCart: (productId: string, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  placeOrder: (customer: Order["customer"], payment: string) => Order;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
  saveContent: (c: SiteContent) => void;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => load(KEYS.products, seedProducts));
  const [cart, setCart] = useState<CartItem[]>(() => load(KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => load(KEYS.wishlist, []));
  const [orders, setOrders] = useState<Order[]>(() => load(KEYS.orders, []));
  const [content, setContent] = useState<SiteContent>(() => load(KEYS.content, DEFAULT_CONTENT));
  const [isCartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* persistence */
  useEffect(() => save(KEYS.cart, cart), [cart]);
  useEffect(() => save(KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => save(KEYS.orders, orders), [orders]);
  useEffect(() => save(KEYS.products, products), [products]);
  useEffect(() => save(KEYS.content, content), [content]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (productId: string, size: string, color: string, qty = 1) => {
      setCart((prev) => {
        const i = prev.findIndex(
          (l) => l.productId === productId && l.size === size && l.color === color
        );
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, 9) };
          return next;
        }
        return [...prev, { productId, size, color, qty }];
      });
      const p = products.find((p) => p.id === productId);
      showToast(`${p ? p.name : "Item"} added to your bag`);
      setCartOpen(true);
    },
    [products, showToast]
  );

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color))
    );
  }, []);

  const setQty = useCallback(
    (productId: string, size: string, color: string, qty: number) => {
      if (qty <= 0) return removeFromCart(productId, size, color);
      setCart((prev) =>
        prev.map((l) =>
          l.productId === productId && l.size === size && l.color === color
            ? { ...l, qty: Math.min(qty, 9) }
            : l
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const has = prev.includes(productId);
        showToast(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const placeOrder = useCallback(
    (customer: Order["customer"], payment: string) => {
      const lines: OrderLine[] = cart.map((l) => {
        const p = products.find((p) => p.id === l.productId)!;
        return { ...l, name: p.name, price: p.price, image: p.images[0] };
      });
      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
      const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 120;
      const order: Order = {
        id: `AR-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        lines,
        subtotal,
        shipping,
        total: subtotal + shipping,
        customer,
        payment,
        status: "Processing",
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, products]
  );

  /* admin CRUD */
  const saveProduct = useCallback(
    (p: Product) => {
      setProducts((prev) => {
        const i = prev.findIndex((x) => x.id === p.id);
        if (i >= 0) {
          const next = [...prev];
          next[i] = p;
          return next;
        }
        return [...prev, p];
      });
      showToast(`“${p.name}” saved`);
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product removed");
    },
    [showToast]
  );

  const resetCatalog = useCallback(() => {
    setProducts(seedProducts);
    showToast("Catalog restored to seed data");
  }, [showToast]);

  const saveContent = useCallback(
    (c: SiteContent) => {
      setContent(c);
      showToast("Site content updated");
    },
    [showToast]
  );

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const subtotal = useMemo(
    () =>
      cart.reduce((s, l) => {
        const p = products.find((p) => p.id === l.productId);
        return s + (p ? p.price * l.qty : 0);
      }, 0),
    [cart, products]
  );

  const value: StoreValue = {
    products,
    cart,
    wishlist,
    orders,
    content,
    isCartOpen,
    toast,
    cartCount,
    subtotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    placeOrder,
    saveProduct,
    deleteProduct,
    resetCatalog,
    saveContent,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
};
