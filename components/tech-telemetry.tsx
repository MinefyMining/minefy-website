"use client";

import { motion } from "motion/react";
import { Cpu, Radio, Activity, Gauge } from "lucide-react";
import { TelemetryCard } from "@/components/telemetry-card";

const FEATURES = [
  { icon: Radio, label: "ActiSky IoT embarcado em cada equipamento" },
  { icon: Cpu, label: "Protocolo CAN J1939 decodificado em tempo real" },
  { icon: Activity, label: "Dashboards, ciclos e alertas instantâneos" },
  { icon: Gauge, label: "Gestão preditiva de frota — Minefy Fleet 360" },
];

export function TechTelemetry() {
  return (
    <section id="tecnologia" className="relative overflow-hidden bg-background py-24 px-6 scroll-mt-24">
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
            className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl"
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

        {/* Right — live telemetry dashboard card (reusable motif) */}
        <TelemetryCard className="mx-auto w-full max-w-md" />
      </div>
    </section>
  );
}
