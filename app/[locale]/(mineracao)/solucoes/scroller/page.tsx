import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.scroller.metadata" });
  return pageMetadata({
    site: "mineracao",
    path: "/solucoes/scroller",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Frente Scroller — página dedicada (revisão CEO 2026-09-09). Mesma
 * linguagem editorial do capítulo da home: fotografia dominante, wordmark
 * como elemento gráfico, narrativa em régua fina. Server Component; a
 * única mídia é a fotografia tratada (legenda discreta "Imagem
 * ilustrativa"); CTA preserva o contexto até o formulário
 * (`?servico=scroller`, validado contra o enum).
 */
export default async function ScrollerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.scroller");
  const tChapter = await getTranslations("corporateHome.scrollerChapter");

  const sections = t.raw("sections") as Array<{ title: string; text: string }>;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero — fotografia dominante ── */}
      <section className="relative flex min-h-[74vh] flex-col justify-end overflow-hidden bg-[#0A0A0A]">
        <Image
          src="/images/scroller/scroller-field-web.jpg"
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "55% 58%" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/25 to-[#0A0A0A]/45"
          aria-hidden="true"
        />
        <p className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          {tChapter("mediaNote")}
        </p>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-36">
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t("backToHub")}
          </Link>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[#E8C877]">
            {t("hero.kicker")}
          </p>
          <h1 className="mt-3 text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      {/* ── Narrativa ── */}
      <section className="px-6 py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <ScrollReveal>
            <p className="max-w-md text-xl leading-relaxed text-foreground/85 lg:text-2xl">
              {t("hero.lede")}
            </p>
            <p className="mt-6 max-w-md border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-muted-foreground">
              {t("status")}
            </p>
            <div className="mt-8">
              <Link
                href="/contato?servico=scroller"
                className="btn-sheen inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>

          <ol className="divide-y divide-border border-y border-border">
            {sections.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 110}>
                <li className="flex gap-6 py-8">
                  <span
                    className="chapter-num shrink-0 pt-1 text-3xl sm:text-4xl"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {section.text}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
