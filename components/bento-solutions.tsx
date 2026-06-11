"use client";

import { useRef, type ComponentType } from "react";
import {
  Tablet,
  Satellite,
  BarChart3,
  Truck,
  ShieldCheck,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product-card";

type IconKey = "tablet" | "satellite" | "chart" | "truck" | "shield" | "users";
const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  tablet: Tablet,
  satellite: Satellite,
  chart: BarChart3,
  truck: Truck,
  shield: ShieldCheck,
  users: Users,
};

export interface SolutionItem {
  icon: string;
  title: string;
  description: string;
  badge: string;
}

interface BentoSolutionsProps {
  items: SolutionItem[];
  ids: readonly string[];
}

/** Featured (large) bento tile for the first solution. */
function FeaturedTile({ item, href }: { item: SolutionItem; href: string }) {
  const Icon = iconMap[item.icon as IconKey] ?? Tablet;
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={handleMove}
      className="glass-card-hover gradient-border group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:col-span-2 md:row-span-2"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(212,168,71,0.18), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative">
        <span className="inline-block rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
          {item.badge}
        </span>
        <div className="relative mt-6 flex h-16 w-16 items-center justify-center">
          <span className="glow-orb-gold absolute inset-0 rounded-full" aria-hidden="true" />
          <Icon className="relative h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      <div className="relative mt-8">
        <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Conhecer
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Bento layout for the home solutions grid: the first item is a large featured
 * tile; the rest render as standard product cards, woven into a 3-column bento.
 */
export function BentoSolutions({ items, ids }: BentoSolutionsProps) {
  const [first, ...rest] = items;

  return (
    <div className="grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-5 md:grid-cols-3">
      {first && <FeaturedTile item={first} href={`/solucoes#${ids[0] ?? ""}`} />}
      {rest.map((item, i) => (
        <ProductCard
          key={i}
          icon={item.icon}
          title={item.title}
          description={item.description}
          badge={item.badge}
          href={`/solucoes#${ids[i + 1] ?? ""}`}
          index={i + 1}
        />
      ))}
    </div>
  );
}
