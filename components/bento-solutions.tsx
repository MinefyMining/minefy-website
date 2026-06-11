"use client";

import { useRef, type ComponentType } from "react";
import dynamic from "next/dynamic";
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
import { Safe3D } from "@/components/safe-3d";

// WebGL scene — client-only (no SSR).
const Tablet3D = dynamic(() => import("@/components/tablet-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-28 animate-pulse rounded-xl border border-primary/20 bg-primary/5" />
    </div>
  ),
});

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
      className="glass-card-hover gradient-border group relative grid overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:col-span-2 md:row-span-2 md:grid-cols-[1.05fr_0.95fr]"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-80"
        style={{ background: "radial-gradient(circle, rgba(212,168,71,0.22), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Copy */}
      <div className="relative z-10 flex flex-col justify-between p-8">
        <div>
          <span className="inline-block rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            {item.badge}
          </span>
          <div className="relative mt-6 flex h-14 w-14 items-center justify-center">
            <span className="glow-orb-gold absolute inset-0 rounded-full" aria-hidden="true" />
            <Icon className="relative h-11 w-11 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Conhecer
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* 3D device */}
      <div className="relative z-10 h-60 min-h-[240px] w-full md:h-auto">
        <Safe3D>
          <Tablet3D />
        </Safe3D>
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
