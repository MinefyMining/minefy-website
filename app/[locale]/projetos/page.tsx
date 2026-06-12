import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, FileText, Radio, ShieldCheck, Gauge, Leaf, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { TelemetryCard } from "@/components/telemetry-card";
import { Link } from "@/i18n/navigation";

const SECTION_ICONS: LucideIcon[] = [FileText, Radio, ShieldCheck, Gauge, Leaf];

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
        <AuroraBackground className="opacity-50" />
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
            <h2 className="text-3xl font-bold text-foreground mt-6 mb-4">
              {t("vargemGrande.title")}
            </h2>
          </ScrollReveal>

          {/* Intro */}
          <ScrollReveal delay={120}>
            <p className="text-lg text-[#888] mb-12 leading-relaxed">
              {t("vargemGrande.intro")}
            </p>
          </ScrollReveal>

          {/* Metrics + live telemetry card */}
          <ScrollReveal delay={160}>
            <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-[#222] bg-[#111] p-6"
                  >
                    <p className="text-2xl font-bold text-[#D4A847]">{metric.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-[#888]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
              <TelemetryCard title="Operação real · ActiSky" />
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

          {/* Content sections — visual cards with icon + gold accent */}
          <div className="grid gap-5 md:grid-cols-2">
            {sections.map((section, index) => {
              const Icon = SECTION_ICONS[index] ?? FileText;
              return (
                <ScrollReveal key={index} delay={index * 60}>
                  <div className="glass-card group h-full rounded-2xl p-7 transition-colors duration-300 hover:border-[#D4A847]/30">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4A847]/25 bg-[#D4A847]/10">
                        <Icon className="h-5 w-5 text-[#D4A847]" />
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                    </div>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{section.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Impact cards */}
          <ScrollReveal delay={100}>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {impactItems.map((item, index) => (
                <div key={index} className="glass-card rounded-2xl p-6">
                  <h4 className="mb-2 font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Conclusion — highlighted quote */}
          <ScrollReveal delay={100}>
            <div className="glass-card gradient-border relative mt-12 overflow-hidden rounded-2xl p-10 text-center">
              <span
                className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#D4A847] to-transparent"
                aria-hidden="true"
              />
              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-foreground">
                {conclusion}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 px-6 text-center">
        <AuroraBackground particles={false} className="opacity-50" />
        <div className="relative z-10">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
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
        </div>
      </section>
    </div>
  );
}
