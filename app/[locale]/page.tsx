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

  const solutionItems = t.raw("solutions.items") as Array<{
    title: string;
    description: string;
  }>;

  const pillarItems = t.raw("pillars.items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <>
      {/* Section 1: Hero — left-aligned text */}
      <HeroSection
        imageSrc="/images/hero/9864-1.jpg"
        imageAlt="Soluções Tecnológicas para a Indústria"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        ctaText={t("hero.cta")}
        ctaHref="#solucoes"
        align="left"
      />

      {/* Section 2: Solutions — image left, list right, products below */}
      <section id="solucoes" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={t("solutions.title")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: large image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/hero/2151307800-1.jpg"
                alt="Soluções industriais"
                fill
                className="object-cover"
              />
            </div>
            {/* Right: solution list + product images */}
            <div>
              <div className="space-y-0">
                {solutionItems.map((item, i) => (
                  <SolutionCard
                    key={i}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
              {/* Product images below list */}
              <div className="flex items-center justify-center gap-6 mt-10">
                {[
                  {
                    src: "/images/products/galileosky-01.webp",
                    w: 120,
                    h: 120,
                  },
                  {
                    src: "/images/products/galileosky-02.webp",
                    w: 150,
                    h: 150,
                  },
                  {
                    src: "/images/products/galileosky-03.webp",
                    w: 120,
                    h: 150,
                  },
                ].map((img, i) => (
                  <Image
                    key={i}
                    src={img.src}
                    alt="Galileosky Hub"
                    width={img.w}
                    height={img.h}
                    className="object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Projects — white/light background */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {t("projects.title")}
          </h2>
          <ClientCarousel />
        </div>
      </section>

      {/* Section 4: Pillars — split layout: image+text left, cards right */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: image with text overlay */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="/images/backgrounds/12879512-1.jpg"
                alt="Pilares da Auctify"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-sm uppercase tracking-wider text-primary mb-2">
                  {t("pillars.sectionTitle")}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {t("pillars.title")}
                </h2>
              </div>
            </div>
          </div>
          {/* Right: 2x3 grid of pillar cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarItems.map((item, i) => (
              <PillarCard
                key={i}
                title={item.title}
                description={item.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Contact — logo+image left, form right */}
      <section className="py-20 px-4 md:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={t("contact.title")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: image */}
            <div>
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="/images/hero/2151307800-1.jpg"
                  alt="Contato Auctify"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Right: form */}
            <ContactForm variant="compact" />
          </div>
        </div>
      </section>
    </>
  );
}
