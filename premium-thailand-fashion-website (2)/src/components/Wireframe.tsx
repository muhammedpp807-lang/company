import React, { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ============================================================
   Wireframe — glowing 3D structures rendered as SVG polylines.
   Everything is computed deterministically so the render is
   stable and cheap. Draws itself in on scroll, then drifts.
   ============================================================ */

type Vec3 = [number, number, number];

const TAU = Math.PI * 2;

const rotate = ([x, y, z]: Vec3, rx: number, ry: number): Vec3 => {
  const x1 = x * Math.cos(ry) - z * Math.sin(ry);
  const z1 = x * Math.sin(ry) + z * Math.cos(ry);
  const y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
  return [x1, y1, z2];
};

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];

/** Project a 3D point into 2D with soft perspective */
const project = (
  p: Vec3,
  size: number,
  rx: number,
  ry: number
): { x: number; y: number; depth: number } => {
  const [x, y, z] = rotate(p, rx, ry);
  const persp = 3.4 / (3.4 + z);
  return {
    x: size / 2 + x * persp * size * 0.32,
    y: size / 2 + y * persp * size * 0.32,
    depth: z,
  };
};

const toPath = (pts: Vec3[], size: number, rx: number, ry: number) => {
  const p = pts.map((v) => project(v, size, rx, ry));
  return (
    p.map((q, i) => `${i === 0 ? "M" : "L"}${q.x.toFixed(2)} ${q.y.toFixed(2)}`).join(" ") +
    (p.length > 2 ? " Z" : "")
  );
};

/* ---------- shape generators ---------- */

/** Torus: major + minor rings */
const torusPaths = (size: number, rx: number, ry: number, R = 1.5, r = 0.55, seg = 34) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rings: string[] = [];
  const step = 0.42;
  for (let u = 0; u < TAU; u += step) {
    const pts: Vec3[] = [];
    for (let i = 0; i <= seg; i++) {
      const v = (i / seg) * TAU;
      pts.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
    }
    rings.push(toPath(pts, size, rx, ry));
  }
  for (let v = 0; v < TAU; v += step * 2) {
    const pts: Vec3[] = [];
    for (let i = 0; i <= seg * 2; i++) {
      const u = (i / (seg * 2)) * TAU;
      pts.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
    }
    rings.push(toPath(pts, size, rx, ry));
  }
  return rings;
};

/** Sphere: latitude / longitude mesh */
const spherePaths = (size: number, rx: number, ry: number, R = 1.7, seg = 40) => {
  const paths: string[] = [];
  const latStep = 0.44;
  for (let lat = -Math.PI / 2 + latStep; lat < Math.PI / 2; lat += latStep) {
    const pts: Vec3[] = [];
    for (let i = 0; i <= seg; i++) {
      const lon = (i / seg) * TAU;
      pts.push([
        R * Math.cos(lat) * Math.cos(lon),
        R * Math.cos(lat) * Math.sin(lon),
        R * Math.sin(lat),
      ]);
    }
    paths.push(toPath(pts, size, rx, ry));
  }
  for (let lon = 0; lon < TAU; lon += latStep) {
    const pts: Vec3[] = [];
    for (let i = 0; i <= seg / 2; i++) {
      const lat = -Math.PI / 2 + (i / (seg / 2)) * Math.PI;
      pts.push([
        R * Math.cos(lat) * Math.cos(lon),
        R * Math.cos(lat) * Math.sin(lon),
        R * Math.sin(lat),
      ]);
    }
    paths.push(toPath(pts, size, rx, ry));
  }
  return paths;
};

