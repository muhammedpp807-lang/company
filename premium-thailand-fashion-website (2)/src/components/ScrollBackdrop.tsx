import React, { useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Wireframe } from "./Wireframe";

/* ============================================================
   ScrollBackdrop — the living background.
   Large glowing wireframe structures drift at different rates
   as the page scrolls, creating depth. Plus scattered crosshair
   markers and dust particles over the technical grid.
   All motion is transform/opacity only (GPU friendly).
   ============================================================ */

const CROSSES = [
  { top: "14%", left: "6%", s: 14 },
  { top: "27%", left: "88%", s: 11 },
  { top: "41%", left: "24%", s: 9 },
  { top: "58%", left: "72%", s: 13 },
  { top: "72%", left: "12%", s: 10 },
  { top: "86%", left: "58%", s: 12 },
  { top: "33%", left: "48%", s: 8 },
  { top: "66%", left: "93%", s: 9 },
];

const DUST = [
  { top: "18%", left: "32%", d: 0, s: 2.4 },
  { top: "46%", left: "18%", d: 1.4, s: 1.8 },
  { top: "62%", left: "66%", d: 2.6, s: 2.6 },
  { top: "78%", left: "38%", d: 0.8, s: 1.6 },
  { top: "30%", left: "78%", d: 3.4, s: 2.2 },
  { top: "88%", left: "22%", d: 2.0, s: 1.9 },
  { top: "52%", left: "90%", d: 4.2, s: 1.7 },
];

const PlusMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.4" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const ScrollBackdrop: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* smoothed page progress → silky parallax */
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.5 });

  /* each structure travels a different distance = depth */
  const knotY = useTransform(p, [0, 1], ["-6%", "52%"]);
  const knotR = useTransform(p, [0, 1], [0, 60]);
  const orbitY = useTransform(p, [0, 1], ["46%", "-38%"]);
  const orbitR = useTransform(p, [0, 1], [0, -75]);
  const sphereY = useTransform(p, [0, 1], ["78%", "-24%"]);
  const sphereR = useTransform(p, [0, 1], [0, 40]);
  const gridY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const drift = useTransform(p, [0, 1], ["0%", "-6%"]);

  const crosses = useMemo(() => CROSSES, []);
  const dust = useMemo(() => DUST, []);

  if (reduce) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="absolute left-[-10%] top-[12%] size-[46vw] max-w-[620px] opacity-15">
          <Wireframe shape="knot" size={620} spin={0.6} opacity={0.5} strokeWidth={0.8} />
        </div>
        <div className="absolute right-[-12%] top-[46%] size-[40vw] max-w-[560px] opacity-12">
          <Wireframe shape="orbit" size={560} spin={0.3} opacity={0.45} strokeWidth={0.8} />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* slow-drifting technical grid */}
      <motion.div style={{ y: gridY }} className="absolute -inset-y-[15%] inset-x-0">
        <div className="size-full bg-grid bg-grid-fade opacity-70" />
      </motion.div>

      {/* ---------- structure 01 : trefoil knot ---------- */}
      <motion.div
        style={{ y: knotY, rotate: knotR, willChange: "transform" }}
        className="absolute -left-[14%] top-0 size-[58vw] max-w-[760px] opacity-[0.22] lg:opacity-[0.28]"
      >
        <Wireframe shape="knot" size={760} spin={0.55} opacity={0.55} strokeWidth={0.8} />
      </motion.div>

      {/* ---------- structure 02 : orbit rings ---------- */}
      <motion.div
        style={{ y: orbitY, rotate: orbitR, willChange: "transform" }}
        className="absolute -right-[16%] top-0 size-[52vw] max-w-[700px] opacity-[0.18] lg:opacity-[0.24]"
      >
        <Wireframe shape="orbit" size={700} spin={0.25} opacity={0.5} strokeWidth={0.9} />
      </motion.div>

      {/* ---------- structure 03 : sphere mesh ---------- */}
      <motion.div
        style={{ y: sphereY, rotate: sphereR, willChange: "transform" }}
        className="absolute left-[26%] top-0 hidden size-[42vw] max-w-[560px] opacity-[0.14] md:block lg:opacity-[0.2]"
      >
        <Wireframe shape="sphere" size={560} spin={-0.3} opacity={0.45} strokeWidth={0.8} />
      </motion.div>

      {/* ---------- structure 04 : small torus accent ---------- */}
      <motion.div
        style={{ y: drift, willChange: "transform" }}
        className="absolute right-[8%] top-[8%] hidden size-[24vw] max-w-[300px] opacity-[0.16] lg:block"
      >
        <Wireframe shape="torus" size={300} spin={0.9} opacity={0.5} strokeWidth={1} />
      </motion.div>

      {/* ---------- crosshair markers ---------- */}
      {crosses.map((c, i) => (
        <motion.span
          key={i}
          className="absolute text-clay/35"
          style={{ top: c.top, left: c.left, willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ delay: i * 0.12, duration: 0.7 }}
        >
          <motion.span
            className="block"
            animate={{ rotate: [0, 90, 180, 270, 360], opacity: [0.35, 0.8, 0.35] }}
            transition={{
              rotate: { duration: 26 + i * 4, repeat: Infinity, ease: "linear" },
              opacity: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <PlusMark size={c.s} />
          </motion.span>
        </motion.span>
      ))}

      {/* ---------- dust particles ---------- */}
      {dust.map((d, i) => (
        <motion.span
          key={`dust-${i}`}
          className="absolute rounded-full bg-clay glow-dot"
          style={{ top: d.top, left: d.left, width: d.s, height: d.s, willChange: "transform, opacity" }}
          animate={{ y: [0, -26, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{
            duration: 9 + i * 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.d,
          }}
        />
      ))}

      {/* vignette keeps text legible over the structures */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_30%,rgba(4,5,10,0.6)_100%)]" />
    </div>
  );
};
