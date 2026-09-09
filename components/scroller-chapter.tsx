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
 * Capítulo 01 da home — Scroller. Direção de arte 2026-09-09: o hero
 * mostra a máquina COMPLETA no palco; o capítulo muda de enquadramento e
 * mostra o DETALHE MECÂNICO — recorte intencional sobre os tambores
 * helicoidais (mesma fotografia cinematográfica, enquadrada por
 * object-position + scale, sem novo binário). Editorial horizontal:
 * mídia à esquerda, título e narrativa ao lado — diferente da composição
 * do hero, que ancora o texto sobre a base da foto.
 *
 * Revelação em máscara (`.reveal-mask` via IntersectionObserver — sem
 * scrolljacking) e drift sutil transform-only (`.chapter-parallax`,
 * progressive enhancement + reduced-motion off). Server Component;
 * mídia lazy (abaixo da dobra). Legenda "Imagem ilustrativa" discreta.
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
    <section id="scroller" className="scroll-mt-20 bg-[#0A0A0A] pb-24 pt-16">
      {/* ── editorial horizontal: detalhe mecânico + narrativa ── */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <ScrollReveal>
          <figure className="reveal-mask relative h-[46vh] min-h-[320px] max-h-[620px] w-full overflow-hidden lg:h-[56vh]">
            <div className="chapter-parallax absolute inset-0 will-change-transform">
              <Image
                src="/images/premium/scroller-cinematic.jpg"
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="scale-[1.65] object-cover lg:scale-[1.8]"
                style={{ objectPosition: "44% 76%" }}
              />
            </div>
            {/* leitura sem esconder a mecânica */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/25"
              aria-hidden="true"
            />
            <div className="grain absolute inset-0" aria-hidden="true" />
            <figcaption className="absolute bottom-3.5 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              {mediaNote}
            </figcaption>
            {/* régua de escala editorial no pé do recorte */}
            <p className="absolute bottom-3.5 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8C877]/80">
              Propulsão helicoidal · detalhe
            </p>
          </figure>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E8C877]">
            {kicker}
          </p>
          <h2 className="mt-3 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80 lg:text-xl">
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
      </div>

      {/* ── lista editorial — régua fina, sem cards ── */}
      <div className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6">
        <ol className="divide-y divide-white/10 border-y border-white/10 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* li fora, reveal dentro — ol>div>li reprova axe list/listitem */}
          {points.map((point, i) => (
            <li
              key={point.title}
              className="py-7 lg:px-8 lg:py-9 lg:first:pl-0 lg:last:pr-0"
            >
              <ScrollReveal delay={i * 110} className="flex gap-5 lg:flex-col lg:gap-4">
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
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
