import React, { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useStore } from "../lib/store";
import { Reveal } from "../components/Reveal";

/* ============================================================
   Contact — placeholder company details, clearly marked for
   replacement with real business information before launch.
   ============================================================ */

export const Contact: React.FC = () => {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast("Message sent — we reply within one working day.");
  };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const inputCls =
    "h-13 w-full rounded-2xl border border-paper/15 bg-transparent px-5 text-sm text-ink placeholder:text-paper/35 focus:border-clay focus:outline-none";

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-clay/70" />
          <p className="label-caps text-clay">Say hello</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-5 text-[clamp(2.8rem,7vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]">
          Contact <span className="text-clay">the studio.</span>
        </h1>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
        {/* info */}
        <div className="space-y-4">
          {[
            {
              icon: MapPin,
              label: "Studio & Flagship",
              lines: ["88 Sukhumvit Soi 31", "Bangkok 10110, Thailand"],
              note: "PLACEHOLDER ADDRESS — replace with real location",
            },
            {
              icon: Mail,
              label: "Email",
              lines: ["hello@tomstill-studio.com", "press@tomstill-studio.com"],
              note: "PLACEHOLDER EMAILS",
            },
            {
              icon: Phone,
              label: "Phone",
              lines: ["+66 (0) 2 000 0000"],
              note: "PLACEHOLDER NUMBER",
            },
            {
              icon: Clock,
              label: "Hours",
              lines: ["Mon–Fri 10:00–19:00", "Sat 11:00–18:00 · Sun closed"],
              note: "",
            },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.07}>
              <div className="group rounded-3xl border border-paper/10 bg-cream/60 p-6 transition-all duration-300 hover:border-clay/40 hover:shadow-[0_16px_50px_rgba(91,127,255,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-paper/12 bg-clay/15 text-clay transition-colors group-hover:bg-clay group-hover:text-white">
                    <item.icon size={16} />
                  </span>
                  <p className="label-caps text-paper/50">{item.label}</p>
                </div>
                {item.lines.map((l) => (
                  <p key={l} className="mt-2.5 text-[15px] font-bold">{l}</p>
                ))}
                {item.note && <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-clay/80">{item.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>

        {/* form */}
        <Reveal delay={0.1}>
          {sent ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-paper/10 bg-cream/60 p-10 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-clay/15 text-3xl text-clay">✓</span>
              <h2 className="text-2xl font-extrabold uppercase">Message received</h2>
              <p className="max-w-sm text-sm text-paper/55">
                Thank you, {form.name.split(" ")[0] || "friend"} — the studio replies
                within one working day.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", topic: "General", message: "" });
                }}
                className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-clay underline-offset-4 hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl border border-paper/10 bg-cream/60 p-7 md:p-9">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="label-caps mb-2 block text-paper/50">Name</label>
                  <input id="c-name" required value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="c-email" className="label-caps mb-2 block text-paper/50">Email</label>
                  <input id="c-email" type="email" required value={form.email} onChange={set("email")} placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="c-topic" className="label-caps mb-2 block text-paper/50">Topic</label>
                <select id="c-topic" value={form.topic} onChange={set("topic")} className={`${inputCls} appearance-none`}>
                  {["General", "Order support", "Sizing help", "Press", "Wholesale"].map((t) => (
                    <option key={t} className="bg-cream text-ink">{t}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="c-msg" className="label-caps mb-2 block text-paper/50">Message</label>
                <textarea
                  id="c-msg"
                  required
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us everything…"
                  className="w-full rounded-2xl border border-paper/15 bg-transparent px-5 py-4 text-sm text-ink placeholder:text-paper/35 focus:border-clay focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="group mt-6 inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-clay text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-clay-deep glow-soft sm:w-auto sm:px-10"
              >
                Send message
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
};
