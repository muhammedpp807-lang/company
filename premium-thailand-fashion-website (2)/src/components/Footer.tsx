import React, { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { DawnMark } from "./Logo";
import { useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import type { Route } from "../lib/router";

/* Brand icons (lucide no longer ships brand marks) */
const InstagramIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const TikTokIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 3c.4 2.1 1.8 3.6 4 3.9v3c-1.6 0-3-.5-4-1.3v6.1c0 3.6-2.4 5.9-5.6 5.9-3 0-5.4-2.3-5.4-5.3 0-3.2 2.7-5.5 6-5.2v3.1c-1.6-.3-3 .7-3 2.1 0 1.3 1.1 2.3 2.4 2.3 1.5 0 2.6-1.1 2.6-3V3h3z" />
  </svg>
);

/* ============================================================
   Footer — big editorial wordmark, navigation, socials,
   newsletter + company info (placeholder data, clearly marked).
   ============================================================ */

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { showToast } = useStore();
  const [email, setEmail] = useState("");

  const links: { label: string; route: Route }[] = [
    { label: "Shop", route: { name: "shop" } },
    { label: "Collections", route: { name: "shop", category: "New Season" } },
    { label: "Lookbook", route: { name: "lookbook" } },
    { label: "About", route: { name: "about" } },
    { label: "Contact", route: { name: "contact" } },
    { label: "Admin", route: { name: "admin" } },
  ];

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    showToast("Welcome to the list — the next drop is coming.");
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-void text-paper noise">
      {/* glow accents */}
      <div className="pointer-events-none absolute -left-40 top-10 size-[420px] rounded-full bg-clay/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[380px] rounded-full bg-clay/10 blur-[130px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        {/* newsletter */}
        <div className="flex flex-col gap-8 border-b border-paper/10 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-paper/50">The Drop List</p>
            <h3 className="mt-3 max-w-md text-2xl font-extrabold uppercase leading-tight tracking-tight md:text-3xl">
              First access to every drop
            </h3>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-13 w-full rounded-full border border-paper/20 bg-paper/5 px-6 text-sm text-paper placeholder:text-paper/35 focus:border-clay focus:outline-none"
            />
            <button
              type="submit"
              className="group grid size-13 shrink-0 place-items-center rounded-full bg-clay text-paper transition-transform hover:scale-105"
              aria-label="Subscribe"
            >
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>

        {/* link columns */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg border border-paper/15 bg-paper/5">
                <DawnMark size={20} />
              </span>
              <span className="text-[19px] font-extrabold uppercase tracking-[0.06em]">TOMSTILL®</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
              {/* PLACEHOLDER BRAND COPY — replace with final brand statement */}
              A streetwear house for kids and boys, aged 2–13Y. Heavyweight
              tees, varsity jackets and cargos — stocked in store and shipped
              worldwide.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: TikTokIcon, label: "TikTok" },
                { icon: (p: { size?: number }) => <Mail size={p.size} />, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href={label === "Email" ? "mailto:hello@tomstill-studio.com" : "#/"}
                  onClick={(e) => {
                    if (label !== "Email") e.preventDefault();
                    if (label === "Email") return;
                    showToast(`${label} — placeholder link, connect your real account`);
                  }}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-paper/15 text-paper/70 transition-all hover:border-clay hover:bg-clay hover:text-paper"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="label-caps text-paper/40">Menu</p>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.route)}
                    className="group text-sm font-semibold text-paper/70 transition-colors hover:text-paper"
                  >
                    <span className="mr-2 inline-block h-px w-0 bg-clay align-middle transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-caps text-paper/40">Visit</p>
            <ul className="mt-5 space-y-4 text-sm text-paper/70">
              {/* PLACEHOLDER COMPANY INFO — replace with real business details */}
              <li className="flex gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-clay" />
                <span>
                  TOMSTILL Studio
                  <br />
                  12 Avinashi Road
                  <br />
                  Tirupur 641604, India
                </span>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-clay" />
                <a href="mailto:hello@tomstill-studio.com" className="transition-colors hover:text-paper">
                  hello@tomstill-studio.com
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-clay" />
                <span>+91 (0) 421 000 0000</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-paper/40">Studio Hours</p>
            <ul className="mt-5 space-y-3 text-sm text-paper/70">
              <li className="flex justify-between border-b border-paper/10 pb-2.5">
                <span>Mon — Fri</span>
                <span>10:00 — 19:00</span>
              </li>
              <li className="flex justify-between border-b border-paper/10 pb-2.5">
                <span>Saturday</span>
                <span>11:00 — 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-paper/40">Closed</span>
              </li>
            </ul>
            <p className="mt-5 rounded-xl border border-clay/25 bg-clay/10 p-3.5 text-[11px] leading-relaxed text-paper/60">
              Placeholder information for prototype — swap in real business details
              before launch.
            </p>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="select-none overflow-hidden border-t border-paper/10 pt-10" aria-hidden="true">
          <p className="text-center text-[clamp(3.4rem,13vw,11rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-paper/[0.07]">
            TOMSTILL®
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-paper/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-paper/35 md:flex-row">
          <p>© 2026 TOMSTILL Kids &amp; Boys — Tirupur</p>
          <p>Stocked in store · Worn on the street</p>
        </div>
      </div>
    </footer>
  );
};
