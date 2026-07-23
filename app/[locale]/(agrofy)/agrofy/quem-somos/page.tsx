import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agrofyAbout.metadata" });
  return { title: t("title"), description: t("description") };
}

/**
 * Agrofy "Quem Somos" — green mirror of `(mineracao)/quem-somos/page.tsx`
 * (same Hero → Intro → Mission/Vision/Values → CTA flow), with ONE
 * deliberate omission: the "Numbers" section between Intro and
 * Mission/Vision/Values. Agrofy has no founding-year/product-count/client
 * numbers to show yet — the CEO was explicit ("número não entra ainda").
 * Do not re-add a numbers block here without an explicit CEO go-ahead.
 */
export default async function AgrofyAboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agrofyAbout");

  const valueItems = t.raw("values.items") as Array<{
    title: string;
    text: string;
  }>;

  return (
    <div className="agro-theme min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/images/agro/aerea-colheita-milho.jpg"
          alt="Vista aérea de colheita de milho"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" aria-hidden="true" />
        <AuroraBackground className="opacity-50" />
        <div className="relative z-10 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-20 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("intro.text")}
            </p>
            <div className="bg-card p-6 rounded-xl border-l-4 border-[#16A34A] mt-8">
              <p className="text-lg font-medium text-foreground italic">
                {t("intro.highlight")}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Mission + Vision */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-[#4ADE80] mb-3">
                  {t("mission.title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("mission.text")}
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-[#4ADE80] mb-3">
                  {t("vision.title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("vision.text")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Values */}
          <ScrollReveal delay={100}>
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-[#4ADE80] mb-6">
                {t("values.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {valueItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0 mt-2" />
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 px-6 text-center">
        <AuroraBackground particles={false} className="opacity-50" />
        <ScrollReveal className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t("cta.title")}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
            >
              {t("cta.contactUs")}
            </Link>
            <a
              href="https://app.agrofymining.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-8 py-3 rounded-lg font-medium text-sm hover:border-foreground/40 hover:bg-foreground/5 transition-colors duration-200"
            >
              {t("cta.platform")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
