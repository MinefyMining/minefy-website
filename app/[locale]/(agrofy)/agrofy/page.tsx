import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  ArrowRight,
  Satellite,
  Fuel,
  Gauge,
  Wrench,
  Sprout,
  Radio,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { AgroTelemetryCard } from "@/components/agro-telemetry-card";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

const OFFERING_ICONS: Record<string, LucideIcon> = {
  satellite: Satellite,
  fuel: Fuel,
  gauge: Gauge,
  wrench: Wrench,
  sprout: Sprout,
};

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
    icon: string;
    badge: string;
    title: string;
    description: string;
    roadmap?: boolean;
  }>;

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
            <Image
              src="/images/agro/agrofy-logo.png"
              alt="Agrofy — divisão de agronegócio da Minefy"
              width={200}
              height={200}
              priority
              className="h-16 w-16 drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] sm:h-20 sm:w-20"
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/40 bg-[#16A34A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
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

      {/* ── Offerings ── */}
      <section id="ofertas" className="scroll-mt-24 bg-card px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]">
                {t("offerings.kicker")}
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
                {t("offerings.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t("offerings.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offeringItems.map((item, index) => {
              const Icon = OFFERING_ICONS[item.icon] ?? Sprout;
              return (
                <ScrollReveal key={item.title} delay={index * 80}>
                  <div
                    className={`agro-glass-card-hover group flex h-full flex-col gap-4 rounded-xl p-6 ${
                      item.roadmap ? "border-dashed opacity-90" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-widest ${
                          item.roadmap
                            ? "border-muted-foreground/30 text-muted-foreground"
                            : "border-[#16A34A]/30 text-[#4ADE80]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div className="relative flex h-14 w-14 items-center justify-center">
                      {!item.roadmap && (
                        <span className="agro-glow-orb absolute inset-0 rounded-full" aria-hidden="true" />
                      )}
                      <Icon
                        className={`relative h-10 w-10 transition-transform duration-300 group-hover:scale-110 ${
                          item.roadmap ? "text-muted-foreground" : "text-[#4ADE80]"
                        }`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <h3 className="text-lg font-semibold leading-snug text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
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
