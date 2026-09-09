import { ArrowRight, Check, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";

export interface ServicePageData {
  badge: string;
  title: string;
  benefit: string;
  scope: Array<{ title: string; text: string }>;
  scopeNote?: string;
  examples?: string[];
  examplesNote?: string;
  deliverables: string[];
  cta: string;
  /** `?servico=` value the contact form pre-selects for this service. */
  contactInterest: string;
  labels: {
    scope: string;
    deliverables: string;
    examples: string;
    backToHub: string;
  };
}

/**
 * Shared template for the three new service pages (`/solucoes/ia-corporativa`,
 * `/solucoes/agentes-autonomos`, `/solucoes/servicos-ti`) — one data-driven
 * layout so the three fronts read as one family. Pure server component: all
 * critical text is server-rendered and usable without JS; the only motion is
 * the CSS/IO-based `ScrollReveal` (which still renders content without JS).
 */
export function ServicePage({ data }: { data: ServicePageData }) {
  const contactHref = `/contato?servico=${data.contactInterest}` as const;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-16 px-6">
        <AuroraBackground grid={false} particles={false} className="opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {data.labels.backToHub}
          </Link>
          <span className="mt-6 inline-block rounded-md bg-secondary px-3 py-1 text-xs uppercase tracking-wider text-[#D4A847]">
            {data.badge}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {data.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {data.benefit}
          </p>
          <div className="mt-8">
            <Link
              href={contactHref}
              className="btn-sheen inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#C49B3F]"
            >
              {data.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scope ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A847]">
              {data.labels.scope}
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.scope.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-[#D4A847]/40">
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          {data.scopeNote && (
            <ScrollReveal delay={100}>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground/80">
                {data.scopeNote}
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── Examples (illustrative) ── */}
      {data.examples && (
        <section className="px-6 py-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8 md:p-10">
            <ScrollReveal>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A847]">
                {data.labels.examples}
              </h2>
              <ul className="mt-6 space-y-3">
                {data.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A847]"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {ex}
                    </span>
                  </li>
                ))}
              </ul>
              {data.examplesNote && (
                <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                  {data.examplesNote}
                </p>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Deliverables ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A847]">
              {data.labels.deliverables}
            </h2>
          </ScrollReveal>
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {data.deliverables.map((item, i) => (
              <li key={item} className="h-full">
                <ScrollReveal delay={i * 60} className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
                  <span className="font-mono text-xs font-semibold text-[#D4A847]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-sm font-medium leading-snug text-foreground">
                    {item}
                  </span>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 text-center">
        <ScrollReveal>
          <div className="glass-card relative mx-auto max-w-3xl overflow-hidden rounded-2xl p-12">
            <AuroraBackground grid={false} particles={false} className="opacity-50" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {data.title}
              </h2>
              <div className="mt-8">
                <Link
                  href={contactHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-8 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#C49B3F]"
                >
                  {data.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
