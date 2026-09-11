import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AgentConsole } from "@/components/agent-console";

interface Scene {
  num: string;
  label: string;
  tagline: string;
  cta: string;
}

interface HeroStageProps {
  badge: string;
  /** H1 — branco com acento ouro contido (via t.rich no page). */
  title: ReactNode;
  subtitle: string;
  scroller: Scene;
  ia: Scene;
  scrollerImageAlt: string;
  scrollerMediaNote: string;
}

/** Delay escalonado da entrada — CSS puro (`.rise-in`), sem JS. */
const rise = (i: number) => ({ animationDelay: `${0.06 + i * 0.1}s` });

const BG = "#08080A";

/**
 * PALCO INTEGRADO — direção de arte CEO 2026-09-09 (DIRECAO-ARTE-PREMIUM):
 * um único palco carvão onde a fotografia cinematográfica da Scroller
 * (máquina completa, luz vinda da esquerda) ocupa ~65% e o console de IA
 * com o retrato do agente ocupa o terço direito — EXATAMENTE sobre a
 * faixa escura de ~25% preparada no próprio asset. A máquina permanece
 * completa e legível: o console vive na margem escura, não sobre ela.
 * Sem risco rígido separando cenas, sem cards lado a lado, sem átomo.
 *
 * Mobile: as DUAS apostas identificadas na primeira dobra — banda da
 * fotografia (35svh/min-250px) e entrada compacta da IA com o retrato
 * reconhecível (29svh/min-215px). Mesma aritmética vertical MEDIDA da
 * composição anterior (harness 390×844 e 390×745) — headline, paddings
 * e alturas de banda preservados; o conteúdo interno das bandas mudou,
 * as alturas não.
 *
 * Server Component: texto integral no HTML; entrada `.rise-in` gated por
 * `html.js`; zero animação sob reduced-motion; sem WebGL, sem partículas.
 * A única mídia priority é a fotografia do palco (LCP).
 */
