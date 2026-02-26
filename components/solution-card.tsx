import { Link } from "@/i18n/navigation";

interface SolutionCardProps {
  title: string;
  description: string;
  href?: string;
  ctaText?: string;
}

export function SolutionCard({ title, description, href = "/solucoes", ctaText }: SolutionCardProps) {
  return (
    <div className="rounded-[1.875rem] bg-card p-6 md:p-8 flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>
      {ctaText && (
        <Link
          href={href}
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {ctaText} →
        </Link>
      )}
    </div>
  );
}
