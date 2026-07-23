"use client";

import { Tablet, Satellite, BarChart3, Truck, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRef, type ComponentType } from "react";

/**
 * Green counterpart of `product-card.tsx`, dedicated to the Agrofy ecosystem.
 * `product-card.tsx` hardcodes gold via `text-primary`/`glow-orb-gold` (global
 * CSS vars, not scoped by `.agro-theme`) — cloning instead of overriding
 * avoids any risk of gold↔green bleed between the two sectors.
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

interface AgroProductCardProps {
  icon: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
  index?: number;
}

export function AgroProductCard({
  icon,
  title,
  description,
  badge,
  href,
  index = 0,
}: AgroProductCardProps) {
  const Icon = iconMap[icon as IconKey] ?? Tablet;
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  const content = (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      className="agro-glass-card-hover stagger-item group flex h-full flex-col gap-4 rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <span className="inline-block rounded-full border border-[#16A34A]/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#4ADE80]">
          {badge}
        </span>
        {href && (
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4ADE80]" />
        )}
      </div>

      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="agro-glow-orb absolute inset-0 rounded-full" aria-hidden="true" />
        <Icon className="relative h-10 w-10 text-[#4ADE80] transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div style={{ animationDelay: `${index * 100}ms` }} className="h-full">
      {content}
    </div>
  );
}
