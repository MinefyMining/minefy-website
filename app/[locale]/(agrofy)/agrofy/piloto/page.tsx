import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  Radio,
  TrendingUp,
  CheckCircle2,
  Gauge,
  Droplets,
  Clock,
  AlertTriangle,
  LayoutDashboard,
  FileText,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";
import { Link } from "@/i18n/navigation";

const STEP_ICONS: LucideIcon[] = [Search, Radio, TrendingUp, CheckCircle2];
const MEASURED_ICONS: LucideIcon[] = [Gauge, Droplets, Clock, AlertTriangle];
const DELIVERABLE_ICONS: LucideIcon[] = [LayoutDashboard, FileText, Wrench];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agrofyPilot.metadata" });
  return { title: t("title"), description: t("description") };
}

/**
 * Agrofy "Piloto" — takes the visual slot of the mineração `/projetos` page
 * (same Hero → content-in-blocks → CTA shape), but the content is NOT a
 * client case study — Agrofy has no named agro client or adoption number
 * yet. This page instead explains the pilot METHODOLOGY: discovery → paid
 * focused pilot → ROI measurement inside a harvest cycle → data-driven scale
 * decision. No price, no client name, no invented traction number — CTA
 * routes to `/agrofy/contato` for a specialist conversation.
 */
export default async function AgrofyPilotPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agrofyPilot");

  const stepItems = t.raw("steps.items") as Array<{
    title: string;
    text: string;
  }>;

  const measuredItems = t.raw("measured.items") as Array<{
    title: string;
    text: string;
  }>;

  const deliverableItems = t.raw("deliverables.items") as Array<{
    title: string;
    text: string;
  }>;

  return (
    <div className="agro-theme min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/images/agro/trator-semeadura-golden-hour.jpg"
          alt="Trator em operação de semeadura ao entardecer"
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
          <p className="mt-4 text-lg text-white/80">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">

          {/* Intro */}
          <ScrollReveal>
            <span className="inline-block bg-secondary text-[#4ADE80] px-4 py-2 rounded-lg text-xs uppercase tracking-wider">
              {t("intro.badge")}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="text-3xl font-bold text-foreground mt-6 mb-4">
              {t("intro.title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="text-lg text-muted-foreground mb-16 leading-relaxed max-w-3xl">
              {t("intro.text")}
            </p>
          </ScrollReveal>

          {/* ── Steps ── */}
          <ScrollReveal>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {t("steps.title")}
            </h3>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-2">
            {stepItems.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? Search;
              return (
                <ScrollReveal key={index} delay={index * 60}>
                  <div className="glass-card agro-glass-card-hover group h-full rounded-2xl p-7 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/10">
                        <Icon className="h-5 w-5 text-[#4ADE80]" />
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-[#4ADE80]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h4 className="text-lg font-semibold text-foreground">
                          {step.title}
                        </h4>
                      </div>
                    </div>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Full-width photo break */}
          <div className="relative aspect-video rounded-xl overflow-hidden my-16">
            <Image
              src="/images/agro/hero-colheitadeira-soja-poente.jpg"
              alt="Colheitadeira de grande porte em operação numa lavoura de soja ao entardecer"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* ── What is measured ── */}
          <ScrollReveal>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {t("measured.title")}
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-16">
            {measuredItems.map((item, index) => {
              const Icon = MEASURED_ICONS[index] ?? Gauge;
              return (
                <ScrollReveal key={index} delay={index * 60}>
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#16A34A]/25 bg-[#16A34A]/10 mb-4">
                      <Icon className="h-5 w-5 text-[#4ADE80]" />
                    </span>
                    <h4 className="mb-2 font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* ── What you receive ── */}
          <ScrollReveal>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {t("deliverables.title")}
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {deliverableItems.map((item, index) => {
              const Icon = DELIVERABLE_ICONS[index] ?? LayoutDashboard;
              return (
                <ScrollReveal key={index} delay={index * 60}>
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#16A34A]/25 bg-[#16A34A]/10 mb-4">
                      <Icon className="h-5 w-5 text-[#4ADE80]" />
                    </span>
                    <h4 className="mb-2 font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
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
            <p className="text-muted-foreground mb-8">{t("cta.text")}</p>
            <Link
              href="/agrofy/contato"
              className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#15803D] transition-colors duration-200"
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
