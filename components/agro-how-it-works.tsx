"use client";

import { motion } from "motion/react";
import { Radio, Activity, Gauge, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  radio: Radio,
  activity: Activity,
  gauge: Gauge,
};

interface Step {
  icon: string;
  step: string;
  title: string;
  text: string;
}

interface AgroHowItWorksProps {
  kicker: string;
  title: string;
  subtitle: string;
  steps: Step[];
}

/**
 * Green mirror of `HowItWorks`, dedicated to the Agrofy home. Same 3-step
 * layout (connector line + numbered nodes), green accents throughout.
 */
export function AgroHowItWorks({ kicker, title, subtitle, steps }: AgroHowItWorksProps) {
  return (
    <section id="como-funciona" className="scroll-mt-24 relative overflow-hidden bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">{kicker}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* connector line (desktop) */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-7 hidden md:block"
            aria-hidden="true"
          >
            <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent" />
          </div>

          {steps.map((s, i) => {
            const Icon = icons[s.icon] ?? Activity;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center"
              >
                {/* numbered node */}
                <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#16A34A]/40 bg-background">
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%)" }}
                    aria-hidden="true"
                  />
                  <Icon className="relative h-6 w-6 text-[#4ADE80]" />
                </div>

                <div className="mb-2 font-mono text-xs font-semibold tracking-widest text-[#4ADE80]/70">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted-foreground">{s.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
