import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
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

  const pillarItems = tHome.raw("pillars.items") as Array<{
    title: string;
    description: string;
  }>;

  const valueItems = t.raw("values.items") as Array<{
    title: string;
    text: string;
  }>;

  return (
    <>
      {/* Hero */}
      <HeroSection
        imageSrc="/images/backgrounds/15670.jpg"
        imageAlt={t("hero.title")}
        title={t("hero.title")}
        showArrow
      />

      {/* Quem Somos + Missão / Visão / Valores — stacked, left-aligned */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            {t("description.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            {t("description.text")}
          </p>

          {/* Missão */}
          <div className="border-t border-primary/30 py-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {t("mission.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t("mission.text")}
            </p>
          </div>

          {/* Visão */}
          <div className="border-t border-primary/30 py-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {t("vision.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t("vision.text")}
            </p>
          </div>

          {/* Valores */}
          <div className="border-t border-primary/30 py-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">
              {t("values.title")}
            </h3>
            <ul className="space-y-2">
              {valueItems.map((item) => (
                <li key={item.title} className="text-muted-foreground text-sm">
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

      {/* Pilares — split layout: image+text left, cards right */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: image with text overlay */}
          <div className="relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-0">
            <Image
              src="/images/backgrounds/12879512-1.jpg"
              alt="Pilares da Auctify"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-sm uppercase tracking-wider text-primary mb-2">
                {tHome("pillars.sectionTitle")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {tHome("pillars.title")}
              </h2>
              <Link
                href="/solucoes"
                className="inline-block rounded-[1.25rem] bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t("cta.discover")}
              </Link>
            </div>
          </div>
          {/* Right: pillar cards stacked */}
          <div className="flex flex-col gap-3 justify-center">
            {pillarItems.map((item, i) => (
              <PillarCard
                key={item.title}
                title={item.title}
                description={item.description}
                index={i}
              />
            ))}
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
            {t("cta.contactUs")}
          </Link>
        </div>
      </section>
    </>
  );
}
