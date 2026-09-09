import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Scene {
  num: string;
  label: string;
  tagline: string;
  cta: string;
}

interface HeroDualProps {
  badge: string;
  title: string;
  subtitle: string;
  scroller: Scene;
  ia: Scene;
  /** Alt honesto da fotografia da cena 01 (vem do dicionário). */
  scrollerImageAlt: string;
  /** Legenda discreta da fotografia ("Imagem ilustrativa.") — rotulagem
   * persistente também na aparição mais proeminente da imagem (A3). */
  scrollerMediaNote: string;
}

/** Delay escalonado da entrada — CSS puro (`.rise-in`), sem JS. */
const rise = (i: number) => ({ animationDelay: `${0.06 + i * 0.1}s` });

const GOLD = "#D4A847";
const ICE = "#7FB4D8";

/**
 * Núcleo visual da cena 02 — abstração luminosa da camada de IA: um núcleo
 * com glow e órbitas de dados desenhadas em SVG (stroke-dash animado pelo
 * `.flow-dash` existente, congelado sob reduced-motion; pontos com
 * `.node-pulse`). Sem caixas, sem fluxograma, sem WebGL — custa zero JS.
 * Decorativo: aria-hidden; o texto real da cena vive fora do SVG.
 */
function IaCore() {
  return (
    <svg
      viewBox="0 0 520 420"
      className="h-full w-full max-w-[520px]"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="ia-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ICE} stopOpacity="0.55" />
          <stop offset="45%" stopColor={ICE} stopOpacity="0.12" />
          <stop offset="100%" stopColor={ICE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ia-core-body" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#EAF4FB" />
          <stop offset="35%" stopColor="#9FC6E2" />
          <stop offset="100%" stopColor="#17242E" />
        </radialGradient>
      </defs>

      {/* halo */}
      <circle cx="260" cy="210" r="190" fill="url(#ia-core-glow)" />

      {/* órbitas — elipses rotacionadas, dash em movimento lento */}
      <g fill="none" strokeWidth="1">
        <ellipse
          cx="260"
          cy="210"
          rx="176"
          ry="64"
          stroke={ICE}
          strokeOpacity="0.5"
          strokeDasharray="1 7"
          className="flow-dash"
          transform="rotate(-18 260 210)"
        />
        <ellipse
          cx="260"
          cy="210"
          rx="150"
          ry="96"
          stroke={ICE}
          strokeOpacity="0.35"
          strokeDasharray="1 10"
          className="flow-dash"
          transform="rotate(32 260 210)"
        />
        <ellipse
          cx="260"
          cy="210"
          rx="196"
          ry="120"
          stroke="#FFFFFF"
          strokeOpacity="0.14"
          strokeDasharray="1 14"
          className="flow-dash"
          transform="rotate(8 260 210)"
        />
      </g>

      {/* satélites de dados */}
      <circle cx="98" cy="256" r="3.5" fill={ICE} className="node-pulse" />
      <circle cx="404" cy="150" r="3" fill="#FFFFFF" opacity="0.8" className="node-pulse" />
      <circle cx="356" cy="300" r="2.5" fill={GOLD} className="node-pulse" />

      {/* núcleo */}
      <circle cx="260" cy="210" r="58" fill="url(#ia-core-body)" />
      <circle
        cx="260"
        cy="210"
        r="72"
        fill="none"
        stroke={ICE}
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="2 5"
        className="flow-dash"
      />
    </svg>
  );
}

/**
 * Abertura dual da home (revisão CEO 2026-09-09): dois PAINÉIS EDITORIAIS
 * full-bleed — "01 / Scroller" (fotografia dominante + wordmark gigante
 * como elemento gráfico) e "02 / Inteligência artificial" (núcleo orbital
 * luminoso) — ambos identificados no primeiro viewport. Sem carrossel,
 * sem hover-para-descobrir, sem moldura de card.
 *
 * Primeira dobra MOBILE — MEDIDA em iframes reais no preview (harness
 * 2026-09-09, dois cenários):
 *   390×844:  H1 133–190 · painel 01 263–559 (rótulo 522–539) ·
 *             painel 02 579–824 (rótulo "02 · Inteligência artificial"
 *             771–804) — tudo na dobra, sem overflow horizontal.
 *   390×745 (Safari com barra expandida, svh curto): painel 01 263–524 ·
 *             painel 02 526–742 (rótulo 689–722) — tudo na dobra.
 * Alturas: 35svh/min-250px e 29svh/min-215px. Se mexer aqui, MEÇA DE NOVO
 * nos dois cenários (não confie em cálculo de gabinete — nem no meu).
 * Server Component: texto integral no HTML; entrada `.rise-in` gated por
 * `html.js`; zero animação sob reduced-motion; sem WebGL, sem partículas.
 */
export function HeroDual({
  badge,
  title,
  subtitle,
  scroller,
  ia,
  scrollerImageAlt,
  scrollerMediaNote,
}: HeroDualProps) {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0A0A0A] pt-20 lg:pt-24">
      {/* ── manchete editorial ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-4 sm:px-6 lg:pb-10">
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
          <span className="text-gold-flow">{title}</span>
        </h1>
        <p
          className="rise-in mt-2.5 max-w-2xl text-[13px] leading-snug text-white/60 md:text-lg md:leading-relaxed"
          style={rise(2)}
        >
          {subtitle}
        </p>
      </div>

      {/* ── os dois painéis, full-bleed, assimétricos ── */}
      <div className="relative z-10 grid flex-1 grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
        {/* 01 · SCROLLER — a matéria */}
        <Link
          href="#scroller"
          aria-label={`${scroller.num} — ${scroller.label}: ${scroller.cta}`}
          className="group relative flex h-[35svh] min-h-[250px] flex-col justify-end overflow-hidden border-t border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#D4A847] lg:h-auto lg:min-h-[56vh] lg:border-t-0"
        >
          <div className="rise-in absolute inset-0" style={rise(3)}>
            <Image
              src="/images/scroller/scroller-field-web.jpg"
              alt={scrollerImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
              style={{ objectPosition: "58% 64%" }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/45"
              aria-hidden="true"
            />
            <span className="absolute right-4 top-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
              {scrollerMediaNote}
            </span>
          </div>

          {/* wordmark gigante — elemento gráfico, cortado pela base */}
          <span
            className="pointer-events-none relative select-none whitespace-nowrap pl-4 text-[clamp(3.4rem,10.5vw,10rem)] font-extrabold leading-[0.82] tracking-tighter text-white/95 sm:pl-6"
            aria-hidden="true"
          >
            {scroller.label.toUpperCase()}
          </span>

          <div className="relative flex items-end justify-between gap-6 px-5 pb-5 pt-3 sm:px-6 lg:pb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8C877]">
                {scroller.num} · {scroller.label}
              </p>
              <p className="mt-1.5 hidden max-w-md text-base font-medium leading-snug text-white/85 sm:block lg:text-lg">
                {scroller.tagline}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#E8C877]">
              {scroller.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>

        {/* 02 · IA — a inteligência (deslocada: arquitetura assimétrica) */}
        <Link
          href="#ia"
          aria-label={`${ia.num} — ${ia.label}: ${ia.cta}`}
          className="group relative flex h-[29svh] min-h-[215px] flex-col justify-end overflow-hidden border-t border-white/10 bg-[#0B0E12] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#7FB4D8] lg:h-auto lg:min-h-[56vh] lg:border-l lg:border-t-0"
        >
          <div className="rise-in absolute inset-0" style={rise(4)}>
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(80% 64% at 62% 30%, rgba(127,180,216,0.12), transparent 62%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 flex h-[72%] items-center justify-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] lg:h-[74%]">
              <IaCore />
            </div>
          </div>

          <div className="relative flex items-end justify-between gap-6 px-5 pb-5 sm:px-6 lg:pb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#9FC6E2]">
                {ia.num} · {ia.label}
              </p>
              <p className="mt-1.5 hidden max-w-sm text-base font-medium leading-snug text-white/85 sm:block lg:text-lg">
                {ia.tagline}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#9FC6E2]">
              {ia.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
