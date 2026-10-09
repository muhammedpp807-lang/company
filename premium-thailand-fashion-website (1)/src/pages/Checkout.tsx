import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, ShoppingBag, Check, Package, Trash2 } from "lucide-react";
import { useStore, type Order } from "../lib/store";
import { useRouter } from "../lib/router";
import { formatTHB } from "../data/catalog";
import { Reveal } from "../components/Reveal";

/* ============================================================
   Checkout — customer info, shipping, order summary and a
   payment section that is architecture-ready (no real gateway).
   ============================================================ */

const inputCls =
  "h-13 w-full rounded-2xl border border-paper/15 bg-transparent px-5 text-sm text-ink placeholder:text-paper/35 focus:border-clay focus:outline-none";

export const Checkout: React.FC = () => {
  const { cart, products, subtotal, placeOrder, removeFromCart } = useStore();
  const { navigate } = useRouter();
  const [placed, setPlaced] = useState<Order | null>(null);
  const [payment, setPayment] = useState("Bank transfer");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Bangkok",
    postcode: "",
    country: "Thailand",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 120;
  const canPlace =
    cart.length > 0 &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.includes("@") &&
    form.phone.trim() &&
    form.address.trim() &&
    form.postcode.trim();

  const confirm = () => {
    if (!canPlace) return;
    const order = placeOrder(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
      },
      payment
    );
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  /* ---------- confirmation ---------- */
  if (placed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 pb-24 pt-36 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid size-20 place-items-center rounded-full bg-clay text-white glow-strong"
        >
          <Check size={34} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="label-caps mt-8 text-clay">Order {placed.id}</p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
            Thank you, {placed.customer.firstName}.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/60">
            Your order is confirmed and being prepared in Bangkok. A confirmation
            email is on its way to <strong>{placed.customer.email}</strong>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 w-full rounded-3xl border border-paper/10 bg-cream/60 p-7 text-left"
        >
          <div className="flex items-center justify-between">
            <p className="label-caps text-paper/50">Summary</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-clay px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              <Package size={11} /> {placed.status}
            </span>
          </div>
          <ul className="mt-4 divide-y divide-paper/8">
            {placed.lines.map((l) => (
              <li key={`${l.productId}-${l.size}-${l.color}`} className="flex items-center gap-4 py-3.5">
                <img src={l.image} alt={l.name} className="size-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold uppercase">{l.name}</p>
                  <p className="text-[11px] text-paper/50">
                    {l.size} · {l.color} · ×{l.qty}
                  </p>
                </div>
                <p className="text-[13px] font-bold tabular-nums">{formatTHB(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-paper/10 pt-4 text-sm">
            <div className="flex justify-between text-paper/60">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatTHB(placed.subtotal)}</span>
            </div>
            <div className="flex justify-between text-paper/60">
              <span>Shipping</span>
              <span className="tabular-nums">{placed.shipping === 0 ? "Free" : formatTHB(placed.shipping)}</span>
            </div>
            <div className="flex justify-between pt-1.5 text-base font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">{formatTHB(placed.total)}</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate({ name: "shop" })}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-clay-deep glow-soft"
        >
          Continue shopping
          <ArrowLeft size={15} className="rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
    );
  }

  /* ---------- empty cart ---------- */
  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-5 px-5 pt-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-paper/6">
          <ShoppingBag size={24} className="text-paper/40" />
        </div>
        <h1 className="text-3xl font-extrabold uppercase">Your bag is empty</h1>
        <p className="text-sm text-paper/55">Add something worth keeping before checking out.</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-2 rounded-full bg-clay px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-clay-deep glow-soft"
        >
          Shop the collection
        </button>
      </div>
    );
  }

  /* ---------- checkout form ---------- */
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <Reveal y={16}>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-paper/50 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Continue shopping
        </button>
        <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold uppercase leading-none tracking-tight">
          Checkout.
        </h1>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_1fr]">
        {/* form */}
        <div className="space-y-10">
          <section>
            <h2 className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-wide">
              <span className="grid size-7 place-items-center rounded-full bg-clay text-[11px] text-white glow-soft">1</span>
              Customer information
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input aria-label="First name" placeholder="First name" value={form.firstName} onChange={set("firstName")} className={inputCls} />
              <input aria-label="Last name" placeholder="Last name" value={form.lastName} onChange={set("lastName")} className={inputCls} />
              <input aria-label="Email" type="email" placeholder="Email address" value={form.email} onChange={set("email")} className={inputCls} />
              <input aria-label="Phone" type="tel" placeholder="Phone number" value={form.phone} onChange={set("phone")} className={inputCls} />
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-wide">
              <span className="grid size-7 place-items-center rounded-full bg-clay text-[11px] text-white glow-soft">2</span>
              Shipping address
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input aria-label="Street address" placeholder="Street address" value={form.address} onChange={set("address")} className={inputCls} />
              </div>
              <input aria-label="City" placeholder="City" value={form.city} onChange={set("city")} className={inputCls} />
              <input aria-label="Postcode" placeholder="Postcode" value={form.postcode} onChange={set("postcode")} className={inputCls} />
              <div className="sm:col-span-2">
                <input aria-label="Country" placeholder="Country" value={form.country} onChange={set("country")} className={inputCls} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-wide">
              <span className="grid size-7 place-items-center rounded-full bg-clay text-[11px] text-white glow-soft">3</span>
              Payment
            </h2>
            {/* PAYMENT ARCHITECTURE READY — connect a gateway provider here.
                No real payment provider is named or wired in this prototype. */}
            <div className="mt-5 space-y-3">
              {["Bank transfer", "Cash on delivery"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  aria-pressed={payment === m}
                  className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all ${
                    payment === m ? "border-clay bg-clay/10 glow-soft" : "border-paper/15 hover:border-paper/40"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`grid size-5 place-items-center rounded-full border-2 ${
                        payment === m ? "border-clay" : "border-paper/30"
                      }`}
                    >
                      {payment === m && <span className="size-2.5 rounded-full bg-clay" />}
                    </span>
                    <span className="text-sm font-bold">{m}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    {m === "Bank transfer" ? "Details after order" : "Pay at your door"}
                  </span>
                </button>
              ))}
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-paper/20 p-5 text-paper/45">
                <Lock size={15} />
                <p className="text-[12px] leading-relaxed">
                  Card payments are coming soon — the checkout is built to accept a
                  payment provider without further changes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-paper/10 bg-cream/60 p-7">
            <h2 className="text-sm font-extrabold uppercase tracking-wide">Your order</h2>
            <ul className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {cart.map((l) => {
                  const p = products.find((p) => p.id === l.productId);
                  if (!p) return null;
                  return (
                    <motion.li
                      key={`${l.productId}-${l.size}-${l.color}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative shrink-0">
                        <img src={p.images[0]} alt={p.name} className="size-16 rounded-xl object-cover" />
                        <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-clay text-[10px] font-bold text-white">
                          {l.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-extrabold uppercase">{p.name}</p>
                        <p className="text-[11px] text-paper/50">{l.size} · {l.color}</p>
                      </div>
                      <p className="text-[12px] font-bold tabular-nums">{formatTHB(p.price * l.qty)}</p>
                      <button
                        onClick={() => removeFromCart(l.productId, l.size, l.color)}
                        className="text-paper/30 transition-colors hover:text-clay"
                        aria-label={`Remove ${p.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className="mt-6 space-y-2 border-t border-paper/10 pt-5 text-sm">
              <div className="flex justify-between text-paper/60">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatTHB(subtotal)}</span>
              </div>
              <div className="flex justify-between text-paper/60">
                <span>Shipping</span>
                <span className="tabular-nums">{shipping === 0 ? "Free" : formatTHB(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold">
                <span>Total</span>
                <span className="tabular-nums">{formatTHB(subtotal + shipping)}</span>
              </div>
            </div>

            <button
              onClick={confirm}
              disabled={!canPlace}
              className={`mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-full text-[12px] font-bold uppercase tracking-[0.18em] transition-all ${
                canPlace
                  ? "bg-clay text-white hover:shadow-[0_14px_44px_rgba(91,127,255,0.55)] glow-soft"
                  : "cursor-not-allowed bg-paper/10 text-paper/40"
              }`}
            >
              <Lock size={14} />
              Place order — {formatTHB(subtotal + shipping)}
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-paper/40">
              Prototype checkout — no real payment is processed
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
