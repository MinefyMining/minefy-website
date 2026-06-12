"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Mountain, Network, Building2, Waves, Truck, Clock, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  mountain: Mountain,
  network: Network,
  building: Building2,
  waves: Waves,
  truck: Truck,
  clock: Clock,
};

interface Reference {
  icon: string;
  label: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

/**
 * Anonymized credibility wall — sector references instead of client logos/names
 * (the company is not authorized to display client brands on the site).
 */
export function ClientCarousel() {
  const t = useTranslations("home.clients");
  const references = t.raw("references") as Reference[];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {references.map((ref) => {
        const Icon = icons[ref.icon] ?? Mountain;
        return (
          <motion.div
            key={ref.label}
            variants={item}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A847]/40"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(120% 120% at 0% 0%, rgba(212,168,71,0.10), transparent 70%)" }}
              aria-hidden="true"
            />
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4A847]/25 bg-[#D4A847]/10">
              <Icon className="h-5 w-5 text-[#D4A847]" />
            </span>
            <span className="relative text-sm font-medium text-foreground">{ref.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
