import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Check, MapPin, MessageCircle, Send } from "lucide-react";
import { BIZ, SHOW_PRODUCTS, type ShowProduct } from "./products";

gsap.registerPlugin(ScrollTrigger);

/* ---------- storyboard timings (11 scenes, 0 → 100%) ---------- */
const PROD_START = 0.42, PROD_END = 0.7, PROD_W = (PROD_END - PROD_START) / 6;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const mix = (p: number, a: number, b: number, f: number, t: number) => f + (t - f) * seg(p, a, b);

type Scene = {
  n: string; kicker: string; title: React.ReactNode; body: string;
  side: "left" | "right"; image: string; caption: string;
};

const SCENES: Scene[] = [
  { n: "01", kicker: "Showroom film / exterior", title: <>STREETWEAR<br />FOR EVERY STORE.</>, body: "A TOMSTILL kids & boys house — heavyweight pieces built for the street and sized 2–13Y.", side: "left", image: "images/exterior.jpg", caption: "00:00 — Wide street plate. Gold spill, red moon, wet asphalt holding the light." },
  { n: "02", kicker: "Approach / glass facade", title: <>THE HOUSE<br />OF TOMSTILL.</>, body: "The sign wakes first: gold TOMSTILL, then KIDS & BOYS underneath it.", side: "left", image: "images/facade.jpg", caption: "00:09 — Push in on the facade. Lettering illuminates as the glass fills the frame." },
  { n: "03", kicker: "Threshold / entrance", title: <>STEP<br />INSIDE.</>, body: "Doors part, the street falls away, and the floor takes over.", side: "right", image: "images/doors.jpg", caption: "00:17 — Camera descends and passes through the glass doors." },
  { n: "04", kicker: "Interior / power on", title: <>BUILT<br />TO STOCK.</>, body: "Concrete, rails, counter — ceiling grid igniting in a wave across the room.", side: "left", image: "images/interior.jpg", caption: "00:26 — Lights activate left to right, revealing the full interior." },
  { n: "05", kicker: "Rails / collection", title: <>RAIL<br />AFTER RAIL.</>, body: "Varsity, hoodies, tees, cargos — the full TOMSTILL run on one continuous rail.", side: "right", image: "images/rails.jpg", caption: "00:34 — Glide along the rail. Hangers settle, fabric catches the key light." },
  { n: "09", kicker: "Boys line / display", title: <>BIG STYLE.<br />SMALL SIZES.</>, body: "Five looks, five spotlights — the boys line staged exactly as it ships.", side: "left", image: "images/boys.jpg", caption: "00:70 — Pan across the boys display. Each outfit rises into its own pool of light." },
  { n: "10", kicker: "Counter / where to find us", title: <>ONE COUNTER.<br />ONE COLLECTION.</>, body: "Every verified TOMSTILL location, with directions that actually open.", side: "left", image: "images/counter.jpg", caption: "00:84 — Settle on the counter. Business details and routes on screen." },
  { n: "11", kicker: "Finale / wholesale", title: <>STOCK<br />THE STREET.</>, body: "Tell us your store, your age bands and your volumes — we answer with terms and lead times.", side: "left", image: "images/finale.jpg", caption: "01:00 — Pull back through the entrance to the street. Wholesale desk opens." },
];

