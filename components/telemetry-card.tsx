"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TelemetryCardProps {
  className?: string;
  /** Optional title override. Default "ActiSky". */
  title?: string;
}

const SPARK = [0.5, 0.36, 0.62, 0.3, 0.55, 0.26, 0.46, 0.2, 0.42, 0.16, 0.32, 0.22];

function sparkPath(values: number[], w: number, h: number) {
  return values
    .map((v, i) => {
      const x = (i * w) / (values.length - 1);
      const y = h - v * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Reusable "live telemetry" dashboard card — the gold ActiSky panel used as a
 * recurring tech motif across the site. Values gently tick on the client only
 * (SSR-stable initial render → no hydration mismatch). Honors reduced motion
 * via the CSS-gated `.flow-dash` / pulse utilities.
 */
export function TelemetryCard({ className = "", title = "ActiSky" }: TelemetryCardProps) {
  const [cycles, setCycles] = useState(24.7);
  const [fuel, setFuel] = useState(82);
  const [temp, setTemp] = useState(71);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1;
      // gentle, bounded drift — deterministic-ish, just for a "live" feel
      const t = tick.current;
      setCycles(24.7 + Math.sin(t / 3) * 0.6);
      setFuel(82 + Math.round(Math.sin(t / 5) * 2));
      setTemp(71 + Math.round(Math.cos(t / 4) * 2));
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const w = 300;
  const h = 90;
  const path = sparkPath(SPARK, w, h);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={`glass-card gradient-border relative overflow-hidden rounded-2xl p-6 ${className}`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-foreground">{title}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            live · can j1939
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#D4A847]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4A847] motion-safe:animate-pulse" />
          online
        </span>
      </div>

      {/* primary metric */}
      <div className="mt-5 flex items-end gap-2">
        <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
          {cycles.toFixed(1)}
        </span>
        <span className="mb-1 font-mono text-xs text-[#D4A847]">ciclos / h</span>
      </div>

      {/* sparkline */}
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="tc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A847" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#D4A847" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#tc-fill)" />
        <path d={path} fill="none" stroke="#D4A847" strokeWidth="2" className="flow-dash" />
        <path d={path} fill="none" stroke="#D4A847" strokeWidth="2" strokeOpacity="0.35" />
      </svg>

      {/* chips */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "fuel", v: `${fuel}%` },
          { l: "temp", v: `${temp}°` },
          { l: "seg", v: "ok" },
        ].map((c) => (
          <div key={c.l} className="rounded-lg border border-border bg-[#0D0D0D] px-2 py-2 text-center">
            <p className="font-mono text-sm font-semibold uppercase tabular-nums text-[#D4A847]">
              {c.v}
            </p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>

      {/* progress */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#D4A847] to-[#F5D98B]" />
      </div>
    </motion.div>
  );
}