/** Trefoil knot tube — the knotted wireframe in the reference */
const knotPaths = (size: number, rx: number, ry: number, scale = 1.45, tube = 0.3) => {
  const N = 200;
  const curve: Vec3[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * TAU;
    curve.push([
      (Math.sin(t) + 2 * Math.sin(2 * t)) * scale,
      (Math.cos(t) - 2 * Math.cos(2 * t)) * scale,
      -Math.sin(3 * t) * scale,
    ]);
  }
  const paths: string[] = [];
  // centreline
  paths.push(toPath(curve, size, rx, ry));
  // ribs
  const ribEvery = 12;
  const ribSeg = 14;
  for (let i = 0; i < curve.length - 1; i += ribEvery) {
    const p = curve[i];
    const p2 = curve[i + 1] ?? curve[i - 1];
    const t = norm(sub(p2, p));
    const n = norm(cross(t, [0, 0, 1]));
    const b = cross(t, n);
    const pts: Vec3[] = [];
    for (let k = 0; k <= ribSeg; k++) {
      const a = (k / ribSeg) * TAU;
      pts.push(add(p, add(mul(n, Math.cos(a) * tube), mul(b, Math.sin(a) * tube))));
    }
    paths.push(toPath(pts, size, rx, ry));
  }
  return paths;
};

/** Flat orbit ellipses */
const orbitPaths = (size: number, rx: number, ry: number) => {
  const ellipses: Vec3[][] = [];
  const configs = [
    { R: 2.15, tilt: 0.35, phase: 0 },
    { R: 2.5, tilt: -0.6, phase: 1.1 },
    { R: 1.85, tilt: 1.15, phase: 2.2 },
  ];
  configs.forEach(({ R, tilt, phase }) => {
    const pts: Vec3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * TAU + phase;
      pts.push([R * Math.cos(a), 0, R * Math.sin(a) * Math.sin(tilt)]);
    }
    ellipses.push(pts);
  });
  return ellipses.map((e) => toPath(e, size, rx, ry));
};

export type WireShape = "torus" | "sphere" | "knot" | "orbit";

interface WireframeProps {
  shape?: WireShape;
  size?: number;
  spin?: number; // radians of scroll-driven rotation
  className?: string;
  strokeWidth?: number;
  opacity?: number;
  delay?: number;
}

export const Wireframe: React.FC<WireframeProps> = ({
  shape = "torus",
  size = 520,
  spin = 0,
  className = "",
  strokeWidth = 1,
  opacity = 0.85,
  delay = 0,
}) => {
  const reduce = useReducedMotion();
  const rx = 1.05 + spin * 0.35;
  const ry = spin * 0.9;

  const paths = useMemo(() => {
    switch (shape) {
      case "sphere":
        return spherePaths(size, rx, ry);
      case "knot":
        return knotPaths(size, rx, ry);
      case "orbit":
        return orbitPaths(size, rx, ry);
      default:
        return torusPaths(size, rx, ry);
    }
  }, [shape, size, rx, ry]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.018, delayChildren: delay } },
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={`wf-glow-${shape}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        filter={`url(#wf-glow-${shape})`}
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            variants={{
              hidden: reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
              show: {
                pathLength: 1,
                opacity: opacity * (i % 5 === 0 ? 1 : 0.62),
                transition: { duration: reduce ? 0.2 : 1.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          />
        ))}
      </motion.g>

      {/* travelling light points along the structure */}
      {!reduce &&
        paths.slice(0, 6).map((d, i) => (
          <motion.circle
            key={`dot-${i}`}
            r={2.6}
            fill="var(--color-clay)"
            className="glow-dot"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            whileInView={{ opacity: [0, 1, 1, 0] }}
            viewport={{ once: true }}
            style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{
              offsetDistance: { duration: 7 + i * 1.4, repeat: Infinity, ease: "linear", delay: i * 0.9 },
              opacity: { duration: 2.2, repeat: Infinity, repeatDelay: 0.4, delay: i * 0.7 },
            }}
          />
        ))}
    </svg>
  );
};

/* ---------- scroll-reactive wrapper ---------- */
export const WireframeStage: React.FC<{
  shape?: WireShape;
  className?: string;
  size?: number;
  children?: React.ReactNode;
}> = ({ shape = "torus", className = "", size = 520, children }) => {
  const reduce = useReducedMotion();
  return (
    <div className={`relative ${className}`}>
      {!reduce && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="size-full"
          >
            <Wireframe shape={shape} size={size} />
          </motion.div>
        </motion.div>
      )}
      {children}
    </div>
  );
};
