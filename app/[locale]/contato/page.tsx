import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { ContactForm } from "@/components/contact-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      {/* Hero */}
      <HeroSection
        imageSrc="/images/backgrounds/15670.jpg"
        imageAlt={t("hero.title")}
        title={t("hero.title")}
        showArrow
      />

      {/* Contact — image left, form right */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: image */}
          <div className="relative aspect-square rounded-[1.875rem] overflow-hidden">
            <Image
              src="/images/projects/2151307796.jpg"
              alt={t("title")}
              fill
              className="object-cover"
            />
          </div>
          {/* Right: title + intro + form */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {t("title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("intro")}
            </p>
            <ContactForm variant="full" />
          </div>
        </div>
      </section>
    </>
  );
}