/* ---------- one product scene ---------- */
function ProductStage({ p, i, onEnquire }: { p: ShowProduct; i: number; onEnquire: () => void }) {
  const [color, setColor] = useState(p.colors[0]);
  return <motion.div className="prod" key={p.id} initial={{ opacity: 0, x: 90, rotateY: -14, scale: .92 }} animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }} exit={{ opacity: 0, x: -70, rotateY: 12, scale: .94 }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }}>
    <div className="prod-visual"><span className="prod-hanger" aria-hidden="true" /><img src={p.image} alt={`${p.name} — ${p.category} by TOMSTILL`} draggable={false} /><span className="prod-index label">{String(i + 1).padStart(2, "0")} / 06</span></div>
    <div className="prod-panel">
      <p className="label label-dash">{p.category} · {p.spec}</p>
      <h3>{p.name}</h3>
      <p className="prod-desc">{p.description}</p>
      <div className="prod-meta">
        <div><span className="label">Size</span><p>{p.sizes}</p></div>
        <div><span className="label">Price</span><p>{p.price.toLocaleString("en-US")} THB</p></div>
        <div><span className="label">Note</span><p>{p.priceNote}</p></div>
      </div>
      <div className="prod-colors"><span className="label">Colourway</span><div>{p.colors.map(c => <button key={c} className={color === c ? "on" : ""} aria-pressed={color === c} onClick={() => setColor(c)}>{c}</button>)}</div></div>
      <div className="prod-ctas">
        <button className="sw-btn sw-btn--gold" onClick={onEnquire}><Send size={14} /> Wholesale enquiry</button>
        <a className="sw-btn sw-btn--ghost" href={BIZ.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
      </div>
    </div>
  </motion.div>;
}

