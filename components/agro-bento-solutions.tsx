"use client";

import Image from "next/image";
import { Tablet, Satellite, BarChart3, Truck, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { useRef, type ComponentType } from "react";
import { Link } from "@/i18n/navigation";
import { AgroProductCard } from "@/components/agro-product-card";

/**
 * Green counterpart of `bento-solutions.tsx`, dedicated to the Agrofy home
 * teaser (`/agrofy`). Mirrors the mineração bento layout — one featured tile
 * + a row of product cards — but swaps the WebGL 3D tablet scene (hardcoded
 * gold materials in `tablet-3d.tsx`, not reusable here) for a real field
 * photo, and uses only `.agro-*` classes so nothing bleeds gold↔green.
 */
type IconKey = "tablet" | "satellite" | "chart" | "truck" | "shield" | "users";
const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  tablet: Tablet,
  satellite: Satellite,
  chart: BarChart3,
  truck: Truck,
  shield: ShieldCheck,
  users: Users,
};

export interface AgroSolutionItem {
  icon: string;
  title: string;
  description: string;
  badge: string;
}

interface AgroBentoSolutionsProps {
  items: AgroSolutionItem[];
  ids: readonly string[];
}

function FeaturedTile({ item, href }: { item: AgroSolutionItem; href: string }) {
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
      className="agro-glass-card-hover agro-gradient-border group relative grid overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] md:col-span-2 md:row-span-2 md:grid-cols-[1.05fr_0.95fr]"
    >
      <div
        className="pointer-events-none absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-80"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.22), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between p-8">
        <div>
          <span className="inline-block rounded-full border border-[#16A34A]/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#4ADE80]">
            {item.badge}
          </span>
          <div className="relative mt-6 flex h-14 w-14 items-center justify-center">
            <span className="agro-glow-orb absolute inset-0 rounded-full" aria-hidden="true" />
            <Icon className="relative h-11 w-11 text-[#4ADE80] transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4ADE80]">
            Conhecer
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Field photo — replaces the WebGL 3D tablet scene from the mineração tile */}
      <div className="relative z-10 h-60 min-h-[240px] w-full md:h-auto">
        <Image
          src="/images/agro/cabine-trator-interior.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0A0A0A]/20"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

/**
 * Bento layout for the Agrofy home solutions teaser: first item is a large
 * featured tile, the rest render as standard product cards. Every tile links
 * to the dedicated `/solucoes` page instead of expanding inline (the page is
 * `(agrofy)/agrofy/solucoes` internally, reached at the domain-root-relative
 * `/solucoes` on `agrofymining.com` — see `proxy.ts` / `agro-header.tsx`).
 */
export function AgroBentoSolutions({ items, ids }: AgroBentoSolutionsProps) {
  const [first, ...rest] = items;

  return (
    <div className="grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-5 md:grid-cols-3">
      {first && <FeaturedTile item={first} href={`/solucoes#${ids[0] ?? ""}`} />}
      {rest.map((item, i) => (
        <AgroProductCard
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
