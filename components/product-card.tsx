"use client";

import { Tablet, Satellite, BarChart3, Truck, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRef, type ComponentType } from "react";

type IconKey = "tablet" | "satellite" | "chart" | "truck" | "shield" | "users";

const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  tablet: Tablet,
  satellite: Satellite,
  chart: BarChart3,
  truck: Truck,
  shield: ShieldCheck,
  users: Users,
};

interface ProductCardProps {
  icon: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
  index?: number;
}

export function ProductCard({
  icon,
  title,
  description,
  badge,
  href,
  index = 0,
}: ProductCardProps) {
  const Icon = iconMap[icon as IconKey] ?? Tablet;
  const cardRef = useRef<HTMLDivElement>(null);

  // Move the gold spotlight (::before) to follow the cursor.
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
      className="glass-card-hover stagger-item group flex h-full flex-col gap-4 rounded-xl p-6"
    >
      {/* Badge + arrow */}
      <div className="flex items-start justify-between">
        <span className="inline-block rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
          {badge}
        </span>
        {href && (
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        )}
      </div>

      {/* Icon with glow orb */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="glow-orb-gold absolute inset-0 rounded-full" aria-hidden="true" />
        <Icon className="relative h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Text */}
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
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
