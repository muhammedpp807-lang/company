import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Boxes,
} from "lucide-react";
import { useStore } from "../lib/store";
import { formatTHB, CATEGORIES, COLOR_WAY, SIZES, type Product } from "../data/catalog";
import { Reveal } from "../components/Reveal";

/* ============================================================
   ADMIN PANEL
   ------------------------------------------------------------
   SECURITY NOTE (PLACEHOLDER):
   The passcode below is a prototype-only gate. For production,
   replace this with Firebase Authentication (email/password or
   SSO) and enforce admin claims via Firestore security rules.
   NEVER ship real credentials in frontend code.
   ============================================================ */
const ADMIN_PASSCODE = "arun-studio-2026";
const AUTH_KEY = "arun-admin-session";

const emptyProduct = (): Product => ({
  id: `P${Date.now().toString(36).toUpperCase()}`,
  name: "",
  slug: "",
  category: "Tees",
  price: 1290,
  description: "",
  images: [],
  sizes: [...SIZES],
  colors: [COLOR_WAY.Ink],
  inventory: 20,
  featured: false,
  newArrival: true,
  tags: [],
  material: "",
  fit: "True to size",
  season: "Vol. 01 — First Light",
});

type Tab = "overview" | "products" | "orders" | "content";

export const Admin: React.FC = () => {
  const { products, orders, content, saveContent, saveProduct, deleteProduct, resetCatalog, showToast } =
    useStore();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const stats = useMemo(() => {
    const inventoryValue = products.reduce((s, p) => s + p.price * p.inventory, 0);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const lowStock = products.filter((p) => p.inventory <= 15).length;
    return { inventoryValue, revenue, lowStock };
  }, [products, orders]);

  /* ---------- gate ---------- */
  if (!authed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-5 text-paper noise">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/12 blur-[130px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-sm rounded-3xl border border-paper/12 bg-cream/70 p-8 backdrop-blur-xl"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-clay/20 text-clay">
            <Lock size={20} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight">Studio access</h1>
          <p className="mt-2 text-[12px] leading-relaxed text-paper/50">
            Prototype gate — passcode{" "}
            <code className="rounded bg-paper/10 px-1.5 py-0.5 text-clay">arun-studio-2026</code>.
            Replace with Firebase Authentication before launch.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === ADMIN_PASSCODE) {
                sessionStorage.setItem(AUTH_KEY, "1");
                setAuthed(true);
              } else {
                showToast("Incorrect passcode");
                setPass("");
              }
            }}
          >
            <label htmlFor="admin-pass" className="sr-only">Passcode</label>
            <input
              id="admin-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Passcode"
              className="mt-5 h-13 w-full rounded-2xl border border-paper/20 bg-paper/5 px-5 text-sm text-paper placeholder:text-paper/30 focus:border-clay focus:outline-none"
            />
            <button
              type="submit"
              className="mt-4 h-13 w-full rounded-full bg-clay text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.02] glow-soft"
            >
              Enter studio
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cream/40 pb-28 pt-28 md:pt-36">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        {/* header */}
        <Reveal y={16}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-caps text-clay">Internal · Prototype</p>
              <h1 className="mt-2 text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
                Studio panel
              </h1>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-clay hover:text-clay"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </Reveal>

        {/* tabs */}
        <div className="no-scrollbar mt-8 flex gap-1 overflow-x-auto rounded-full border border-paper/10 bg-cream p-1.5">
          {(
            [
              { key: "overview", label: "Overview", icon: LayoutDashboard },
              { key: "products", label: "Products", icon: Package },
              { key: "orders", label: "Orders", icon: ShoppingCart },
              { key: "content", label: "Content", icon: FileText },
            ] as { key: Tab; label: string; icon: typeof Package }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                tab === t.key ? "text-white" : "text-paper/55 hover:text-ink"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-full bg-clay glow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <t.icon size={14} className="relative" />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            {/* ================= OVERVIEW ================= */}
            {tab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { icon: Boxes, label: "Products", value: String(products.length) },
                    { icon: TrendingUp, label: "Inventory value", value: formatTHB(stats.inventoryValue) },
                    { icon: ShoppingCart, label: "Orders", value: String(orders.length) },
                    { icon: AlertTriangle, label: "Low stock", value: String(stats.lowStock) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-3xl border border-paper/10 bg-cream p-6">
                      <span className="grid size-10 place-items-center rounded-xl bg-clay/12 text-clay">
                        <s.icon size={17} />
                      </span>
                      <p className="mt-4 text-xl font-extrabold tabular-nums md:text-2xl">{s.value}</p>
                      <p className="label-caps mt-1 text-paper/45">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl border border-paper/10 bg-cream p-7">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">Recent orders</h3>
                    {orders.length === 0 ? (
                      <p className="mt-4 text-sm text-paper/50">No orders yet — place a test order via checkout.</p>
                    ) : (
                      <ul className="mt-4 divide-y divide-paper/8">
                        {orders.slice(0, 5).map((o) => (
                          <li key={o.id} className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-[13px] font-extrabold">{o.id}</p>
                              <p className="text-[11px] text-paper/50">
                                {o.customer.firstName} {o.customer.lastName} · {new Date(o.date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-[13px] font-bold tabular-nums">{formatTHB(o.total)}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-3xl border border-paper/10 bg-cream p-7">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">Catalogue health</h3>
                    <ul className="mt-4 space-y-3">
                      {products
                        .filter((p) => p.inventory <= 20)
                        .slice(0, 5)
                        .map((p) => (
                          <li key={p.id} className="flex items-center justify-between gap-3">
                            <span className="truncate text-[13px] font-bold">{p.name}</span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                p.inventory <= 15 ? "bg-clay/15 text-clay" : "bg-paper/8 text-paper/60"
                              }`}
                            >
                              {p.inventory} left
                            </span>
                          </li>
                        ))}
                      {products.filter((p) => p.inventory <= 20).length === 0 && (
                        <li className="text-sm text-paper/50">Everything is well stocked.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ================= PRODUCTS ================= */}
            {tab === "products" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="label-caps text-paper/45">{products.length} products · stored locally</p>
                  <div className="flex gap-2">
                    <button
                      onClick={resetCatalog}
                      className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-clay hover:text-clay"
                    >
                      <RotateCcw size={13} /> Reset seed
                    </button>
                    <button
                      onClick={() => setEditing(emptyProduct())}
                      className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-clay-deep glow-soft"
                    >
                      <Plus size={14} /> Add product
                    </button>
                  </div>
                </div>

                {/* table (desktop) */}
                <div className="mt-6 hidden overflow-hidden rounded-3xl border border-paper/10 bg-cream md:block">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-paper/10 label-caps text-paper/40">
                        <th className="px-5 py-4 font-bold">Product</th>
                        <th className="px-3 py-4 font-bold">Category</th>
                        <th className="px-3 py-4 font-bold">Price</th>
                        <th className="px-3 py-4 font-bold">Stock</th>
                        <th className="px-3 py-4 font-bold">Flags</th>
                        <th className="px-5 py-4 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-paper/6">
                      {products.map((p) => (
                        <tr key={p.id} className="transition-colors hover:bg-bone/50">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              {p.images[0] && (
                                <img src={p.images[0]} alt="" className="size-11 rounded-lg object-cover" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-extrabold">{p.name}</p>
                                <p className="text-[11px] text-paper/45">{p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-paper/70">{p.category}</td>
                          <td className="px-3 py-3.5 font-bold tabular-nums">{formatTHB(p.price)}</td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                p.inventory <= 15 ? "bg-clay/15 text-clay" : "bg-paper/8 text-paper/60"
                              }`}
                            >
                              {p.inventory}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex gap-1.5">
                              {p.featured && <span className="rounded-full bg-clay px-2 py-0.5 text-[9px] font-bold uppercase text-white">Feat</span>}
                              {p.newArrival && <span className="rounded-full bg-clay-deep px-2 py-0.5 text-[9px] font-bold uppercase text-white">New</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditing({ ...p })}
                                className="grid size-9 place-items-center rounded-full border border-paper/15 transition-colors hover:border-paper/50"
                                aria-label={`Edit ${p.name}`}
                              >
                                <Pencil size={14} />
                              </button>
                              {confirmDelete === p.id ? (
                                <span className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      deleteProduct(p.id);
                                      setConfirmDelete(null);
                                    }}
                                    className="grid size-9 place-items-center rounded-full bg-clay text-white"
                                    aria-label="Confirm delete"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="grid size-9 place-items-center rounded-full border border-paper/15"
                                    aria-label="Cancel delete"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(p.id)}
                                  className="grid size-9 place-items-center rounded-full border border-paper/15 text-paper/50 transition-colors hover:border-clay hover:text-clay"
                                  aria-label={`Delete ${p.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* cards (mobile) */}
                <div className="mt-6 space-y-3 md:hidden">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-paper/10 bg-cream p-4">
                      {p.images[0] && <img src={p.images[0]} alt="" className="size-14 rounded-xl object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-extrabold">{p.name}</p>
                        <p className="text-[11px] text-paper/50">{p.category} · {formatTHB(p.price)} · {p.inventory} in stock</p>
                      </div>
                      <button onClick={() => setEditing({ ...p })} className="grid size-9 place-items-center rounded-full border border-paper/15" aria-label={`Edit ${p.name}`}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="grid size-9 place-items-center rounded-full border border-paper/15 text-clay" aria-label={`Delete ${p.name}`}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= ORDERS ================= */}
            {tab === "orders" && (
              <div>
                {orders.length === 0 ? (
                  <div className="rounded-3xl border border-paper/10 bg-cream p-12 text-center">
                    <ShoppingCart size={28} className="mx-auto text-paper/30" />
                    <p className="mt-4 text-lg font-extrabold uppercase">No orders yet</p>
                    <p className="mt-1 text-sm text-paper/50">
                      Orders placed at checkout appear here (stored locally in the prototype).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <details key={o.id} className="group rounded-3xl border border-paper/10 bg-cream p-6 open:bg-bone/50">
                        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[14px] font-extrabold">{o.id}</p>
                            <p className="text-[11px] text-paper/50">
                              {o.customer.firstName} {o.customer.lastName} · {o.customer.email} ·{" "}
                              {new Date(o.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-clay/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-clay">
                              {o.status}
                            </span>
                            <span className="text-[14px] font-extrabold tabular-nums">{formatTHB(o.total)}</span>
                          </div>
                        </summary>
                        <ul className="mt-5 divide-y divide-paper/8 border-t border-paper/10 pt-2">
                          {o.lines.map((l) => (
                            <li key={`${l.productId}-${l.size}-${l.color}`} className="flex items-center gap-4 py-3">
                              <img src={l.image} alt="" className="size-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <p className="text-[13px] font-bold">{l.name}</p>
                                <p className="text-[11px] text-paper/50">{l.size} · {l.color} · ×{l.qty}</p>
                              </div>
                              <p className="text-[12px] font-bold tabular-nums">{formatTHB(l.price * l.qty)}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-paper/50">
                          <span className="rounded-full bg-paper/6 px-3 py-1">Ship to: {o.customer.address}, {o.customer.city} {o.customer.postcode}, {o.customer.country}</span>
                          <span className="rounded-full bg-paper/6 px-3 py-1">Payment: {o.payment}</span>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= CONTENT ================= */}
            {tab === "content" && <ContentEditor content={content} onSave={saveContent} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= PRODUCT EDITOR ================= */}
      <AnimatePresence>
        {editing && (
          <ProductEditor
            product={editing}
            onChange={setEditing}
            onClose={() => setEditing(null)}
            onSave={(p) => {
              saveProduct({ ...p, slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- product create/edit drawer ---------- */
const ProductEditor: React.FC<{
  product: Product;
  onChange: (p: Product) => void;
  onClose: () => void;
  onSave: (p: Product) => void;
}> = ({ product, onChange, onClose, onSave }) => {
  const input =
    "h-11 w-full rounded-xl border border-paper/15 bg-transparent px-4 text-[13px] text-ink placeholder:text-paper/35 focus:border-clay focus:outline-none";
  const label = "label-caps mb-1.5 block text-paper/45";
  const p = product;
  const set = <K extends keyof Product>(k: K, v: Product[K]) => onChange({ ...p, [k]: v });

  const toggleColor = (name: string) => {
    const has = p.colors.some((c) => c.name === name);
    set("colors", has ? p.colors.filter((c) => c.name !== name) : [...p.colors, COLOR_WAY[name]]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-void/70 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 34 }}
        className="fixed right-0 top-0 z-[205] flex h-full w-full max-w-lg flex-col bg-cream shadow-2xl"
        role="dialog"
        aria-label="Edit product"
      >
        <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5">
          <h2 className="text-lg font-extrabold uppercase tracking-tight">
            {product.name ? "Edit product" : "New product"}
          </h2>
          <button onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-paper/8" aria-label="Close editor">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <div>
            <label className={label} htmlFor="pe-name">Name</label>
            <input id="pe-name" className={input} value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Meridian Oversized Tee" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="pe-cat">Category</label>
              <select id="pe-cat" className={input} value={p.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                {CATEGORIES.map((c) => (
                  <option key={c} className="bg-cream text-ink">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="pe-price">Price (THB)</label>
              <input id="pe-price" type="number" className={input} value={p.price} onChange={(e) => set("price", Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="pe-desc">Description</label>
            <textarea
              id="pe-desc"
              rows={3}
              className="w-full rounded-xl border border-paper/15 bg-transparent px-4 py-3 text-[13px] text-ink focus:border-clay focus:outline-none"
              value={p.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short editorial description…"
            />
          </div>

          <div>
            <label className={label} htmlFor="pe-imgs">Image URLs (one per line)</label>
            <textarea
              id="pe-imgs"
              rows={3}
              className="w-full rounded-xl border border-paper/15 bg-transparent px-4 py-3 text-[13px] text-ink focus:border-clay focus:outline-none"
              value={p.images.join("\n")}
              onChange={(e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              placeholder="https://… (Firebase Storage URLs in production)"
            />
            {p.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {p.images.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="" className="size-12 rounded-lg border border-paper/10 object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="pe-stock">Inventory</label>
              <input id="pe-stock" type="number" className={input} value={p.inventory} onChange={(e) => set("inventory", Number(e.target.value))} />
            </div>
            <div>
              <label className={label} htmlFor="pe-sizes">Sizes (comma separated)</label>
              <input
                id="pe-sizes"
                className={input}
                value={p.sizes.join(", ")}
                onChange={(e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
          </div>

          <div>
            <span className={label}>Colors</span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(COLOR_WAY).map((name) => {
                const active = p.colors.some((c) => c.name === name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[11px] font-bold transition-colors ${
                      active ? "border-clay bg-clay text-white" : "border-paper/15 hover:border-paper/40"
                    }`}
                  >
                    <span className="size-5 rounded-full border border-paper/20" style={{ backgroundColor: COLOR_WAY[name].hex }} />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="pe-mat">Material</label>
              <input id="pe-mat" className={input} value={p.material} onChange={(e) => set("material", e.target.value)} placeholder="100% cotton, 240gsm" />
            </div>
            <div>
              <label className={label} htmlFor="pe-fit">Fit</label>
              <input id="pe-fit" className={input} value={p.fit} onChange={(e) => set("fit", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="pe-tags">Tags (comma separated)</label>
            <input
              id="pe-tags"
              className={input}
              value={p.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </div>

          <div className="flex gap-5 pt-1">
            {(
              [
                ["featured", "Featured"],
                ["newArrival", "New arrival"],
              ] as const
            ).map(([key, lbl]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2.5 text-[13px] font-bold">
                <input
                  type="checkbox"
                  checked={p[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="size-4.5 accent-clay"
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-paper/10 px-6 py-5">
          <button
            onClick={() => onSave(p)}
            disabled={!p.name.trim()}
            className={`h-13 w-full rounded-full text-[12px] font-bold uppercase tracking-[0.18em] transition-all ${
              p.name.trim() ? "bg-clay text-white hover:bg-clay-deep glow-soft" : "cursor-not-allowed bg-paper/10 text-paper/40"
            }`}
          >
            Save product
          </button>
        </div>
      </motion.aside>
    </>
  );
};

/* ---------- content editor ---------- */
const ContentEditor: React.FC<{
  content: ReturnType<typeof useStore>["content"];
  onSave: (c: ReturnType<typeof useStore>["content"]) => void;
}> = ({ content, onSave }) => {
  const [c, setC] = useState(content);
  const area =
    "w-full rounded-xl border border-paper/15 bg-transparent px-4 py-3 text-[13px] text-ink focus:border-clay focus:outline-none";
  const label = "label-caps mb-1.5 block text-paper/45";

  return (
    <div className="max-w-2xl space-y-5">
      <p className="rounded-2xl border border-clay/30 bg-clay/8 p-4 text-[12px] leading-relaxed text-paper/70">
        Edits here update the live site instantly and persist in this browser.
        In production this maps to a Firestore <code>site/content</code> document.
      </p>
      {(
        [
          ["announcement", "Announcement bar"],
          ["heroKicker", "Hero kicker"],
          ["heroTitleA", "Hero title — line 1"],
          ["heroTitleB", "Hero title — line 2 (accent)"],
          ["heroStatement", "Hero statement"],
          ["aboutIntro", "About intro"],
        ] as const
      ).map(([key, lbl]) => (
        <div key={key}>
          <label className={label} htmlFor={`ct-${key}`}>{lbl}</label>
          {key === "heroStatement" || key === "aboutIntro" ? (
            <textarea id={`ct-${key}`} rows={3} className={area} value={c[key]} onChange={(e) => setC({ ...c, [key]: e.target.value })} />
          ) : (
            <input id={`ct-${key}`} className={area} value={c[key]} onChange={(e) => setC({ ...c, [key]: e.target.value })} />
          )}
        </div>
      ))}
      <button
        onClick={() => onSave(c)}
        className="h-13 rounded-full bg-clay px-10 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-clay-deep glow-soft"
      >
        Save content
      </button>
    </div>
  );
};
