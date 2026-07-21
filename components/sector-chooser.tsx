"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Sprout } from "lucide-react";

// `Link` (from next-intl) forwards refs/props to the underlying `<a>`, so this
// lets Motion drive its `style` (the animated clip-path) directly. Crucial:
// the clip-path must live on the SAME element that is clickable/focusable —
// clipping only an inner child restricts what's *painted* but not what the
// full-bleed anchor *hit-tests*, which would let the topmost link in the DOM
// swallow clicks meant for the other panel.
const MotionLink = motion.create(Link);

/* ────────────────────────────────────────────────────────────────────────
   Torn-paper seam geometry
   ────────────────────────────────────────────────────────────────────────
   One jagged polyline (Y × JITTER) is shared by both panels — each panel's
   clip-path traces the *same* boundary from its own side, so the two shapes
   always fit together perfectly, like an actual torn sheet of paper. Moving
   `seamX` (0–100, a percentage) redraws every dependent shape at once:
   growing one panel and shrinking the other while keeping the tear intact.
   ──────────────────────────────────────────────────────────────────────── */
const Y = [0, 7, 14, 21, 29, 36, 43, 50, 57, 64, 71, 79, 86, 93, 100];
const JITTER = [0, 2.4, -1.8, 3.6, -3.1, 1.7, -2.6, 4.1, -1.4, 2.9, -3.8, 1.5, -2.9, 3.3, 0];

function fmt(n: number) {
  return `${n.toFixed(2)}%`;
}

/** Left/top panel — traces the seam top-to-bottom after coming down the left edge. */
function sidePolygon(seam: number, side: "start" | "end") {
  const pts = Y.map((y, i) => `${fmt(seam + JITTER[i])} ${fmt(y)}`);
  if (side === "start") {
    // Panel occupying the START of the axis (left, on desktop).
    const reversed = [...pts].reverse();
    return `polygon(0% 0%, 0% 100%, ${reversed.join(", ")})`;
  }
  // Panel occupying the END of the axis (right, on desktop).
  return `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`;
}

/** Thin jagged ribbon straddling the seam — the lifted "torn fiber" highlight. */
function ribbonPolygon(seam: number, half = 1.35) {
  const left = Y.map((y, i) => `${fmt(seam + JITTER[i] - half)} ${fmt(y)}`);
  const right = Y.map((y, i) => `${fmt(seam + JITTER[i] + half)} ${fmt(y)}`).reverse();
  return `polygon(${left.join(", ")}, ${right.join(", ")})`;
}

/** Same construction, transposed to a horizontal seam (mobile stack). */
function stackedPolygon(seam: number, side: "start" | "end") {
  const pts = Y.map((x, i) => `${fmt(x)} ${fmt(seam + JITTER[i])}`);
  if (side === "start") {
    const reversed = [...pts].reverse();
    return `polygon(0% 0%, 100% 0%, ${reversed.join(", ")})`;
  }
  return `polygon(0% 100%, ${pts.join(", ")}, 100% 100%)`;
}
function stackedRibbonPolygon(seam: number, half = 1.6) {
  const top = Y.map((x, i) => `${fmt(x)} ${fmt(seam + JITTER[i] - half)}`);
  const bottom = Y.map((x, i) => `${fmt(x)} ${fmt(seam + JITTER[i] + half)}`).reverse();
  return `polygon(${top.join(", ")}, ${bottom.join(", ")})`;
}

const MOBILE_SEAM = 50;
const STACKED_TOP_CLIP = stackedPolygon(MOBILE_SEAM, "start");
const STACKED_BOTTOM_CLIP = stackedPolygon(MOBILE_SEAM, "end");
const STACKED_RIBBON_CLIP = stackedRibbonPolygon(MOBILE_SEAM);

type SectorKey = "mining" | "agro";

const SECTORS: Array<{
  key: SectorKey;
  href: "/mineracao" | "/agrofy";
  image: string;
  alt: string;
  objectPosition: string;
  glow: string;
}> = [
  {
    key: "mining",
    href: "/mineracao",
    image: "/images/mining/safety-excavator-sunset.jpg",
    alt: "Escavadeira de grande porte ao entardecer em mina a céu aberto",
    objectPosition: "34% 40%",
    glow: "rgba(212,168,71,0.55)",
  },
  {
    key: "agro",
    href: "/agrofy",
    image: "/images/agro/hero-colheitadeira-soja-poente.jpg",
    alt: "Colheitadeira em operação numa lavoura de soja ao entardecer",
    objectPosition: "87% 58%",
    glow: "rgba(22,163,74,0.55)",
  },
];

function Symbol({ sector }: { sector: SectorKey }) {
  if (sector === "mining") {
    return (
      <Image
        src="/images/logo-transparente.png"
        alt="Minefy"
        width={800}
        height={570}
        className="h-auto w-[104px] drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] sm:w-[124px]"
      />
    );
  }
  return (
    <div className="flex items-center gap-2.5 text-[#4ADE80] drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
      <Sprout className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.6} />
      <span className="text-4xl font-extrabold tracking-tight sm:text-[2.75rem]">
        Agrofy
      </span>
    </div>
  );
}

interface PanelContentProps {
  sector: SectorKey;
  hovered: boolean;
  dimmed: boolean;
}

