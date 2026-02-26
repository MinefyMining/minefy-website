import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { SolutionCard } from "@/components/solution-card";
import { PillarCard } from "@/components/pillar-card";
import { ClientCarousel } from "@/components/client-carousel";
import { ContactForm } from "@/components/contact-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      {/* Section 1: Hero */}
      <HeroSection
        imageSrc="/images/hero/9864-1.jpg"
        imageAlt="Soluções Tecnológicas para a Indústria"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        ctaText={t("hero.cta")}
        ctaHref="#solucoes"
      />

      {/* Section 2: Solutions */}
      <section id="solucoes" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={t("solutions.title")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(
              t.raw("solutions.items") as Array<{
                title: string;
                description: string;
              }>
            ).map((item, i) => (
              <SolutionCard
                key={i}
                title={item.title}
                description={item.description}
                ctaText={t("solutions.cta")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Product Images */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {[
            { src: "/images/products/galileosky-01.webp", w: 200, h: 200 },
            { src: "/images/products/galileosky-02.webp", w: 250, h: 250 },
            { src: "/images/products/galileosky-03.webp", w: 200, h: 250 },
          ].map((img, i) => (
            <Image
              key={i}
              src={img.src}
              alt="Galileosky Hub"
              width={img.w}
              height={img.h}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Featured Projects */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={t("projects.title")} />
          <ClientCarousel />
        </div>
      </section>

      {/* Section 5: Pillars */}
      <section className="relative py-20 px-4">
        <Image
          src="/images/backgrounds/12879512-1.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeading
            subtitle={t("pillars.sectionTitle")}
            title={t("pillars.title")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              t.raw("pillars.items") as Array<{
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

      {/* Section 6: Contact Form */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={t("contact.title")} />
          <ContactForm variant="compact" />
        </div>
      </section>
    </>
  );
}
