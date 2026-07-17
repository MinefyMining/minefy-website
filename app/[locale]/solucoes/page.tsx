import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { TelemetryCard } from "@/components/telemetry-card";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutions.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");

  const items = t.raw("items") as Array<{
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
    /** When true, renders `image` on a dark "studio stage" (like the tablet
     * tiers) instead of a full-bleed cover photo — for product cutouts with
     * a transparent background rather than on-site photography. */
    studioImage?: boolean;
    metric: { value: string; label: string };
  }>;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-24">
        <Image
          src="/images/mining/komatsu-pc2000.jpg"
          alt="Vista aérea de mina a céu aberto"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/80" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40"
          aria-hidden="true"
        />
        <AuroraBackground grid={false} particles={false} className="opacity-50" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.3fr_1fr]">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            {t("hero.title")}
          </h1>
          <div className="hidden lg:block">
            <TelemetryCard className="ml-auto max-w-sm" />
          </div>
        </div>
      </section>

      {/* ── Solutions List ── */}
      <div className="px-6">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          // ── Tablets: full-width 3-tier showcase ──
          if (item.tiers) {
            return (
              <div key={item.id}>
                <ScrollReveal>
                  <section
                    id={item.id}
                    className="py-20 scroll-mt-24 max-w-6xl mx-auto"
                  >
                    <div className="text-center mb-12">
                      <span className="text-xs uppercase tracking-wider bg-secondary text-[#D4A847] px-3 py-1 rounded-md inline-block mb-4">
                        {item.badge}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {item.tiers.map((tier) => (
                        <div
                          key={tier.name}
                          className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-[#D4A847]/50 hover:-translate-y-1"
                        >
                          {/* Product image — studio stage */}
                          <div className="relative h-64 overflow-hidden flex items-center justify-center p-7 bg-gradient-to-b from-[#191919] to-[#0C0C0C]">
                            {/* soft top light */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.06), transparent 60%)",
                              }}
                              aria-hidden="true"
                            />
                            {/* gold stage glow at base */}
                            <div
                              className="absolute inset-x-0 bottom-0 h-24"
                              style={{
                                background:
                                  "radial-gradient(60% 100% at 50% 100%, rgba(212,168,71,0.12), transparent 70%)",
                              }}
                              aria-hidden="true"
                            />
                            {/* gold glow on hover */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background:
                                  "radial-gradient(circle at 50% 45%, rgba(212,168,71,0.18), transparent 62%)",
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
                                filter:
                                  "drop-shadow(0 18px 30px rgba(0,0,0,0.55))",
                              }}
                            />
                          </div>

                          {/* Body */}
                          <div className="flex flex-1 flex-col p-6">
                            <p className="text-base font-bold text-[#D4A847]">
                              {tier.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 mb-3">
                              {tier.example}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                              {tier.description}
                            </p>
                            <div className="mt-auto flex flex-col gap-2.5 border-t border-[#1F1F1F] pt-4">
                              {tier.specs.map((spec) => (
                                <div
                                  key={spec}
                                  className="flex items-start gap-2.5"
                                >
                                  <Check className="h-4 w-4 text-[#D4A847] shrink-0 mt-0.5" />
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
                  </section>
                </ScrollReveal>

                {index < items.length - 1 && (
                  <div className="h-px bg-border max-w-5xl mx-auto" />
                )}
              </div>
            );
          }

          return (
            <div key={item.id}>
              <ScrollReveal>
                <section
                  id={item.id}
                  className="py-20 scroll-mt-24 max-w-6xl mx-auto"
                >
                  <div
                    className={`flex flex-col gap-12 items-center ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Image — studio-stage cutout (transparent PNG) or full-bleed photo */}
                    <div className="relative aspect-video w-full md:w-1/2 shrink-0 rounded-xl overflow-hidden">
                      {item.studioImage ? (
                        <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#191919] to-[#0C0C0C] p-3">
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.06), transparent 60%)",
                            }}
                            aria-hidden="true"
                          />
                          <div
                            className="absolute inset-x-0 bottom-0 h-28"
                            style={{
                              background:
                                "radial-gradient(60% 100% at 50% 100%, rgba(212,168,71,0.16), transparent 70%)",
                            }}
                            aria-hidden="true"
                          />
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="relative z-10 object-contain"
                            style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.55))" }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/80 px-4 py-2 rounded-lg">
                        <p className="font-bold text-[#D4A847] text-xl leading-none">
                          {item.metric.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.metric.label}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                      <span className="text-xs uppercase tracking-wider bg-secondary text-[#D4A847] px-3 py-1 rounded-md inline-block mb-4">
                        {item.badge}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Generic features */}
                      {item.features && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <Check className="h-4 w-4 text-[#D4A847] shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Safety features */}
                      {item.safetyFeatures && (
                        <div className="mb-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A847] mb-3">
                            {t("safetyLabel")}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.safetyFeatures.map((feature) => (
                              <div key={feature} className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-[#D4A847] shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Operational features */}
                      {item.operationalFeatures && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A847] mb-3">
                            {t("operationalLabel")}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.operationalFeatures.map((feature) => (
                              <div key={feature} className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-[#D4A847] shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </ScrollReveal>

              {/* Divider */}
              {index < items.length - 1 && (
                <div className="h-px bg-border max-w-5xl mx-auto" />
              )}
            </div>
          );
        })}
      </div>

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
                href="/contato"
                className="inline-flex items-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#C49B3F] transition-colors duration-200"
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
