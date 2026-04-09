import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const metrics = t.raw("vargemGrande.metrics") as Array<{
    value: string;
    label: string;
  }>;

  const sections = t.raw("vargemGrande.sections") as Array<{
    title: string;
    text: string;
  }>;

  const impactItems = t.raw("vargemGrande.impact.items") as Array<{
    title: string;
    text: string;
  }>;

  const conclusion = t("vargemGrande.conclusion") as string;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/images/mining/mine-brazil-aerial.jpg"
          alt="Grande escavadeira em operação de mineração"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" aria-hidden="true" />
        <div className="relative z-10 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      {/* ── Case Study ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <ScrollReveal>
            <span className="inline-block bg-[#1A1A1A] text-[#D4A847] px-4 py-2 rounded-lg text-xs uppercase tracking-wider">
              {t("vargemGrande.badge")}
            </span>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal delay={80}>
            <h2 className="text-3xl font-bold text-white mt-6 mb-4">
              {t("vargemGrande.title")}
            </h2>
          </ScrollReveal>

          {/* Intro */}
          <ScrollReveal delay={120}>
            <p className="text-lg text-[#888] mb-12 leading-relaxed">
              {t("vargemGrande.intro")}
            </p>
          </ScrollReveal>

          {/* Metrics */}
          <ScrollReveal delay={160}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-[#111] rounded-xl p-6 border border-[#222]"
                >
                  <p className="text-2xl font-bold text-[#D4A847]">{metric.value}</p>
                  <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Full-width photo break — terraced mine pit */}
          <div className="relative aspect-video rounded-xl overflow-hidden my-12">
            <Image
              src="/images/mining/mine-operation-trucks.jpg"
              alt="Mina a céu aberto com terraços — vista panorâmica"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Content sections */}
          {sections.map((section, index) => (
            <ScrollReveal key={index} delay={index * 60}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-[#888] leading-relaxed">{section.text}</p>
              </div>
            </ScrollReveal>
          ))}

          {/* Impact cards */}
          <ScrollReveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {impactItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#111] rounded-xl p-6 border border-[#222]"
                >
                  <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-[#888] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Conclusion */}
          <ScrollReveal delay={100}>
            <div className="bg-[#111] rounded-xl p-8 border border-[#222] text-center mt-12">
              <p className="text-[#888] leading-relaxed">{conclusion}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-[#888] mb-8">{t("cta.text")}</p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#C49B3F] transition-colors duration-200"
          >
            {t("cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
