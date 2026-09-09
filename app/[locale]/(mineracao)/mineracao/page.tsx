import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Plug, Rocket, Activity, RefreshCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatsBar } from "@/components/stats-bar";
import { ClientCarousel } from "@/components/client-carousel";
import { HeroStage } from "@/components/hero-stage";
import { ScrollerChapter } from "@/components/scroller-chapter";
import { SystemsMap } from "@/components/hero-corporate";
import { ExperienceLab } from "@/components/experience-lab";
import { AuroraBackground } from "@/components/aurora-background";
import { FaqSection } from "@/components/faq-section";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

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

const engineeringIcons: Record<string, ComponentType<{ className?: string }>> = {
  plug: Plug,
  rocket: Rocket,
  activity: Activity,
  refresh: RefreshCcw,
};

/**
 * Home corporativa — revisão Scroller + IA (CEO, 2026-09-09):
 * DOIS protagonistas na primeira dobra, narrativa em capítulos no scroll:
 *   Abertura dual → Capítulo 01 Scroller (mídia dominante) → transição
 *   matéria→digital → Capítulo 02 IA (ofertas + laboratório interativo)
 *   → base industrial (uma faixa de continuidade, não uma "quinta porta")
 *   → capacidade de engenharia → método → evidências verificadas → FAQ
 *   → CTA.
 * Sem scrolljacking, sem WebGL, texto integral no HTML; animações
 * transform/opacity gated por `html.js` + reduced-motion.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("corporateHome");
  const tHome = await getTranslations("home");
  const tServices = await getTranslations("services");

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

  const scrollerPoints = t.raw("scrollerChapter.points") as Array<{
    title: string;
    text: string;
  }>;

  const iaOffers = t.raw("iaChapter.offers") as Array<{
    title: string;
    text: string;
    href: string;
    cta: string;
  }>;

  // FAQ corporativa — a FAQ industrial continua íntegra em /solucoes.
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;

  return (
    <>
      {/* ── PALCO INTEGRADO — Scroller e IA no mesmo palco, primeiro viewport ── */}
      <HeroStage
        badge={t("heroDual.badge")}
        title={t.rich("heroDual.title", {
          gold: (chunks) => <span className="text-[#D4A847]">{chunks}</span>,
        })}
        subtitle={t("heroDual.subtitle")}
        scroller={{
          num: t("heroDual.scenes.scroller.num"),
          label: t("heroDual.scenes.scroller.label"),
          tagline: t("heroDual.scenes.scroller.tagline"),
          cta: t("heroDual.scenes.scroller.cta"),
        }}
        ia={{
          num: t("heroDual.scenes.ia.num"),
          label: t("heroDual.scenes.ia.label"),
          tagline: t("heroDual.scenes.ia.tagline"),
          cta: t("heroDual.scenes.ia.cta"),
        }}
        scrollerImageAlt={tServices("scroller.hero.imageAlt")}
        scrollerMediaNote={t("scrollerChapter.mediaNote")}
      />

      {/* ── CAPÍTULO 01 · SCROLLER ── */}
      <ScrollerChapter
        kicker={t("scrollerChapter.kicker")}
        title={t("scrollerChapter.title")}
        lede={t("scrollerChapter.lede")}
        points={scrollerPoints}
        ctaPrimary={t("scrollerChapter.ctaPrimary")}
        ctaSecondary={t("scrollerChapter.ctaSecondary")}
        mediaNote={t("scrollerChapter.mediaNote")}
        imageAlt={tServices("scroller.hero.imageAlt")}
      />

      {/* transição — da matéria aos fluxos digitais */}
      <div aria-hidden="true" className="flex justify-center bg-[#0A0A0A]">
        <div className="h-28 w-px bg-gradient-to-b from-[#D4A847]/70 via-white/20 to-[#7FB4D8]/70" />
      </div>

      {/* ── CAPÍTULO 02 · INTELIGÊNCIA ARTIFICIAL ── */}
      <section id="ia" className="scroll-mt-20 bg-[#0A0A0A] px-6 pb-24 pt-14">
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9FC6E2]">
              {t("iaChapter.kicker")}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {t("iaChapter.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
              {t("iaChapter.lede")}
            </p>
          </ScrollReveal>

          {/* as duas ofertas de IA — régua editorial, sem grade de cards */}
          <div className="mt-12 grid grid-cols-1 gap-10 border-y border-white/10 py-10 lg:grid-cols-2 lg:gap-16">
            {iaOffers.map((offer, i) => (
              <ScrollReveal key={offer.href} delay={i * 110}>
                <Link
                  href={offer.href}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FB4D8]"
                >
                  <span
                    className="chapter-num chapter-num--ice text-3xl sm:text-4xl"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    {offer.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                    {offer.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#9FC6E2]">
                    {offer.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* TI como sustentação — uma linha, não uma porta */}
          <ScrollReveal delay={120}>
            <p className="mt-6 text-sm text-white/50">
              {t("iaChapter.tiNote")}{" "}
              <Link
                href="/solucoes/servicos-ti"
                className="font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t("iaChapter.tiCta")}
              </Link>
            </p>
          </ScrollReveal>

          <div id="agente-minefy" className="mx-auto mt-12 max-w-2xl scroll-mt-24">
            <SystemsMap />
          </div>

          {/* laboratório interativo — a demonstração funcional do capítulo */}
          <ScrollReveal delay={100} className="mt-14">
            <ExperienceLab />
          </ScrollReveal>
          <div className="mt-6 text-center">
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9FC6E2] transition-colors hover:text-white"
            >
              {t("lab.fullCta")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BASE INDUSTRIAL — faixa de continuidade ── */}
      <section className="border-y border-border bg-background px-6 py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("industrial.kicker")}
            </p>
            <h2 className="mt-2 max-w-xl text-2xl font-bold text-foreground md:text-3xl">
              {t("industrial.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("industrial.text")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <Link
              href="/solucoes"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/10"
            >
              {t("industrial.cta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CAPACIDADE DE ENGENHARIA ── */}
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

      {/* ── MÉTODO ── */}
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

      {/* ── EVIDÊNCIAS INDUSTRIAIS VERIFICADAS ── */}
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

      {/* ── FAQ ── */}
      <FaqSection
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        items={faqItems}
      />

      {/* ── CTA CONTEXTUAL ── */}
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
