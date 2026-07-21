"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface AgroTelemetryCardProps {
  className?: string;
  /** Optional title override. Default "Agrofy". */
  title?: string;
}

const SPARK = [0.42, 0.55, 0.38, 0.6, 0.34, 0.5, 0.3, 0.46, 0.26, 0.4, 0.22, 0.34];

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
 * Green "live telemetry" dashboard card for the Agrofy division — mirrors the
 * visual language of `TelemetryCard` (the gold ActiSky panel used across the
 * mining site) but with agro-specific metrics (ha/dia, L/h, horímetro) and a
 * green accent instead of gold. Kept as a separate component (rather than
 * theming `TelemetryCard` via props) so the shared mining component stays
 * untouched — zero regression risk on pages that already use it.
 */
export function AgroTelemetryCard({ className = "", title = "Agrofy" }: AgroTelemetryCardProps) {
  const [haDia, setHaDia] = useState(18.4);
  const [lh, setLh] = useState(22);
  const [horas, setHoras] = useState(1240);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1;
      const t = tick.current;
      setHaDia(18.4 + Math.sin(t / 3) * 0.5);
      setLh(22 + Math.round(Math.sin(t / 5) * 2));
      setHoras(1240 + Math.floor(t / 6));
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
      className={`glass-card agro-gradient-border relative overflow-hidden rounded-2xl p-6 ${className}`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-foreground">{title}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            live · can j1939
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#16A34A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] motion-safe:animate-pulse" />
          online
        </span>
      </div>

      {/* primary metric */}
      <div className="mt-5 flex items-end gap-2">
        <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
          {haDia.toFixed(1)}
        </span>
        <span className="mb-1 font-mono text-xs text-[#16A34A]">ha / dia</span>
      </div>

      {/* sparkline */}
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="atc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#atc-fill)" />
        <path d={path} fill="none" stroke="#16A34A" strokeWidth="2" className="flow-dash" />
        <path d={path} fill="none" stroke="#16A34A" strokeWidth="2" strokeOpacity="0.35" />
      </svg>

      {/* chips */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "l/h", v: `${lh}` },
          { l: "horímetro", v: `${horas}h` },
          { l: "seg", v: "ok" },
        ].map((c) => (
          <div key={c.l} className="rounded-lg border border-border bg-[#0D0D0D] px-2 py-2 text-center">
            <p className="font-mono text-sm font-semibold uppercase tabular-nums text-[#16A34A]">
              {c.v}
            </p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>

      {/* progress — % of harvest window covered */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-[#16A34A] to-[#86EFAC]" />
      </div>
    </motion.div>
  );
}
