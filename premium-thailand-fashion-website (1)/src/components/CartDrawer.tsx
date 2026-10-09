import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useStore } from "../lib/store";
import { formatTHB } from "../data/catalog";
import { useRouter } from "../lib/router";

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, products, setQty, removeFromCart, subtotal } = useStore();
  const { navigate } = useRouter();

  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 120;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[190] bg-void/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="fixed right-0 top-0 z-[195] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            role="dialog"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5">
              <h2 className="flex items-center gap-3 text-lg font-extrabold uppercase tracking-tight">
                <ShoppingBag size={18} />
                Your Bag
                <span className="label-caps text-clay">({cart.reduce((s, l) => s + l.qty, 0)})</span>
              </h2>
              <button
                onClick={closeCart}
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-paper/8"
                aria-label="Close bag"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-paper/6">
                    <ShoppingBag size={24} className="text-paper/40" />
                  </div>
                  <p className="text-lg font-bold">Your bag is empty</p>
                  <p className="max-w-[26ch] text-sm text-paper/60">
                    Fill it with things worth keeping.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate({ name: "shop" });
                    }}
                    className="mt-2 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:scale-[1.03] glow-soft"
                  >
                    Shop the collection <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-paper/8">
                  <AnimatePresence initial={false}>
                    {cart.map((line) => {
                      const p = products.find((p) => p.id === line.productId);
                      if (!p) return null;
                      return (
                        <motion.li
                          key={`${line.productId}-${line.size}-${line.color}`}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4 py-5"
                        >
                          <div className="size-24 shrink-0 overflow-hidden rounded-xl border border-paper/8 bg-bone">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-[13px] font-bold uppercase tracking-wide">{p.name}</p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-paper/50">
                                  {line.size} · {line.color}
                                </p>
                              </div>
                              <p className="text-[13px] font-bold tabular-nums">
                                {formatTHB(p.price * line.qty)}
                              </p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center rounded-full border border-paper/15">
                                <button
                                  onClick={() => setQty(line.productId, line.size, line.color, line.qty - 1)}
                                  className="grid size-8 place-items-center rounded-full transition-colors hover:bg-paper/8"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-6 text-center text-[13px] font-bold tabular-nums">
                                  {line.qty}
                                </span>
                                <button
                                  onClick={() => setQty(line.productId, line.size, line.color, line.qty + 1)}
                                  className="grid size-8 place-items-center rounded-full transition-colors hover:bg-paper/8"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(line.productId, line.size, line.color)}
                                className="grid size-8 place-items-center rounded-full text-paper/40 transition-colors hover:bg-clay/15 hover:text-clay"
                                aria-label={`Remove ${p.name} from bag`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-paper/10 bg-bone px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span className="text-paper/60">Subtotal</span>
                  <span className="font-bold tabular-nums">{formatTHB(subtotal)}</span>
                </div>
                <div className="mt-1.5 flex justify-between text-sm">
                  <span className="text-paper/60">Shipping</span>
                  <span className="font-bold tabular-nums">
                    {shipping === 0 ? "Free" : formatTHB(shipping)}
                  </span>
                </div>
                <div className="mt-3 flex justify-between border-t border-paper/10 pt-3 text-base font-extrabold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatTHB(subtotal + shipping)}</span>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate({ name: "checkout" });
                  }}
                  className="group mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-clay py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-clay-deep glow-strong"
                >
                  Checkout
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
                <p className="mt-3 text-center text-[11px] text-paper/45">
                  Complimentary shipping in Thailand over THB 2,000
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
