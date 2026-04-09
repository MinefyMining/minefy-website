import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    safetyFeatures?: string[];
    operationalFeatures?: string[];
    image: string;
    metric: { value: string; label: string };
  }>;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/images/mining/komatsu-pc2000.jpg"
          alt="Vista aérea de mina a céu aberto"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" aria-hidden="true" />
        <div className="relative z-10 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      {/* ── Solutions List ── */}
      <div className="px-6">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

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
                    {/* Image */}
                    <div className="relative aspect-video w-full md:w-1/2 shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/80 px-4 py-2 rounded-lg">
                        <p className="font-bold text-[#D4A847] text-xl leading-none">
                          {item.metric.value}
                        </p>
                        <p className="text-xs text-[#888] mt-0.5">
                          {item.metric.label}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                      <span className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-[#D4A847] px-3 py-1 rounded-md inline-block mb-4">
                        {item.badge}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {item.title}
                      </h2>
                      <p className="text-[#888] mb-6 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Generic features */}
                      {item.features && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <Check className="h-4 w-4 text-[#D4A847] shrink-0 mt-0.5" />
                              <span className="text-sm text-[#888]">{feature}</span>
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
                                <span className="text-sm text-[#888]">{feature}</span>
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
                                <span className="text-sm text-[#888]">{feature}</span>
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
                <div className="h-px bg-[#222] max-w-5xl mx-auto" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <ScrollReveal>
          <div className="bg-[#111] rounded-2xl max-w-3xl mx-auto p-12 border border-[#222]">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-[#888] mb-8 leading-relaxed">
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
        </ScrollReveal>
      </section>
    </div>
  );
}
