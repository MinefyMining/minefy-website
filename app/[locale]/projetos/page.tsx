import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "projects.metadata",
  });
  return { title: t("title"), description: t("description") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const images = [
    "/images/solutions/78.jpg",
    "/images/solutions/2151307800-1.jpg",
    "/images/solutions/2151307759.jpg",
    "/images/projects/2151307796.jpg",
    "/images/projects/2151582401.jpg",
  ];

  const textSections = [
    "context",
    "telemetry",
    "monitoring",
    "safety",
    "efficiency",
    "sustainability",
  ] as const;

  const impactItems = t.raw("vargemGrande.impact.items") as Array<{
    title: string;
    text: string;
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

      {/* Case Study */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: images stacked */}
          <div className="flex flex-col gap-6">
            {images.map((src) => (
              <div
                key={src}
                className="relative aspect-4/3 rounded-[1.875rem] overflow-hidden"
              >
                <Image
                  src={src}
                  alt={t("vargemGrande.title")}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right: all text content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary">
              {t("vargemGrande.title")}
            </h2>

            {textSections.map((key) => (
              <div key={key} className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-primary">
                  {t(`vargemGrande.${key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`vargemGrande.${key}.text`)}
                </p>
              </div>
            ))}

            {/* Impact */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-primary">
                {t("vargemGrande.impact.title")}
              </h3>
              <div className="space-y-4">
                {impactItems.map((item) => (
                  <div key={item.title}>
                    <h4 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                {t("vargemGrande.conclusion.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {t("vargemGrande.conclusion.text")}
              </p>
            </div>
          </div>
        </div>
      </section>

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
