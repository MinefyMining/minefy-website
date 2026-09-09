import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ExperienceLab } from "@/components/experience-lab";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiences.metadata" });
  return pageMetadata({
    site: "mineracao",
    path: "/experiencias",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ExperiencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experiences");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section data-hero-surface="theme" className="relative overflow-hidden px-6 pt-36 pb-10">
        <AuroraBackground grid={false} particles={false} className="opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("hero.kicker")}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Lab ── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <ExperienceLab />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-20 text-center">
        <ScrollReveal>
          <div className="glass-card relative mx-auto max-w-3xl overflow-hidden rounded-2xl p-12">
            <AuroraBackground grid={false} particles={false} className="opacity-50" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {t("cta.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8">
                <Link
                  href="/contato?servico=agentes-autonomos"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-8 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#C49B3F]"
                >
                  {t("cta.button")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
