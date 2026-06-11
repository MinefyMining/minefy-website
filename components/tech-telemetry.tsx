"use client";

import { motion } from "motion/react";
import { Cpu, Radio, Activity, Gauge } from "lucide-react";

const FEATURES = [
  { icon: Radio, label: "ActiSky IoT embarcado em cada equipamento" },
  { icon: Cpu, label: "Protocolo CAN J1939 decodificado em tempo real" },
  { icon: Activity, label: "Dashboards, ciclos e alertas instantâneos" },
  { icon: Gauge, label: "Gestão preditiva de frota — Minefy Fleet 360" },
];

const CHIPS = [
  { v: "CAN J1939", l: "telemetria" },
  { v: "24/7", l: "tempo real" },
  { v: "< 1s", l: "latência" },
];

// Satellite equipment nodes feeding the central hub.
const NODES = [
  { x: 60, y: 60 },
  { x: 40, y: 150 },
  { x: 70, y: 240 },
  { x: 250, y: 70 },
  { x: 270, y: 230 },
];
const HUB = { x: 165, y: 150 };

export function TechTelemetry() {
  return (
    <section id="tecnologia" className="relative overflow-hidden bg-[#0A0A0A] py-24 px-6 scroll-mt-24">
      {/* faint background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 50%, rgba(212,168,71,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left — copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A847]"
          >
            Tecnologia
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl"
          >
            Telemetria em tempo real,{" "}
            <span className="text-gold-flow">do equipamento à decisão</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-lg leading-relaxed text-[#9a9a9a]"
          >
            Cada equipamento conectado via ActiSky transmite telemetria CAN J1939
            em tempo real — ciclos, combustível, temperatura e segurança — direto
            para a plataforma Minefy, onde vira decisão operacional.
          </motion.p>

          <div className="mt-8 space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.12 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4A847]/25 bg-[#D4A847]/10">
                  <f.icon className="h-4 w-4 text-[#D4A847]" />
                </span>
                <span className="text-sm text-[#cfcfcf]">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — animated telemetry diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-border glass-card relative mx-auto w-full max-w-md overflow-hidden rounded-2xl p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#888]">
              Live · ActiSky
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#D4A847]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A847] motion-safe:animate-pulse" />
              online
            </span>
          </div>

          <svg viewBox="0 0 330 300" className="w-full" role="img" aria-label="Diagrama de telemetria em tempo real">
            {/* connection lines with flowing data */}
            {NODES.map((n, i) => (
              <line
                key={`l-${i}`}
                x1={n.x}
                y1={n.y}
                x2={HUB.x}
                y2={HUB.y}
                stroke="#D4A847"
                strokeWidth="1.5"
                strokeOpacity="0.35"
                className="flow-dash"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            {/* satellite nodes */}
            {NODES.map((n, i) => (
              <g key={`n-${i}`}>
                <circle cx={n.x} cy={n.y} r="6" fill="#D4A847" className="node-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                <circle cx={n.x} cy={n.y} r="11" fill="none" stroke="#D4A847" strokeOpacity="0.3" />
              </g>
            ))}
            {/* central hub */}
            <circle cx={HUB.x} cy={HUB.y} r="26" fill="#D4A847" fillOpacity="0.12" />
            <circle cx={HUB.x} cy={HUB.y} r="26" fill="none" stroke="#D4A847" strokeOpacity="0.5" />
            <circle cx={HUB.x} cy={HUB.y} r="9" fill="#D4A847" className="node-pulse" />
          </svg>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {CHIPS.map((c) => (
              <div key={c.v} className="rounded-lg border border-[#222] bg-[#0D0D0D] px-2 py-2.5 text-center">
                <p className="font-mono text-sm font-semibold tabular-nums text-[#D4A847]">{c.v}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#777]">{c.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
