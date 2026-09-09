import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Mountain,
  Brain,
  Bot,
  Code2,
  Plug,
  Rocket,
  Activity,
  RefreshCcw,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatsBar } from "@/components/stats-bar";
import { ClientCarousel } from "@/components/client-carousel";
import { HeroCorporate } from "@/components/hero-corporate";
import { ExperienceLab } from "@/components/experience-lab";
import { AuroraBackground } from "@/components/aurora-background";
import { FaqSection } from "@/components/faq-section";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "corporateHome.metadata" });
  return pageMetadata({
    site: "mineracao",
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

const doorIcons: Record<string, ComponentType<{ className?: string }>> = {
  mountain: Mountain,
  brain: Brain,
  bot: Bot,
  code: Code2,
};

const engineeringIcons: Record<string, ComponentType<{ className?: string }>> = {
  plug: Plug,
  rocket: Rocket,
  activity: Activity,
  refresh: RefreshCcw,
};

/**
 * Corporate home (2026-09 evolution) — section order per the approved plan:
 * 1. concise non-blocking hero + systems/agents map
 * 2. four entry doors by need
 * 3-4. "Explore uma execução" (interactive lab incl. the result demo, all
 *      simulated and persistently labeled as such)
 * 5. engineering capacity  6. method  7. verified industrial evidence
 * (clearly separated from the new offers)  8. contextual CTA.
 * The full mining commercial flow lives untouched at /solucoes (same
 * anchors as always) — door #1 leads straight to it.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("corporateHome");
  const tHome = await getTranslations("home");

  const doors = t.raw("doors.items") as Array<{
    icon: string;
    title: string;
    text: string;
    href: string;
    ctaLabel: string;
  }>;

  const engineering = t.raw("engineering.items") as Array<{
    icon: string;
    title: string;
    text: string;
  }>;

  const methodSteps = t.raw("method.steps") as Array<{
    step: string;
    title: string;
    text: string;
  }>;

  const authorityItems = tHome.raw("authority.items") as Array<{
    title: string;
    description: string;
  }>;

  // FAQ CORPORATIVA (corporateHome.faq) — a FAQ industrial de mineração
  // continua íntegra na jornada /solucoes (achado CODEX-UX).
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;

  return (
    <>
      {/* ── 1. HERO — concise, non-blocking, with systems/agents map ── */}
      <HeroCorporate
        badge={t("hero.badge")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        trust={t("hero.trust")}
        cta={t("hero.cta")}
        ctaSecondary={t("hero.ctaSecondary")}
      />

      {/* ── 2. FOUR ENTRY DOORS ── */}
      <section id="frentes" className="scroll-mt-24 border-y border-border bg-background px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("doors.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              {t("doors.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("doors.subtitle")}
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doors.map((door, i) => {
              const Icon = doorIcons[door.icon] ?? Mountain;
              return (
                <ScrollReveal key={door.title} delay={i * 70} className="h-full">
                  <Link href={door.href} className="block h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                        {door.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {door.text}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        {door.ctaLabel}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3-4. EXPLORE UMA EXECUÇÃO (interactive lab + result demo) ── */}
      <section id="execucao" className="scroll-mt-24 bg-background px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("lab.kicker")}
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-foreground md:text-4xl">
              {t("lab.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              {t("lab.subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100} className="mt-10">
            <ExperienceLab />
          </ScrollReveal>
          <div className="mt-6 text-center">
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("lab.fullCta")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. ENGINEERING CAPACITY ── */}
      <section id="engenharia" className="scroll-mt-24 bg-card px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("engineering.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              {t("engineering.title")}
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {engineering.map((cap, i) => {
              const Icon = engineeringIcons[cap.icon] ?? Plug;
              return (
                <ScrollReveal key={cap.title} delay={i * 70}>
                  <div className="h-full rounded-xl border border-border bg-background p-6">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold text-foreground">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cap.text}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. METHOD ── */}
      <section id="como-entregamos" className="scroll-mt-24 bg-background px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("method.kicker")}
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-foreground md:text-4xl">
              {t("method.title")}
            </h2>
          </ScrollReveal>
          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {methodSteps.map((s, i) => (
              <li key={s.step} className="h-full">
                <ScrollReveal delay={i * 80} className="relative flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <span className="font-mono text-sm font-bold text-primary">
                    {s.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                  {i < methodSteps.length - 1 && (
                    <ArrowRight
                      className="absolute -right-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary/50 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7. VERIFIED INDUSTRIAL EVIDENCE (distinct from the new offers) ── */}
      <section id="evidencias" className="scroll-mt-24 border-t border-border bg-card px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("evidence.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              {t("evidence.title")}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("evidence.note")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80} className="mt-10">
            <StatsBar />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {authorityItems.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 80}>
                <div className="h-full rounded-xl border border-border bg-background p-8 transition-colors duration-200 hover:border-[#333]">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100} className="mt-12">
            <ClientCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ (preserved from the previous home) ── */}
      <FaqSection
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        items={faqItems}
      />

      {/* ── 8. CONTEXTUAL CTA ── */}
      <section className="relative overflow-hidden bg-background px-6 py-20 text-center">
        <AuroraBackground particles={false} className="opacity-60" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8">
              <Link
                href="/contato"
                className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                {t("cta.button")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