/* ---------- finale wholesale form (opens a real, addressed email) ---------- */
function EnquiryForm() {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ store: "", name: "", email: "", city: "", bands: "2–13Y", qty: "", note: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Store: ${f.store}\nContact: ${f.name}\nEmail: ${f.email}\nCity: ${f.city}\nAge bands: ${f.bands}\nEstimated quantity: ${f.qty}\n\n${f.note}`;
    window.location.href = `mailto:${BIZ.email}?subject=${encodeURIComponent("Wholesale enquiry — TOMSTILL kids & boys")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  if (sent) return <div className="sw-sent"><Check size={22} /><h3>Enquiry ready.</h3><p>Your mail app should be open with the details addressed to {BIZ.email}. If nothing opened, write to us directly — the address is one tap away.</p><a className="sw-btn sw-btn--gold" href={`mailto:${BIZ.email}`}>{BIZ.email}</a></div>;
  return <form className="sw-form" onSubmit={submit}>
    <div className="sw-field"><label htmlFor="q-store">Store / company</label><input id="q-store" required value={f.store} onChange={set("store")} placeholder="Your store name" /></div>
    <div className="sw-field"><label htmlFor="q-name">Contact name</label><input id="q-name" required value={f.name} onChange={set("name")} placeholder="Full name" /></div>
    <div className="sw-field"><label htmlFor="q-email">Email</label><input id="q-email" type="email" required value={f.email} onChange={set("email")} placeholder="buyer@store.com" /></div>
    <div className="sw-field"><label htmlFor="q-city">City</label><input id="q-city" required value={f.city} onChange={set("city")} placeholder="City" /></div>
    <div className="sw-field"><label htmlFor="q-bands">Age bands</label><select id="q-bands" value={f.bands} onChange={set("bands")}><option>2–13Y</option><option>2–5Y</option><option>6–9Y</option><option>10–13Y</option></select></div>
    <div className="sw-field"><label htmlFor="q-qty">Est. quantity</label><input id="q-qty" value={f.qty} onChange={set("qty")} placeholder="e.g. 120 pcs / style" /></div>
    <div className="sw-field sw-field--full"><label htmlFor="q-note">What are you looking for?</label><textarea id="q-note" rows={3} value={f.note} onChange={set("note")} placeholder="Styles, colours, delivery window" /></div>
    <button type="submit" className="sw-btn sw-btn--gold sw-btn--wide"><Send size={14} /> Send wholesale enquiry</button>
    <p className="sw-form-note">Opens your mail app addressed to {BIZ.email}. No data is stored on this page.</p>
  </form>;
}

export default function Showroom({ go }: { go?: (p: "shop" | "lookbook" | "about" | "contact") => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [prodIdx, setProdIdx] = useState(-1);
  const [staticMode, setStaticMode] = useState(false);

  /* reduced motion → static stacked journey (same scene order, no scrub) */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setStaticMode(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ---------- scroll-controlled camera ---------- */
  useEffect(() => {
    if (staticMode) return;
    const el = wrapRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
      const [ext, fac, doo, itl, rail, boys, cnt, fin] = [
        q(".L-exterior")[0], q(".L-facade")[0], q(".L-doors")[0], q(".L-interior")[0],
        q(".L-rails")[0], q(".L-boys")[0], q(".L-counter")[0], q(".L-finale")[0],
      ].map(x => x as HTMLElement | undefined);
      const sign = q(".sw-sign")[0] as HTMLElement | undefined;
      const bar = q(".sw-progress i")[0] as HTMLElement | undefined;
      const readout = q(".sw-readout")[0] as HTMLElement | undefined;

      ScrollTrigger.create({
        trigger: el, start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          const set2 = (n?: HTMLElement, o?: number, t?: string) => { if (!n) return; if (o !== undefined) n.style.opacity = String(o); if (t) n.style.transform = t; };
          /* exterior — slow push in, then released */
          set2(ext, 1 - seg(p, .2, .27), `scale(${mix(p, 0, .27, 1.04, 1.62)}) translateY(${mix(p, 0, .27, 0, -7)}%)`);
          /* facade */
          set2(fac, seg(p, .09, .13) * (1 - seg(p, .22, .26)), `scale(${mix(p, .09, .26, 1.14, 1.5)}) translateY(${mix(p, .09, .26, 2, -4)}%)`);
          /* sign illumination ramp (scene 2) */
          if (sign) sign.style.setProperty("--lit", String(seg(p, .1, .17)));
          /* doors */
          set2(doo, seg(p, .17, .2) * (1 - seg(p, .25, .3)), `scale(${mix(p, .17, .3, 1.02, 1.55)})`);
          /* interior */
          const inProd = seg(p, .41, .45) * (1 - seg(p, .66, .7));
          set2(itl, seg(p, .26, .3) * (1 - seg(p, .4, .44)), `scale(${mix(p, .26, .44, 1.3, 1.04)}) translateY(${mix(p, .26, .44, 4, 0)}%)`);
          /* rails — blurred behind the products */
          set2(rail, seg(p, .34, .38) * (1 - seg(p, .7, .74)) * (1 - .55 * inProd), `scale(${mix(p, .34, .74, 1.22, 1.02)}) translateX(${mix(p, .34, .74, 6, -6)}%)`);
          if (rail) rail.style.filter = `blur(${(11 * inProd).toFixed(1)}px) brightness(${(1 - .35 * inProd).toFixed(2)})`;
          /* boys display */
          set2(boys, seg(p, .7, .74) * (1 - seg(p, .82, .86)), `scale(${mix(p, .7, .86, 1.24, 1.04)}) translateX(${mix(p, .7, .86, -4, 3)}%)`);
          /* counter */
          set2(cnt, seg(p, .84, .875) * (1 - seg(p, .915, .945)), `scale(${mix(p, .84, .945, 1.18, 1.05)})`);
          /* finale — pull away to the street */
          set2(fin, seg(p, .92, .955), `scale(${mix(p, .92, 1, 1.42, 1.06)}) translateY(${mix(p, .92, 1, 3, 0)}%)`);
          /* HUD */
          if (bar) bar.style.transform = `scaleX(${p})`;
          if (readout) readout.textContent = `${Math.round(p * 100)}%`;
          const prod = p >= PROD_START && p < PROD_END;
          const pi = prod ? Math.min(5, Math.floor((p - PROD_START) / PROD_W)) : -1;
          setProdIdx(pi);
          /* SCENES index: 0–4 street→rails · -1 product run · 5 boys · 6 counter · 7 finale */
          let s: number;
          if (p < .09) s = 0; else if (p < .17) s = 1; else if (p < .26) s = 2; else if (p < .34) s = 3;
          else if (p < .42) s = 4; else if (p < .7) s = -1; else if (p < .84) s = 5; else if (p < .92) s = 6; else s = 7;
          setScene(s);
        },
      });
      ScrollTrigger.refresh();
    }, el);
    /* images settle after load — keep trigger measurements accurate */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => { window.removeEventListener("load", onLoad); clearTimeout(t); ctx.revert(); };
  }, [staticMode]);

  const active = SCENES[Math.max(0, Math.min(SCENES.length - 1, scene))] ?? SCENES[0];
  /* storyboard stops: 01·02·03·04·05 · 06 (products) · 09 · 10 · 11 */
  const RAIL = [0, .09, .17, .26, .34, .42, .7, .84, .92];
  const RAIL_LABEL = ["01", "02", "03", "04", "05", "06", "09", "10", "11"];
  const railActive = scene === -1 ? 5 : scene <= 4 ? scene : scene === 5 ? 6 : scene === 6 ? 7 : 8;
  const jumpProgress = (q: number) => {
    const el = wrapRef.current; if (!el) return;
    const top = el.offsetTop + q * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };
  const product = prodIdx >= 0 ? SHOW_PRODUCTS[prodIdx] : null;
  const location = useMemo(() => ({
    city: `${BIZ.city}, ${BIZ.country}`,
    directions: BIZ.directions,
    email: BIZ.email,
    whatsapp: BIZ.whatsapp,
    site: BIZ.site,
  }), []);

  /* ---------------- static fallback (reduced motion) ---------------- */
  if (staticMode) return (
    <div className="sw sw--static">
      {SCENES.map((s, i) => <section key={s.n} className="sw-static-scene">
        <img className="sw-static-img" src={s.image} alt={`TOMSTILL showroom scene ${s.n}`} loading="lazy" />
        <div className={`sw-static-copy ${s.side === "right" ? "right" : ""}`}>
          <p className="label label-dash">{s.n} / {s.kicker}</p>
          <h2>{s.title}</h2><p>{s.body}</p>
          {i === 6 && <div className="sw-loc"><MapPin size={16} /><div><strong>{location.city}</strong><a href={location.directions} target="_blank" rel="noreferrer">Get directions</a></div></div>}
        </div>
      </section>)}
      <section className="sw-static-scene sw-static-form"><h2>STOCK<br />THE STREET.</h2><EnquiryForm /></section>
    </div>
  );

  return (
    <div className="sw" ref={wrapRef}>
      <div className="sw-stage">
        {/* ---- camera plates ---- */}
        <div className="L L-exterior"><img src="images/exterior.jpg" alt="TOMSTILL storefront at night with red moon" fetchPriority="high" /></div>
        <div className="L L-facade"><img src="images/facade.jpg" alt="TOMSTILL glass facade" /></div>
        <div className="L L-doors"><img src="images/doors.jpg" alt="Entrance doors of the TOMSTILL showroom" /></div>
        <div className="L L-interior"><img src="images/interior.jpg" alt="TOMSTILL showroom interior" /><div className="L-grid" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 60}ms` }} />)}</div></div>
        <div className="L L-rails"><img src="images/rails.jpg" alt="Clothing rail inside the showroom" /></div>
        <div className="L L-boys"><img src="images/boys.jpg" alt="Boys collection display" /><div className="L-spots" aria-hidden="true" /></div>
        <div className="L L-counter"><img src="images/counter.jpg" alt="Showroom counter" /></div>
        <div className="L L-finale"><img src="images/finale.jpg" alt="TOMSTILL storefront from across the street" /></div>

        <div className="sw-vignette" aria-hidden="true" />
        <div className="sw-grain" aria-hidden="true" />
        <div className="sw-leaves" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ left: `${8 + i * 10}%`, animationDelay: `${i * 1.7}s`, animationDuration: `${9 + (i % 4) * 2}s` }} />)}</div>

        {/* ---- illuminated sign (scenes 1–2) ---- */}
        <div className="sw-sign" aria-hidden="true"><span className="sw-sign-main">TOMSTILL</span><span className="sw-sign-sub">KIDS &amp; BOYS</span></div>

        {/* ---- HUD ---- */}
        <div className="sw-top">
          <span className="label">Scene {active.n} / 11</span>
          <span className="label sw-readout">0%</span>
        </div>
        <div className="sw-progress" aria-hidden="true"><i /></div>
        <nav className="sw-rail" aria-label="Scene navigation">
          {RAIL.map((q, i) => <button key={q} onClick={() => jumpProgress(q)} aria-label={`Jump to storyboard scene ${RAIL_LABEL[i]}`} className={railActive === i ? "on" : ""}><span>{RAIL_LABEL[i]}</span></button>)}
        </nav>

        {/* ---- scene copy ---- */}
        <AnimatePresence mode="wait">
          {prodIdx < 0 && <motion.div key={active.n + scene} className={`sw-copy ${active.side === "right" ? "right" : ""} ${scene === 7 ? "sw-copy--final" : ""}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -26 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
            <p className="label label-dash">{active.n} / {active.kicker}</p>
            <h2>{active.title}</h2>
            <p className="sw-body">{active.body}</p>
            {scene === 6 && <div className="sw-loc">
              <div><span className="label">Verified location</span><strong>{location.city}</strong><a href={location.directions} target="_blank" rel="noreferrer">Get directions <ArrowRight size={13} /></a></div>
              <div><span className="label">Wholesale desk</span><strong>{location.email}</strong><a href={`mailto:${location.email}`}>Write to us <ArrowRight size={13} /></a></div>
              <div><span className="label">Direct</span><strong>WhatsApp</strong><a href={location.whatsapp} target="_blank" rel="noreferrer">Open chat <ArrowRight size={13} /></a></div>
            </div>}
            {scene === 7 && <div className="sw-final">
              <div className="sw-final-left">
                <h3>Ready to stock?</h3>
                <EnquiryForm />
              </div>
              <div className="sw-final-right">
                <a className="sw-btn sw-btn--gold" href={BIZ.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp the studio</a>
                <a className="sw-btn sw-btn--ghost" href={`mailto:${BIZ.email}`}>{BIZ.email}</a>
                <a className="sw-btn sw-btn--ghost" href={BIZ.site} target="_blank" rel="noreferrer">tomstill-studio.com</a>
                <ul className="sw-foot-links">
                  <li><button onClick={() => go?.("shop")}>Shop the catalogue</button></li>
                  <li><button onClick={() => go?.("lookbook")}>Lookbook</button></li>
                  <li><button onClick={() => go?.("about")}>About TOMSTILL</button></li>
                  <li><button onClick={() => go?.("contact")}>Contact</button></li>
                </ul>
                <p className="sw-foot-legal">© {new Date().getFullYear()} TOMSTILL Kids &amp; Boys · {BIZ.city}, {BIZ.country} · Age bands {BIZ.ageBands}</p>
              </div>
            </div>}
            <p className="sw-caption">{active.caption}</p>
          </motion.div>}
        </AnimatePresence>

        {/* ---- product scenes 6–8 ---- */}
        <AnimatePresence mode="wait">
          {product && prodIdx >= 0 && <ProductStage key={product.id} p={product} i={prodIdx} onEnquire={() => jumpProgress(0.955)} />}
        </AnimatePresence>

        {prodIdx >= 0 && <div className="sw-prod-nav">
          <button onClick={() => jumpProgress(PROD_START + Math.max(0, prodIdx - 1) * PROD_W + PROD_W / 2)} aria-label="Previous product"><ArrowLeft size={16} /></button>
          <span className="label">Product {prodIdx + 1} / 6</span>
          <button onClick={() => prodIdx >= 5 ? jumpProgress(0.72) : jumpProgress(PROD_START + (prodIdx + 1) * PROD_W + PROD_W / 2)} aria-label="Next product"><ArrowRight size={16} /></button>
        </div>}
      </div>
    </div>
  );
}
