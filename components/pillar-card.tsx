import {
  Lightbulb,
  Mountain,
  ShieldCheck,
  Leaf,
  Settings,
  Headset,
} from "lucide-react";

const iconMap = [Lightbulb, Mountain, ShieldCheck, Leaf, Settings, Headset];

interface PillarCardProps {
  title: string;
  description: string;
  index?: number;
}

export function PillarCard({ title, description, index = 0 }: PillarCardProps) {
  const Icon = iconMap[index % iconMap.length];

  return (
    <div className="rounded-2xl bg-card/80 border border-border p-5 flex gap-4">
      <div className="shrink-0 mt-1">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-1">{title}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