function PanelContent({ sector, hovered, dimmed }: PanelContentProps) {
  const t = useTranslations(`chooser.${sector === "mining" ? "mining" : "agro"}`);
  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center"
      animate={{
        opacity: dimmed ? 0.55 : 1,
        scale: hovered ? 1.035 : 1,
        y: hovered ? -4 : 0,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Symbol sector={sector} />
      <div className="space-y-2.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.4em] sm:text-xs"
          style={{ color: sector === "mining" ? "#D4A847" : "#4ADE80" }}
        >
          {t("kicker")}
        </p>
        <h2 className="text-3xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-4xl md:text-5xl">
          {t("label")}
        </h2>
      </div>
      <p className="max-w-[19rem] text-sm leading-relaxed text-white/70 sm:text-base">
        {t("text")}
      </p>
      <motion.span
        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white"
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {t("cta")}
        <ArrowRight className="h-4 w-4" />
      </motion.span>
    </motion.div>
  );
}

export function SectorChooser() {
  const t = useTranslations("chooser");
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<SectorKey | null>(null);
  const [revealed, setRevealed] = useState(false);

  const seamX = useMotionValue(50);
  const startClip = useTransform(seamX, (x) => sidePolygon(x, "start"));
  const endClip = useTransform(seamX, (x) => sidePolygon(x, "end"));
  const ribbonClip = useTransform(seamX, (x) => ribbonPolygon(x));
  const startWidth = useTransform(seamX, (x) => `${x}%`);
  const endWidth = useTransform(seamX, (x) => `${100 - x}%`);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // setTimeout rather than requestAnimationFrame: rAF is paused by the
    // browser while the tab isn't visible/composited, which would otherwise
    // leave the curtain stuck open on first paint in some environments.
    const id = setTimeout(() => setRevealed(true), 60);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const target = hover === "mining" ? 60 : hover === "agro" ? 40 : 50;
    const controls = animate(seamX, target, {
      duration: reduce ? 0 : 0.75,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [hover, reduce, seamX]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#050505]">
      {/* ── Desktop / tablet — vertical tear, side by side ── */}
      <div className="absolute inset-0 hidden md:block">
        {SECTORS.map((s) => {
          const isSelf = hover === s.key;
          const isOther = hover !== null && hover !== s.key;
          return (
            <MotionLink
              key={s.key}
              href={s.href}
              aria-label={t(`${s.key === "mining" ? "mining" : "agro"}.aria`)}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.key)}
              onBlur={() => setHover(null)}
              className="group absolute inset-0 block cursor-pointer focus-visible:outline-none"
              style={{ clipPath: s.key === "mining" ? startClip : endClip }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isSelf ? 1.07 : revealed ? 1 : 1.16 }}
                transition={{ duration: reduce ? 0 : isSelf ? 0.8 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  priority
                  className="object-cover"
                  style={{ objectPosition: s.objectPosition }}
                  sizes="50vw"
                />
              </motion.div>

              <div
                className="absolute inset-0 bg-[#050505] transition-opacity duration-500"
                style={{ opacity: isOther ? 0.78 : isSelf ? 0.32 : 0.48 }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: isSelf ? 1 : 0,
                  background: `radial-gradient(60% 55% at 50% 45%, ${s.glow}, transparent 70%)`,
                }}
                aria-hidden="true"
              />

              <motion.div
                className={`absolute inset-y-0 ${s.key === "mining" ? "left-0" : "right-0"}`}
                style={{ width: s.key === "mining" ? startWidth : endWidth }}
              >
                <PanelContent sector={s.key} hovered={isSelf} dimmed={isOther} />
              </motion.div>

              <div className="pointer-events-none absolute inset-6 rounded-[2rem] outline outline-2 outline-offset-0 outline-white/0 transition-colors group-focus-visible:outline-white/70" />
            </MotionLink>
          );
        })}

        {/* Torn-fiber highlight riding the seam */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: ribbonClip,
            background:
              "linear-gradient(90deg, transparent, rgba(255,250,240,0.55), transparent)",
            filter: "blur(1.5px)",
            opacity: revealed ? 0.6 : 0,
            transition: "opacity 1.1s ease 0.3s",
          }}
        />
      </div>

      {/* ── Mobile — stacked, horizontal tear, tap to enter ── */}
      <div className="absolute inset-0 md:hidden">
        {SECTORS.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            aria-label={t(`${s.key === "mining" ? "mining" : "agro"}.aria`)}
            className="absolute inset-0 block active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:-outline-offset-4"
            style={{ clipPath: s.key === "mining" ? STACKED_TOP_CLIP : STACKED_BOTTOM_CLIP }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority
                className="object-cover"
                style={{ objectPosition: s.objectPosition }}
                sizes="100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-[#050505]/55" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/20"
              aria-hidden="true"
            />
            <div
              className={`absolute inset-x-0 h-1/2 ${s.key === "mining" ? "top-0" : "bottom-0"}`}
            >
              <PanelContent sector={s.key} hovered={false} dimmed={false} />
            </div>
          </Link>
        ))}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: STACKED_RIBBON_CLIP,
            background:
              "linear-gradient(180deg, transparent, rgba(255,250,240,0.5), transparent)",
            filter: "blur(1.5px)",
            opacity: revealed ? 0.6 : 0,
            transition: "opacity 1.1s ease 0.3s",
          }}
        />
      </div>

      {/* Curtain — fades away once, revealing both panels (replaces the old logo preloader).
          Plain CSS transition on purpose, not a motion.div: this is the one element
          that hides the entire page, so it must resolve on the browser's own style/
          compositor pipeline rather than depend on Motion's JS-driven tween loop. */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[#050505]"
        style={{
          opacity: revealed ? 0 : 1,
          transition: reduce ? "none" : "opacity 0.9s ease-in-out 0.05s",
        }}
      />
    </div>
  );
}
