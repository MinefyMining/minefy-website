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
 * Frente Scroller — página dedicada (restauração autorizada 2026-09-20).
 * Escopo da autorização escrita da McCosker (cl. 11 do NDA): nome
 * "Scroller", descrição FUNCIONAL da aplicação em rejeitos/mud farming e
 * SOMENTE a fotografia já publicada em mccoskers.com.au — nada de
 * desenhos, detalhe de engenharia, preço, condição comercial ou
 * exclusividade. Atribuição obrigatória: McCosker fabricante/dona da
 * tecnologia; Minefy representante no Brasil. Server Component; a única
 * mídia é a fotografia oficial, com crédito. CTA preserva o contexto até
 * o formulário (`?servico=scroller`, validado contra o enum).
 */
export default async function ScrollerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.scroller");

  const sections = t.raw("sections") as Array<{ title: string; text: string }>;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-[#0A0A0A] px-6 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link href="/solucoes#mineracao" className="inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("backToHub")}
          </Link>
          <div className="mb-10 mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E8C877]">{t("hero.kicker")}</p>
              <h1 className="mt-3 text-6xl font-extrabold tracking-tight text-white sm:text-8xl">{t("hero.title")}</h1>
            </div>
            {/* atribuição obrigatória — fabricante e representante, lado a lado */}
            <dl className="grid max-w-md grid-cols-1 gap-4 border-l-2 border-[#D4A847]/60 pl-5 sm:grid-cols-2 sm:gap-8">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{t("attribution.label")}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-white">{t("attribution.maker")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{t("attribution.repLabel")}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-white">{t("attribution.rep")}</dd>
              </div>
            </dl>
          </div>

          {/* fotografia oficial da McCosker — a mesma publicada em
              mccoskers.com.au, integral, com crédito */}
          <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#101216]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/scroller/scroller-mccosker.jpg"
                alt={t("hero.imageAlt")}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              {t("hero.credit")}
            </figcaption>
          </figure>
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
