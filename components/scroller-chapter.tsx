import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";

interface Point {
  title: string;
  text: string;
}

interface ScrollerChapterProps {
  kicker: string;
  title: string;
  lede: string;
  points: Point[];
  ctaPrimary: string;
  ctaSecondary: string;
  mediaNote: string;
  imageAlt: string;
}

/**
 * Capítulo 01 da home — Scroller. Composição editorial cinematográfica:
 * a fotografia domina a tela e abre em máscara conforme o scroll
 * (`.reveal-mask` via IntersectionObserver — sem scrolljacking), com um
 * drift sutil transform-only dirigido pela visibilidade
 * (`.chapter-parallax`, progressive enhancement + reduced-motion off).
 * Server Component: texto integral no HTML; os três pontos são uma lista
 * editorial com régua fina — sem grade de cards. A legenda "Imagem
 * ilustrativa" é discreta por decisão editorial.
 */
export function ScrollerChapter({
  kicker,
  title,
  lede,
  points,
  ctaPrimary,
  ctaSecondary,
  mediaNote,
  imageAlt,
}: ScrollerChapterProps) {
  return (
    <section id="scroller" className="scroll-mt-20 bg-[#0A0A0A] pb-24 pt-10">
      {/* ── mídia dominante ── */}
      <ScrollReveal className="px-2 sm:px-4">
        <figure className="reveal-mask relative mx-auto h-[62vh] max-h-[720px] min-h-[380px] w-full max-w-[1600px] overflow-hidden">
          <div className="chapter-parallax absolute inset-0 will-change-transform">
            <Image
              src="/images/scroller/scroller-field-web.jpg"
              alt={imageAlt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "55% 60%" }}
            />
          </div>
          {/* luz de leitura, sem esconder a máquina */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/85 via-transparent to-[#0A0A0A]/30"
            aria-hidden="true"
          />
          <figcaption className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            {mediaNote}
          </figcaption>
          {/* título sobre a imagem — hierarquia editorial */}
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-6 pb-12 sm:pb-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E8C877]">
              {kicker}
            </p>
            <h2 className="mt-3 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
              {title}
            </h2>
          </div>
        </figure>
      </ScrollReveal>

      {/* ── narrativa ── */}
      <div className="mx-auto mt-14 grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <ScrollReveal>
          <p className="max-w-md text-xl leading-relaxed text-white/80 lg:text-2xl">
            {lede}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contato?servico=scroller"
              className="btn-sheen inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#C49B3F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]"
            >
              {ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/solucoes/scroller"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]"
            >
              {ctaSecondary}
            </Link>
          </div>
        </ScrollReveal>

        {/* lista editorial — régua fina, sem cards */}
        <ol className="divide-y divide-white/10 border-y border-white/10">
          {points.map((point, i) => (
            <ScrollReveal key={point.title} delay={i * 110}>
              <li className="flex gap-6 py-7">
                <span
                  className="chapter-num shrink-0 pt-1 text-3xl sm:text-4xl"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/60">
                    {point.text}
                  </p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
