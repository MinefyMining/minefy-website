import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Sprout,
  Radio,
  Activity,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { AgroTelemetryCard } from "@/components/agro-telemetry-card";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

const STEP_ICONS: Record<string, LucideIcon> = {
  radio: Radio,
  activity: Activity,
  gauge: Gauge,
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agrofy.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function AgrofyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agrofy");

  const painItems = t.raw("pains.items") as Array<{
    id: string;
    badge: string;
    title: string;
    description: string;
    image: string;
    metric: { value: string; label: string };
  }>;

  const offeringItems = t.raw("offerings.items") as Array<{
    id: string;
    badge: string;
    title: string;
    description: string;
    features?: string[];
    tiers?: {
      name: string;
      example: string;
      image: string;
      description: string;
      specs: string[];
    }[];
    safetyFeatures?: string[];
    operationalFeatures?: string[];
    image: string;
    metric: { value: string; label: string };
  }>;

  const offeringRoadmap = t.raw("offerings.roadmap") as {
    badge: string;
    title: string;
    description: string;
  };

  const steps = t.raw("howItWorks.steps") as Array<{
    icon: string;
    step: string;
    title: string;
    text: string;
  }>;

  const marketStats = t.raw("market.stats") as Array<{ value: string; label: string }>;

  return (
    <div className="agro-theme min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-24">
        <Image
          src="/images/agro/hero-colheitadeira-soja-poente.jpg"
          alt="Colheitadeira em operação numa lavoura de soja ao entardecer"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/45" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-[#0A0A0A]/10"
          aria-hidden="true"
        />
        <AuroraBackground grid={false} particles={false} className="opacity-50" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/40 bg-[#16A34A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
              {t("seal")}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8">
              <Link
                href="/agrofy/contato"
                className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
              >
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <AgroTelemetryCard className="ml-auto max-w-sm" />
          </div>
        </div>
      </section>

      {/* ── Credibility strip ── */}
      <section className="border-y border-border bg-card px-6 py-14">
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

      {/* ── Pains → Solution ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
                {t("pains.kicker")}
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
                {t("pains.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t("pains.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          {painItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={item.id}>
                <ScrollReveal>
                  <div
                    className={`flex flex-col gap-12 items-center py-12 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="relative aspect-video w-full md:w-1/2 shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent" aria-hidden="true" />
                      <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/80 px-4 py-2 rounded-lg">
                        <p className="font-bold text-[#4ADE80] text-xl leading-none">
                          {item.metric.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.metric.label}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2">
                      <span className="text-xs uppercase tracking-wider bg-secondary text-[#4ADE80] px-3 py-1 rounded-md inline-block mb-4">
                        {item.badge}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
                {index < painItems.length - 1 && (
                  <div className="h-px bg-border max-w-5xl mx-auto" />
                )}
              </div>
            );
          })}

          <p className="mt-10 text-center text-xs italic leading-relaxed text-muted-foreground">
            {t("pains.footnote")}
          </p>
        </div>
      </section>

      {/* ── Offerings — catálogo de produtos, roupagem agro ── */}
      <section id="ofertas" className="scroll-mt-24 bg-card px-6 py-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
              {t("offerings.kicker")}
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              {t("offerings.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t("offerings.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="px-0">
          {offeringItems.map((item, index) => {
            const isEven = index % 2 === 0;

            // ── Tablets: full-width 3-tier showcase ──
            if (item.tiers) {
              return (
                <div key={item.id}>
                  <ScrollReveal>
                    <div id={item.id} className="py-8 scroll-mt-24 max-w-6xl mx-auto">
                      <div className="text-center mb-12">
                        <span className="text-xs uppercase tracking-wider bg-secondary text-[#4ADE80] px-3 py-1 rounded-md inline-block mb-4">
                          {item.badge}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                          {item.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {item.tiers.map((tier) => (
                          <div
                            key={tier.name}
                            className="group flex flex-col rounded-2xl border border-border bg-background overflow-hidden transition-all duration-300 hover:border-[#16A34A]/50 hover:-translate-y-1"
                          >
                            {/* Product image — studio stage */}
                            <div className="relative h-64 overflow-hidden flex items-center justify-center p-7 bg-gradient-to-b from-[#191919] to-[#0C0C0C]">
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.06), transparent 60%)",
                                }}
                                aria-hidden="true"
                              />
                              <div
                                className="absolute inset-x-0 bottom-0 h-24"
                                style={{
                                  background:
                                    "radial-gradient(60% 100% at 50% 100%, rgba(74,222,128,0.14), transparent 70%)",
                                }}
                                aria-hidden="true"
                              />
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                  background:
                                    "radial-gradient(circle at 50% 45%, rgba(74,222,128,0.2), transparent 62%)",
                                }}
                                aria-hidden="true"
                              />
                              <Image
                                src={tier.image}
                                alt={tier.name}
                                width={320}
                                height={240}
                                className="relative z-10 max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                                style={{
                                  filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.55))",
                                }}
                              />
                            </div>

                            {/* Body */}
                            <div className="flex flex-1 flex-col p-6">
                              <p className="text-base font-bold text-[#4ADE80]">
                                {tier.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 mb-3">
                                {tier.example}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                {tier.description}
                              </p>
                              <div className="mt-auto flex flex-col gap-2.5 border-t border-border pt-4">
                                {tier.specs.map((spec) => (
                                  <div key={spec} className="flex items-start gap-2.5">
                                    <Check className="h-4 w-4 text-[#4ADE80] shrink-0 mt-0.5" />
                                    <span className="text-xs text-muted-foreground">
                                      {spec}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                  <div className="h-px bg-border max-w-5xl mx-auto" />
                </div>
              );
            }

            return (
              <div key={item.id}>
                <ScrollReveal>
                  <div id={item.id} className="py-14 scroll-mt-24 max-w-6xl mx-auto">
                    <div
                      className={`flex flex-col gap-12 items-center ${
                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Image — full-bleed photo */}
                      <div className="relative aspect-video w-full md:w-1/2 shrink-0 rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent"
                          aria-hidden="true"
                        />
                        <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/80 px-4 py-2 rounded-lg">
                          <p className="font-bold text-[#4ADE80] text-xl leading-none">
                            {item.metric.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.metric.label}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="w-full md:w-1/2">
                        <span className="text-xs uppercase tracking-wider bg-secondary text-[#4ADE80] px-3 py-1 rounded-md inline-block mb-4">
                          {item.badge}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Generic features */}
                        {item.features && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.features.map((feature) => (
                              <div key={feature} className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-[#4ADE80] shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Safety features */}
                        {item.safetyFeatures && (
                          <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#4ADE80] mb-3">
                              {t("safetyLabel")}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.safetyFeatures.map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                  <Check className="h-4 w-4 text-[#4ADE80] shrink-0 mt-0.5" />
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Operational features */}
                        {item.operationalFeatures && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#4ADE80] mb-3">
                              {t("operationalLabel")}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.operationalFeatures.map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                  <Check className="h-4 w-4 text-[#4ADE80] shrink-0 mt-0.5" />
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                <div className="h-px bg-border max-w-5xl mx-auto" />
              </div>
            );
          })}

          {/* Roadmap teaser — não é produto entregue, tratamento visual distinto */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto pt-14 pb-2 text-center">
              <div className="agro-glass-card-hover group inline-flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#16A34A]/40 px-8 py-10 max-w-2xl mx-auto">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <span className="agro-glow-orb absolute inset-0 rounded-full" aria-hidden="true" />
                  <Sprout className="relative h-8 w-8 text-[#4ADE80]" />
                </div>
                <span className="inline-block rounded-full border border-[#16A34A]/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#4ADE80]">
                  {offeringRoadmap.badge}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {offeringRoadmap.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {offeringRoadmap.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="como-funciona" className="scroll-mt-24 relative overflow-hidden bg-background px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
                {t("howItWorks.kicker")}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                {t("howItWorks.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                {t("howItWorks.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div
              className="pointer-events-none absolute left-0 right-0 top-7 hidden md:block"
              aria-hidden="true"
            >
              <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent" />
            </div>

            {steps.map((s, i) => {
              const Icon = STEP_ICONS[s.icon] ?? Activity;
              return (
                <ScrollReveal key={s.step} delay={i * 120}>
                  <div className="relative text-center">
                    <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#16A34A]/40 bg-background">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%)" }}
                        aria-hidden="true"
                      />
                      <Icon className="relative h-6 w-6 text-[#4ADE80]" />
                    </div>
                    <div className="mb-2 font-mono text-xs font-semibold tracking-widest text-[#4ADE80]/70">
                      {s.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                    <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted-foreground">
                      {s.text}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Market / why now ── */}
      <section className="bg-card px-6 py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
              {t("market.kicker")}
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              {t("market.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {t("market.text")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100} className="mt-12">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {marketStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-background p-6 text-center">
                <p className="text-2xl font-bold text-[#4ADE80] md:text-3xl">{stat.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <ScrollReveal>
          <div className="glass-card relative overflow-hidden rounded-2xl max-w-3xl mx-auto p-12">
            <AuroraBackground grid={false} particles={false} className="opacity-50" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("cta.text")}
              </p>
              <Link
                href="/agrofy/contato"
                className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
