import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
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

  const numberItems = t.raw("numbers.items") as Array<{
    value: string;
    label: string;
  }>;

  const valueItems = t.raw("values.items") as Array<{
    title: string;
    text: string;
  }>;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/images/mining/mine-aerial-cava.jpg"
          alt="Operação de mineração panorâmica"
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

      {/* ── Intro ── */}
      <section className="py-20 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-[#888] leading-relaxed">
              {t("intro.text")}
            </p>
            <div className="bg-[#111] p-6 rounded-xl border-l-4 border-[#D4A847] mt-8">
              <p className="text-lg font-medium text-white italic">
                {t("intro.highlight")}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Numbers ── */}
      <section className="py-16 bg-[#111] border-y border-[#222] px-6">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {numberItems.map((item, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-[#D4A847]">{item.value}</p>
                <p className="text-sm text-[#888] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Mission + Vision */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                <h3 className="text-lg font-semibold text-[#D4A847] mb-3">
                  {t("mission.title")}
                </h3>
                <p className="text-[#888] leading-relaxed">
                  {t("mission.text")}
                </p>
              </div>
              <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                <h3 className="text-lg font-semibold text-[#D4A847] mb-3">
                  {t("vision.title")}
                </h3>
                <p className="text-[#888] leading-relaxed">
                  {t("vision.text")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Values */}
          <ScrollReveal delay={100}>
            <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
              <h3 className="text-lg font-semibold text-[#D4A847] mb-6">
                {t("values.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {valueItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#D4A847] shrink-0 mt-2" />
                    <div>
                      <p className="font-semibold text-white text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-[#888] text-sm leading-relaxed">
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
      <section className="py-20 px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {t("cta.title")}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#C49B3F] transition-colors duration-200"
            >
              {t("cta.contactUs")}
            </Link>
            <a
              href="https://app.minefymining.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#444] text-white px-8 py-3 rounded-lg font-medium text-sm hover:border-[#666] hover:bg-white/5 transition-colors duration-200"
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
