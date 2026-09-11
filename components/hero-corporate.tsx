import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/magnetic-button";
import { ParticleField } from "@/components/particle-field";

interface HeroCorporateProps {
  badge: string;
  title: string;
  subtitle: string;
  trust: string;
  cta: string;
  ctaSecondary: string;
}

/** Delay escalonado da entrada — CSS puro (`.rise-in`), sem JS. */
const rise = (i: number) => ({ animationDelay: `${0.1 + i * 0.09}s` });

const GOLD = "#D4A847";
const COOL = "#7FB4D8"; // acento frio contido — fluxos de dados

/**
 * Systems/agents map — the hero's right-hand side finally WORKS for its
 * space: an SVG diagram of what Minefy builds (systems → knowledge → agent
 * → human approval → result). Flow lines animate via the CSS-gated
 * `.flow-dash` (frozen under reduced motion); nodes are real links into the
 * matching sections/pages, with visible focus. Decorative duplicates of
 * navigation that exists elsewhere, so the whole SVG stays out of the
 * accessibility tree except for the node links' labels.
 */
export function SystemsMap() {
  const nodeBox =
    "transition-opacity duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]";

  return (
    <svg
      viewBox="0 0 560 420"
      className="w-full max-w-xl"
      role="img"
      aria-label="Mapa ilustrativo: sistemas da empresa alimentam a base de conhecimento e um agente Minefy, que executa com aprovação humana e gera resultado"
    >
      <defs>
        <linearGradient id="hc-agent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#0D0D0D" />
        </linearGradient>
        <radialGradient id="hc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.28" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <clipPath id="hc-portrait-clip">
          <circle cx="280" cy="210" r="61" />
        </clipPath>
        <linearGradient id="hc-portrait-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#090B0D" stopOpacity="0" />
          <stop offset="100%" stopColor="#090B0D" stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* glow under the agent core */}
      <circle cx="280" cy="210" r="130" fill="url(#hc-glow)" />

      {/* ── flow lines (systems → agent) ── */}
      <g stroke={COOL} strokeOpacity="0.65" strokeWidth="1.5" fill="none">
        <path d="M118,86 C180,100 200,150 232,182" className="flow-dash" />
        <path d="M110,210 C160,210 180,210 218,210" className="flow-dash" />
        <path d="M118,334 C180,320 200,270 232,238" className="flow-dash" />
      </g>
      {/* knowledge → agent */}
      <path
        d="M280,96 C280,120 280,130 280,152"
        stroke={GOLD}
        strokeOpacity="0.7"
        strokeWidth="1.5"
        fill="none"
        className="flow-dash"
      />
      {/* agent → approval → result */}
      <g stroke={GOLD} strokeOpacity="0.7" strokeWidth="1.5" fill="none">
        <path d="M342,210 C365,210 375,210 398,210" className="flow-dash" />
        <path d="M476,244 C476,266 470,276 470,300" className="flow-dash" />
      </g>

      {/* ── left: company systems (cool accent) ── */}
      {[
        { y: 62, label: "Sistemas / ERP" },
        { y: 186, label: "Planilhas e bases" },
        { y: 310, label: "E-mail e documentos" },
      ].map((n) => (
        <g key={n.label}>
          <rect
            x="18"
            y={n.y}
            width="100"
            height="48"
            rx="10"
            fill="#101418"
            stroke={COOL}
            strokeOpacity="0.4"
          />
          <text
            x="68"
            y={n.y + 22}
            textAnchor="middle"
            fill="#C4D8E8"
            fontSize="12"
            fontFamily="var(--font-jetbrains-mono), monospace"
          >
            {n.label.split(" ")[0]}
          </text>
          <text
            x="68"
            y={n.y + 36}
            textAnchor="middle"
            fill="#9FB9CB"
            fontSize="10.5"
            fontFamily="var(--font-jetbrains-mono), monospace"
          >
            {n.label.split(" ").slice(1).join(" ")}
          </text>
        </g>
      ))}

      {/* ── top: knowledge ── */}
      <g>
        <rect
          x="212"
          y="42"
          width="136"
          height="54"
          rx="12"
          fill="#12100B"
          stroke={GOLD}
          strokeOpacity="0.45"
        />
        <text x="280" y="65" textAnchor="middle" fill={GOLD} fontSize="12.5" fontWeight="600">
          Conhecimento
        </text>
        <text x="280" y="81" textAnchor="middle" fill="#B8B8B8" fontSize="10.5">
          docs · políticas · histórico
        </text>
      </g>

      {/* ── center: the agent (links to the execution lab) ── */}
      <Link href="/experiencias" className={nodeBox} aria-label="Ver um agente executando na prática">
        <g style={{ cursor: "pointer" }}>
          <circle cx="280" cy="210" r="62" fill="url(#hc-agent)" stroke={GOLD} strokeOpacity="0.8" strokeWidth="1.5" />
          <circle cx="280" cy="210" r="72" fill="none" stroke={GOLD} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="280" cy="148" r="3" fill={GOLD} className="node-pulse" />
          <g clipPath="url(#hc-portrait-clip)" aria-hidden="true">
            <image
              href="/images/premium/agent-portrait.jpg"
              x="218"
              y="148"
              width="124"
              height="124"
              preserveAspectRatio="xMaxYMin slice"
            />
            <rect x="218" y="230" width="124" height="42" fill="url(#hc-portrait-shade)" />
          </g>
          <text x="280" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="600">
            Agente Minefy
          </text>
        </g>
      </Link>

      {/* ── right: human approval ── */}
      <g>
        <rect x="398" y="176" width="156" height="68" rx="12" fill="#12100B" stroke={GOLD} strokeOpacity="0.45" />
        <text x="476" y="202" textAnchor="middle" fill={GOLD} fontSize="12.5" fontWeight="600">
          Aprovação
        </text>
        <text x="476" y="224" textAnchor="middle" fill="#B8B8B8" fontSize="9.5">
          humana, onde você definir
        </text>
      </g>

      {/* ── bottom right: result ── */}
      <g>
        <rect x="404" y="300" width="132" height="52" rx="12" fill="#0F1410" stroke="#69B37E" strokeOpacity="0.45" />
        <text x="470" y="322" textAnchor="middle" fill="#A5DDB4" fontSize="12.5" fontWeight="600">
          Resultado
        </text>
        <text x="470" y="338" textAnchor="middle" fill="#B8B8B8" fontSize="10.5">
          registrado e auditável
        </text>
      </g>

      {/* honesty caption inside the artwork */}
      <text x="280" y="404" textAnchor="middle" fill="#8F8F8F" fontSize="10" fontFamily="var(--font-jetbrains-mono), monospace">
        DIAGRAMA ILUSTRATIVO · DADOS SIMULADOS
      </text>
    </svg>
  );
}

