"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface AgroFaqSectionProps {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

/**
 * Green mirror of `FaqSection`, dedicated to the Agrofy home.
 */
export function AgroFaqSection({ title, subtitle, items }: AgroFaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-[#16A34A]/40 bg-card" : "border-border bg-card/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-foreground">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#16A34A]/40 text-[#4ADE80]"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
