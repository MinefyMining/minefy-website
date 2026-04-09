import { Tablet, Satellite, BarChart3, Truck, ShieldCheck, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ComponentType } from "react";

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

  const content = (
    <div className="glass-card-hover rounded-xl p-6 h-full flex flex-col gap-4 stagger-item">
      {/* Badge */}
      <div className="self-start">
        <span className="inline-block text-xs uppercase tracking-widest font-medium border border-primary/30 text-primary px-3 py-1 rounded-full">
          {badge}
        </span>
      </div>

      {/* Icon with glow orb */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <span
          className="glow-orb-gold absolute inset-0 rounded-full"
          aria-hidden="true"
        />
        <Icon className="relative h-10 w-10 text-primary" />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-lg leading-snug">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
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
