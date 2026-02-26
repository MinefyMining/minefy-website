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

  const sections = [
    { key: "context", image: "/images/solutions/78.jpg" },
    { key: "telemetry", image: "/images/solutions/2151307800-1.jpg" },
    { key: "monitoring", image: "/images/solutions/2151307759.jpg" },
    { key: "safety", image: "/images/projects/2151307796.jpg" },
    { key: "efficiency", image: null },
    { key: "sustainability", image: "/images/projects/2151582401.jpg" },
  ];

  return (
    <>
      {/* Hero */}
      <HeroSection
        imageSrc="/images/backgrounds/883-1.jpg"
        imageAlt={t("hero.title")}
        title={t("hero.title")}
      />

      {/* Case Study Title */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto text-primary">
          {t("vargemGrande.title")}
        </h2>
      </section>

      {/* Case Study Sections */}
      {sections.map(({ key, image }, i) => (
        <section
          key={key}
          className={`py-12 px-4 ${i % 2 === 1 ? "bg-muted" : ""}`}
        >
          <div
            className={`max-w-6xl mx-auto ${image ? "grid grid-cols-1 md:grid-cols-2 gap-12 items-center" : ""}`}
          >
            {image && i % 2 === 0 && (
              <div className="relative aspect-video rounded-[1.875rem] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`vargemGrande.${key}.title`)}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className={image ? "" : "max-w-3xl mx-auto text-center"}>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                {t(`vargemGrande.${key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(`vargemGrande.${key}.text`)}
              </p>
            </div>
            {image && i % 2 !== 0 && (
              <div className="relative aspect-video rounded-[1.875rem] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`vargemGrande.${key}.title`)}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Impact */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6 text-primary">
            {t("vargemGrande.impact.title")}
          </h3>
          <ul className="space-y-3 text-left inline-block">
            {(t.raw("vargemGrande.impact.items") as string[]).map(
              (item, i) => (
                <li
                  key={i}
                  className="text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span> {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h3 className="text-2xl font-bold mb-4 text-primary">{t("cta.title")}</h3>
        <p className="text-muted-foreground mb-8">{t("cta.text")}</p>
        <Link
          href="/contato"
          className="inline-block rounded-[1.25rem] bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
        >
          {t("cta.button")}
        </Link>
      </section>
    </>
  );
}
