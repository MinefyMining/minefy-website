interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      {subtitle && (
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{subtitle}</p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
    </div>
  );
}
