import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatsBar } from "@/components/stats-bar";
import { BentoSolutions } from "@/components/bento-solutions";
import { ClientCarousel } from "@/components/client-carousel";
import { HeroHome } from "@/components/hero-home";
import { AuroraBackground } from "@/components/aurora-background";
import { LogoIntro } from "@/components/logo-intro";
import { TechTelemetry } from "@/components/tech-telemetry";
import { FaqSection } from "@/components/faq-section";
import { HowItWorks } from "@/components/how-it-works";
import { OutcomesSection } from "@/components/outcomes-section";

type Props = {
  params: Promise<{ locale: string }>;
};

const SOLUTION_IDS = [
  "tablets",
  "actisky",
  "analytics",
  "fleet360",
  "safety",
  "consulting",
] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const productItems = t.raw("products.items") as Array<{
    icon: string;
    title: string;
    description: string;
    badge: string;
  }>;

  const authorityItems = t.raw("authority.items") as Array<{
    title: string;
    description: string;
  }>;

  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;

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

  return (
    <>
      {/* Brand intro — logo generates in center then flies to the header */}
      <LogoIntro />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — HERO (animated: aurora + particles + stagger)
      ───────────────────────────────────────────────────────────── */}
      <HeroHome
        badge={t("hero.badge")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        trust={t("hero.trust")}
        cta={t("hero.cta")}
        ctaSecondary={t("hero.ctaSecondary")}
        appUrl="https://app.minefymining.com"
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — STATS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0A0A0A] border-y border-[#222]">
        <div className="max-w-7xl mx-auto px-6">
          <StatsBar />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2.5 — HOW IT WORKS
      ───────────────────────────────────────────────────────────── */}
      <HowItWorks
        kicker={t("howItWorks.kicker")}
        title={t("howItWorks.title")}
        subtitle={t("howItWorks.subtitle")}
        steps={howSteps}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — SOLUTIONS GRID
      ───────────────────────────────────────────────────────────── */}
      <section id="solucoes" className="py-20 px-6 bg-[#0A0A0A] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
              {t("products.title")}
            </h2>
            <p className="text-[#888] text-center mt-3 max-w-2xl mx-auto">
              {t("products.subtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-12">
            <BentoSolutions items={productItems} ids={SOLUTION_IDS} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3.5 — TECH / REAL-TIME TELEMETRY
      ───────────────────────────────────────────────────────────── */}
      <TechTelemetry />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3.6 — OUTCOMES (what changes in your operation)
      ───────────────────────────────────────────────────────────── */}
      <OutcomesSection
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
          src="/images/mining/safety-excavator-sunset.jpg"
          alt="Escavadeira de grande porte ao entardecer em mina a céu aberto"
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
            Tecnologia para equipamentos de grande porte em mineração a céu aberto
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — AUTHORITY — Why choose Minefy
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground mb-12">
              {t("authority.title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorityItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-[#0A0A0A] rounded-xl p-8 border border-[#222] transition-colors duration-200 hover:border-[#333]">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#888] leading-relaxed">
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
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="glass-card relative overflow-hidden rounded-2xl p-12">
              <AuroraBackground grid={false} particles={false} className="opacity-50" />
              <div className="relative z-10">
              <h2 className="text-3xl font-bold text-foreground">
                {t("testDrive.title")}
              </h2>
              <p className="text-[#888] mt-3 max-w-xl mx-auto">
                {t("testDrive.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <a
                  href="https://app.minefymining.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#D4A847] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#C49B3F] transition-colors duration-200"
                >
                  {t("testDrive.cta")}
                </a>
                <Link
                  href="/contato"
                  className="inline-flex items-center border border-[#444] text-foreground px-6 py-3 rounded-lg font-medium text-sm hover:border-[#666] hover:bg-white/5 transition-colors duration-200"
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
          SECTION 7 — CLIENTS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A847]">
              Confiança
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-foreground md:text-4xl">
              {t("clients.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              {t("clients.subtitle")}
            </p>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#D4A847] to-transparent" />
          </ScrollReveal>
          <ScrollReveal delay={100} className="mt-12">
            <ClientCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7.5 — FAQ
      ───────────────────────────────────────────────────────────── */}
      <FaqSection
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        items={faqItems}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8 — FINAL CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-6 text-center bg-[#0A0A0A]">
        <AuroraBackground particles={false} className="opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("cta.title")}
            </h2>
            <p className="text-[#888] mt-3">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8">
              <Link
                href="/contato"
                className="inline-flex items-center bg-[#D4A847] text-[#0A0A0A] px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#C49B3F] transition-colors duration-200"
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
