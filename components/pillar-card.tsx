interface PillarCardProps {
  title: string;
  description: string;
}

export function PillarCard({ title, description }: PillarCardProps) {
  return (
    <div className="rounded-[1.875rem] bg-card p-6 md:p-8">
      <h4 className="text-lg font-semibold mb-3">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
