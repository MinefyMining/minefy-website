import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SolutionCardProps {
  title: string;
  description: string;
  href?: string;
}

export function SolutionCard({ title, description, href }: SolutionCardProps) {
  const content = (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex items-center justify-between gap-4 border-b border-border py-4 hover:border-primary transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-4 border-b border-border py-4 cursor-pointer hover:border-primary transition-colors">
      {content}
    </div>
  );
}