/**
 * Corporate hero (home 2026-09): concise, NON-blocking — a SERVER
 * component: every piece of text ships visible in the HTML (the CSS-only
 * `.rise-in` entrance is gated behind `html.js`, so no-JS visitors and
 * crawlers see everything, and reduced-motion users get zero animation).
 * CTAs: primary → contact, secondary → the interactive lab.
 */
export function HeroCorporate({
  badge,
  title,
  subtitle,
  trust,
  cta,
  ctaSecondary,
}: HeroCorporateProps) {
  const [connectLine, executeLine] = title.split(". ");

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#0A0A0A] pt-28 pb-16">
      {/* ambient layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 28% 42%, rgba(212,168,71,0.10), transparent 62%), radial-gradient(50% 45% at 78% 55%, rgba(127,180,216,0.07), transparent 65%), radial-gradient(120% 100% at 50% 50%, transparent 40%, #0A0A0A 100%)",
        }}
        aria-hidden="true"
      />
      <ParticleField className="opacity-60" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Copy ── */}
        <div>
          <div className="rise-in" style={rise(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A847]/30 bg-[#D4A847]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#D4A847]">
              {badge}
            </span>
          </div>

          <h1
            className="rise-in-t mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={rise(1)}
          >
            <span className="text-gold-flow">{connectLine}.</span>
            <br />
            {executeLine}
          </h1>

          <p
            className="rise-in mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
            style={rise(2)}
          >
            {subtitle}
          </p>

          <div className="rise-in mt-8 flex flex-wrap gap-3" style={rise(3)}>
            <MagneticButton>
              <Link
                href="/contato"
                className="btn-sheen inline-flex items-center rounded-lg bg-[#D4A847] px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-[0_8px_30px_rgba(212,168,71,0.3)] transition-colors duration-200 hover:bg-[#C49B3F]"
              >
                {cta}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/experiencias"
                className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/10"
              >
                {ctaSecondary}
              </Link>
            </MagneticButton>
          </div>

          <p
            className="rise-in mt-7 inline-flex items-center gap-2 text-sm text-white/55"
            style={rise(4)}
          >
            <Check className="h-4 w-4 shrink-0 text-[#D4A847]" aria-hidden="true" />
            {trust}
          </p>
        </div>

        {/* ── Systems/agents map (fills the former decorative dead zone) ── */}
        <div className="rise-in hidden justify-center lg:flex" style={rise(3)}>
          <SystemsMap />
        </div>
      </div>
    </section>
  );
}
