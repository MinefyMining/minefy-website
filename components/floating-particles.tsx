"use client";

import { motion } from "motion/react";

// Deterministic particle set (no Math.random → no hydration mismatch).
const PARTICLES = [
  { left: "8%", top: "20%", size: 6, dur: 9, delay: 0, drift: 22 },
  { left: "18%", top: "65%", size: 4, dur: 11, delay: 1.2, drift: -18 },
  { left: "30%", top: "35%", size: 8, dur: 13, delay: 0.5, drift: 26 },
  { left: "42%", top: "78%", size: 5, dur: 10, delay: 2, drift: -20 },
  { left: "55%", top: "25%", size: 7, dur: 14, delay: 0.8, drift: 18 },
  { left: "63%", top: "58%", size: 4, dur: 12, delay: 1.6, drift: -24 },
  { left: "74%", top: "30%", size: 6, dur: 10, delay: 0.3, drift: 20 },
  { left: "85%", top: "70%", size: 5, dur: 15, delay: 2.4, drift: -16 },
  { left: "92%", top: "42%", size: 7, dur: 11, delay: 1, drift: 24 },
  { left: "48%", top: "12%", size: 4, dur: 13, delay: 1.8, drift: -22 },
];

interface FloatingParticlesProps {
  /** Particle fill color. Default gold "#D4A847". */
  color?: string;
  /** Glow shadow color as an "r,g,b" triplet. Default gold "212,168,71". */
  glowRgb?: string;
}

/**
 * Fluid floating particles. GPU-friendly (transform/opacity only).
 * Markup is identical on server and client (no reduced-motion branch →
 * no hydration mismatch); the whole layer is hidden under
 * `prefers-reduced-motion` via the `.particles-layer` CSS rule in globals.css.
 *
 * Color is driven by inline style (not a Tailwind arbitrary class) so it can
 * be parametrized at runtime — `AgroHeroHome` reuses this exact component in
 * green. Defaults reproduce the original gold mining look byte-for-byte.
 */
export function FloatingParticles({
  color = "#D4A847",
  glowRgb = "212,168,71",
}: FloatingParticlesProps = {}) {
  return (
    <div className="particles-layer absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 12px 2px rgba(${glowRgb},0.55)`,
          }}
          animate={{
            y: [0, p.drift, 0],
            x: [0, p.drift * 0.4, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
