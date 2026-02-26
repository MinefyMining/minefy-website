import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "solutions.metadata",
  });
  return { title: t("title"), description: t("description") };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    image: string;
    features?: string[];
    safetyFeatures?: string[];
    operationalFeatures?: string[];
    benefits?: string[];
  }>;

  return (
    <div className="bg-[#212121]">
      {/* Hero */}
      <HeroSection
        imageSrc="/images/backgrounds/15670.jpg"
        imageAlt={t("hero.title")}
        title={t("hero.title")}
        showArrow
      />

      {/* Solutions */}
      {items.map((item, i) => (
        <section
          key={item.title}
          id={`solucao-${i}`}
          className="py-16 px-4 md:px-8 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image — always left */}
            <div className="relative aspect-square rounded-[1.875rem] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Content — always right */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>

              {item.features && (
                <ul className="space-y-2">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span> {f}
                    </li>
                  ))}
                </ul>
              )}

              {item.safetyFeatures && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary">
                    {t("safetyLabel")}
                  </h4>
                  <ul className="space-y-1">
                    {item.safetyFeatures.map((f) => (
                      <li
                        key={f}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.operationalFeatures && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary">
                    {t("operationalLabel")}
                  </h4>
                  <ul className="space-y-1">
                    {item.operationalFeatures.map((f) => (
                      <li
                        key={f}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.benefits && (
                <ul className="space-y-2">
                  {item.benefits.map((b) => (
                    <li
                      key={b}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Banner */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden">
        <Image
          src="/images/backgrounds/7946.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t("cta.title")}
            </h3>
            <p className="text-white/80 text-lg">
              {t("cta.text")}
            </p>
          </div>
          <Link
            href="/contato"
            className="shrink-0 inline-block rounded-lg bg-primary text-primary-foreground px-8 py-4 font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}
