import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { PillarCard } from "@/components/pillar-card";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  return (
    <>
      {/* Hero */}
      <HeroSection
        imageSrc="/images/backgrounds/7946.jpg"
        imageAlt={t("hero.title")}
        title={t("hero.title")}
      />

      {/* Description */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("description.title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("description.text")}
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("mission.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("mission.text")}
            </p>
          </div>
          {/* Vision */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("vision.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("vision.text")}
            </p>
          </div>
          {/* Values */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              {t("values.title")}
            </h3>
            <ul className="space-y-3">
              {(
                t.raw("values.items") as Array<{ title: string; text: string }>
              ).map((item, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {item.title}:
                  </span>{" "}
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle={tHome("pillars.sectionTitle")}
            title={tHome("pillars.title")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              tHome.raw("pillars.items") as Array<{
                title: string;
                description: string;
              }>
            ).map((item, i) => (
              <PillarCard
                key={i}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/solucoes"
            className="inline-block rounded-[1.25rem] bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            {t("cta.learnMore")}
          </Link>
          <Link
            href="/contato"
            className="inline-block rounded-[1.25rem] border border-primary text-primary px-8 py-3 font-medium hover:bg-primary/10 transition-colors"
          >
            {t("cta.contactUs")}
          </Link>
        </div>
      </section>
    </>
  );
}