export function HeroStage({
  badge,
  title,
  subtitle,
  scroller,
  ia,
  scrollerImageAlt,
  scrollerMediaNote,
}: HeroStageProps) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 lg:pt-24"
      style={{ backgroundColor: BG }}
    >
      {/* ── manchete editorial — branca, acento ouro contido ── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-4 sm:px-6 lg:pb-6">
        <p
          className="rise-in font-mono text-[11px] uppercase tracking-[0.35em] text-white/50"
          style={rise(0)}
        >
          {badge}
        </p>
        <h1
          className="rise-in-t mt-3 max-w-4xl text-[clamp(1.7rem,4.6vw,3.9rem)] font-extrabold leading-[1.05] tracking-tight text-white"
          style={rise(1)}
        >
          {title}
        </h1>
        <p
          className="rise-in mt-2.5 max-w-xl text-[13px] leading-snug text-white/60 md:text-lg md:leading-relaxed"
          style={rise(2)}
        >
          {subtitle}
        </p>
      </div>

      {/* ── o palco ── */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Fotografia — banda 35svh no mobile, palco inteiro no desktop.
            Um único <Image>: mesma URL nos dois enquadramentos (sem
            download duplicado), priority por ser o LCP. */}
        <div className="relative h-[35svh] min-h-[250px] overflow-hidden lg:absolute lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:min-h-0 lg:w-[78%]">
          <div className="rise-in absolute inset-0" style={rise(3)}>
            <Image
              src="/images/premium/scroller-cinematic.jpg"
              alt={scrollerImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "30% 50%" }}
            />
            {/* costura do palco (polimento 2026-09-11): pena mais larga e
                progressiva da fotografia para a interface — sem corte seco;
                a margem escura do asset funde no carvão (garantia em
                ultrawide) + leitura da manchete e da base */}
            <div
              className="absolute inset-y-0 right-0 hidden w-[30%] lg:block"
              style={{
                background: `linear-gradient(to right, transparent, ${BG}66 40%, ${BG}CC 72%, ${BG})`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 top-0 hidden h-32 lg:block"
              style={{ background: `linear-gradient(to bottom, ${BG}, ${BG}99 45%, transparent)` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 lg:h-44"
              style={{ background: `linear-gradient(to top, ${BG}, transparent)` }}
              aria-hidden="true"
            />
            <div className="grain absolute inset-0" aria-hidden="true" />
          </div>

          {/* entrada 01 — overlay mobile (no desktop quem identifica é a
              coluna editorial do grid) */}
          <a
            href="#mineracao"
            aria-label={`${scroller.num} — ${scroller.label}: ${scroller.cta}`}
            className="absolute inset-0 flex flex-col justify-end focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#D4A847] lg:hidden"
          >
            <span className="absolute right-4 top-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
              {scrollerMediaNote}
            </span>
            <span
              className="pointer-events-none select-none whitespace-nowrap pl-4 text-[clamp(2.6rem,9vw,4rem)] font-extrabold leading-[0.85] tracking-tighter text-white/95"
              aria-hidden="true"
            >
              {scroller.label.toUpperCase()}
            </span>
            <span className="flex items-end justify-between gap-4 px-4 pb-4 pt-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8C877]">
                {scroller.num} · {scroller.label}
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#E8C877]">
                {scroller.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>

        {/* ── grid do palco (desktop): editorial à esquerda, divisor
              editorial fino (ouro→gelo, as duas divisões) e console na
              faixa escura à direita — a máquina vive no vão entre eles ── */}
        <div className="relative mx-auto hidden w-full max-w-7xl flex-1 grid-cols-[1.62fr_1px_1fr] gap-10 px-6 lg:grid">
          <div className="flex flex-col justify-end pb-12">
            <span
              className="rise-in pointer-events-none select-none whitespace-nowrap text-[clamp(3rem,6.6vw,6.2rem)] font-extrabold leading-[0.85] tracking-tighter text-white/95"
              style={rise(4)}
              aria-hidden="true"
            >
              {scroller.label.toUpperCase()}
            </span>
            <div className="rise-in mt-4" style={rise(5)}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8C877]">
                {scroller.num} · {scroller.label}
              </p>
              <p className="mt-2 max-w-md text-lg font-medium leading-snug text-white/85">
                {scroller.tagline}
              </p>
              <a
                href="#mineracao"
                className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E8C877] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]"
              >
                {scroller.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </a>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                {scrollerMediaNote}
              </p>
            </div>
          </div>

          {/* divisor editorial vertical — ouro (mineração) funde em gelo
              (IA), a régua das duas divisões sem risco duro */}
          <div
            className="my-10 w-px self-stretch"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,168,71,0.55) 22%, rgba(255,255,255,0.14) 52%, rgba(127,180,216,0.55) 82%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* console de IA — na margem escura preparada no asset */}
          <div className="rise-in flex items-center justify-end py-6" style={rise(5)}>
            <AgentConsole />
          </div>
        </div>

        {/* costura mobile entre as bandas — divisor editorial ouro→gelo no
              lugar do risco duro (polimento 2026-09-11) */}
        <div
          className="h-px w-full lg:hidden"
          style={{
            background:
              "linear-gradient(to right, rgba(212,168,71,0.5), rgba(255,255,255,0.12) 50%, rgba(127,180,216,0.5))",
          }}
          aria-hidden="true"
        />

        {/* ── entrada 02 compacta (mobile) — retrato reconhecível, sem
              comprimir a interface completa em 29svh ── */}
        <a
          href="#ia"
          aria-label={`${ia.num} — ${ia.label}: ${ia.cta}`}
          className="relative flex h-[29svh] min-h-[215px] overflow-hidden bg-[#0B0E12] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#7FB4D8] lg:hidden"
        >
          {/* fusão do carvão da banda 01 no fundo da banda 02 */}
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#08080A] to-transparent"
            aria-hidden="true"
          />
          <span className="rise-in relative z-10 flex min-w-0 flex-1 flex-col justify-end px-4 pb-4" style={rise(4)}>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#9FC6E2]">
              {ia.num} · {ia.label}
            </span>
            <span className="mt-1.5 max-w-[17rem] text-[13px] font-medium leading-snug text-white/85">
              {ia.tagline}
            </span>
            <span className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/40">
              Pedido → Fontes → Preparação → Revisão → Resultado
            </span>
            <span className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-[#9FC6E2]">
              {ia.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </span>
          {/* retrato — recorte retangular, rosto enquadrado por object-position */}
          <span className="rise-in relative block w-[38%] shrink-0" style={rise(5)}>
            <Image
              src="/images/premium/agent-portrait.jpg"
              alt=""
              fill
              sizes="40vw"
              className="object-cover"
              style={{ objectPosition: "62% 12%" }}
            />
            <span
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, #0B0E12, #0B0E1200 45%)",
              }}
              aria-hidden="true"
            />
            <span className="absolute bottom-2 right-2.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
              Demonstração
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
