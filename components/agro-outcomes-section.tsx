"use client";

import { motion } from "motion/react";
import { Timer, Wrench, ShieldCheck, BarChart3, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  timer: Timer,
  wrench: Wrench,
  shield: ShieldCheck,
  chart: BarChart3,
};

interface Outcome {
  icon: string;
  title: string;
  text: string;
}

interface AgroOutcomesSectionProps {
  kicker: string;
  title: string;
  subtitle: string;
  items: Outcome[];
}

/**
 * Green mirror of `OutcomesSection`, dedicated to the Agrofy home.
 */
export function AgroOutcomesSection({ kicker, title, subtitle, items }: AgroOutcomesSectionProps) {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">{kicker}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((o, i) => {
            const Icon = icons[o.icon] ?? Timer;
            return (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-6"
              >
                <span
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle, rgba(34,197,94,0.16), transparent 70%)" }}
                  aria-hidden="true"
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/10">
                  <Icon className="h-6 w-6 text-[#4ADE80]" />
                </span>
                <h3 className="relative mt-5 text-lg font-bold text-foreground">{o.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
