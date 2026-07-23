import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { AgroHeroHome } from "@/components/agro-hero-home";
import { AgroHowItWorks } from "@/components/agro-how-it-works";
import { AgroBentoSolutions } from "@/components/agro-bento-solutions";
import { AgroTechTelemetry } from "@/components/agro-tech-telemetry";
import { AgroOutcomesSection } from "@/components/agro-outcomes-section";
import { AgroFaqSection } from "@/components/agro-faq-section";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

// Anchors on the dedicated `/agrofy/solucoes` page, in the same order as
// `agrofySolutions.items` in messages/pt-BR.json.
const AGRO_SOLUTION_IDS = [
  "tablets",
  "actisky",
  "analytics",
  "fleet360",
  "safety",
  "consulting",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agrofy.metadata" });
  return { title: t("title"), description: t("description") };
}

/**
 * Agrofy home — rebuilt to mirror the mineração home's exact section flow
 * (`(mineracao)/mineracao/page.tsx`): Hero → Stats → HowItWorks →
 * Solutions bento → TechTelemetry → Outcomes → photo-break → Authority →
 * TestDrive CTA → Credibility (in place of Clients — Agrofy has no named
 * client yet) → FAQ → Final CTA. Every section below uses a dedicated
 * `agro-*` green component; nothing here imports a mineração component.
 *
 * The former ad-hoc "Pains" (4 alternating image/text blocks) and "Market"
 * (why-now stats) sections from the previous iteration of this page are
 * retired in favor of this mirrored structure — their strongest content
 * lives on now, reframed: the pains became `outcomes` items, the market
 * facts became the `stats` bar (with an explicit hedge note, since these are
 * external market figures, never invented Agrofy traction numbers). The
 * original copy is still in git history (commit `dcc919d` and earlier) if
 * Frente 2 (Quem Somos / Projetos) wants to reuse it.
 */
export default async function AgrofyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agrofy");

  const solutionItems = t.raw("solutionsTeaser.items") as Array<{
    icon: string;
    title: string;
    description: string;
    badge: string;
  }>;

  const howSteps = t.raw("howItWorks.steps") as Array<{
    icon: string;
    step: string;
    title: string;
    text: string;
  }>;

  const outcomeItems = t.raw("outcomes.items") as Array<{
    icon: string;
    title: string;
    text: string;
  }>;

  const authorityItems = t.raw("authority.items") as Array<{
    title: string;
    description: string;
  }>;

  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;

  return (
    <div className="agro-theme min-h-screen bg-background">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — HERO (animated: aurora + particles + stagger)
      ───────────────────────────────────────────────────────────── */}
      <AgroHeroHome
        badge={t("hero.badge")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        trust={t("hero.trust")}
        cta={t("hero.cta")}
        ctaSecondary={t("hero.ctaSecondary")}
        appUrl="https://app.minefymining.com"
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION — HOW IT WORKS
          (Stats/numbers section intentionally omitted — Agrofy has no
          traction numbers to show yet, per CEO.)
      ───────────────────────────────────────────────────────────── */}
      <AgroHowItWorks
        kicker={t("howItWorks.kicker")}
        title={t("howItWorks.title")}
        subtitle={t("howItWorks.subtitle")}
        steps={howSteps}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — SOLUTIONS BENTO (teaser — full catalog lives on
          the dedicated `/agrofy/solucoes` page)
      ───────────────────────────────────────────────────────────── */}
      <section id="ofertas" className="scroll-mt-24 py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
              {t("solutionsTeaser.title")}
            </h2>
            <p className="text-muted-foreground text-center mt-3 max-w-2xl mx-auto">
              {t("solutionsTeaser.subtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-12">
            <AgroBentoSolutions items={solutionItems} ids={AGRO_SOLUTION_IDS} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3.5 — TECH / REAL-TIME TELEMETRY
      ───────────────────────────────────────────────────────────── */}
      <AgroTechTelemetry />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3.6 — OUTCOMES (what changes in your operation)
      ───────────────────────────────────────────────────────────── */}
      <AgroOutcomesSection
        kicker={t("outcomes.kicker")}
        title={t("outcomes.title")}
        subtitle={t("outcomes.subtitle")}
        items={outcomeItems}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — FULL-WIDTH PHOTO BREAK
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
        <Image
          src="/images/agro/pulverizador-autopropelido.jpg"
          alt="Pulverizador autopropelido em operação em lavoura de grande porte"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="max-w-2xl px-6 text-center text-xl font-medium text-white/90 md:text-2xl">
            Tecnologia para frotas agrícolas multimarca, do plantio à colheita
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — AUTHORITY — Why choose Agrofy
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground mb-12">
              {t("authority.title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorityItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-background rounded-xl p-8 border border-border transition-colors duration-200 hover:border-[#16A34A]/40">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — TEST DRIVE CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="glass-card relative overflow-hidden rounded-2xl p-12">
              <AuroraBackground grid={false} particles={false} className="opacity-50" />
              <div className="relative z-10">
              <h2 className="text-3xl font-bold text-foreground">
                {t("testDrive.title")}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t("testDrive.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <a
                  href="https://app.minefymining.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#16A34A] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
                >
                  {t("testDrive.cta")}
                </a>
                <Link
                  href="/contato"
                  className="inline-flex items-center border border-foreground/20 text-foreground px-6 py-3 rounded-lg font-medium text-sm hover:border-foreground/40 hover:bg-foreground/5 transition-colors duration-200"
                >
                  {t("testDrive.ctaSecondary")}
                </Link>
              </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — CREDIBILITY (in place of Clients — no named agro
          client yet; reuses the real mining-validated proof point)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card px-6 py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
              {t("credibility.kicker")}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              {t("credibility.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {t("credibility.text")}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
              {t("credibility.badge")}
            </span>
          </div>
        </ScrollReveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7.5 — FAQ
      ───────────────────────────────────────────────────────────── */}
      <AgroFaqSection
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        items={faqItems}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8 — FINAL CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-6 text-center bg-background">
        <AuroraBackground particles={false} className="opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("cta.title")}
            </h2>
            <p className="text-muted-foreground mt-3">
              {t("cta.text")}
            </p>
            <div className="mt-8">
              <Link
                href="/contato"
                className="inline-flex items-center bg-[#16A34A] text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
              >
                {t("cta.button")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
