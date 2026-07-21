"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

type SectorKey = "mining" | "agro";

const SECTORS: Array<{
  key: SectorKey;
  href: "/mineracao" | "/agrofy";
  hoverImage: string;
  ring: string;
  mobileObjectPosition: string;
}> = [
  {
    key: "mining",
    href: "/mineracao",
    hoverImage: "/images/chooser/hover-mineracao.png",
    ring: "ring-[#D4A847]/35",
    // Excavator + haul truck sit in the left third of the source frame;
    // biasing the crop there (rather than dead-center) keeps the machinery
    // and the "MINERAÇÃO" corner label in view on a narrow, tall card.
    mobileObjectPosition: "18% 38%",
  },
  {
    key: "agro",
    href: "/agrofy",
    hoverImage: "/images/chooser/hover-agro.png",
    ring: "ring-[#4ADE80]/35",
    // Sprayer + "AGRONEGÓCIO" label sit in the right half of the source
    // frame — mirror bias for the same reason as above.
    mobileObjectPosition: "80% 42%",
  },
];

// The CEO-authored composite: mining (gold) fusing into agro (green) around
// a central "Minefy / GROUP" ring emblem, with the sector labels + menu
// glyphs already burned into the image. This is the default/idle state.
const DEFAULT_IMAGE = "/images/chooser/split-default.png";

/** Small "Entrar →" affordance that fades in only while its half is active
 *  (hover on desktop, focus via keyboard). The composite images already
 *  carry the sector labels — this is purely an interaction cue, not a
 *  restatement of content, so it stays invisible until engaged. */
function HoverCta({ sectorKey, active, reduce }: { sectorKey: SectorKey; active: boolean; reduce: boolean }) {
  const t = useTranslations(`chooser.${sectorKey}`);
  const ring = sectorKey === "mining" ? "ring-[#D4A847]/30" : "ring-[#4ADE80]/30";
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[14%] flex justify-center"
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : reduce ? 0 : 10 }}
      transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-black/45 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white ring-1 backdrop-blur-sm ${ring}`}
      >
        {t("cta")}
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.div>
  );
}

/**
 * The site's entry screen — a full-bleed, chrome-free sector picker (replaces
 * the old logo preloader, and before that the torn-paper v1). Deliberately
 * outside the `(site)` route group, so it renders with no Header/Footer.
 *
 * Visual design is the CEO's own composite artwork (`public/images/chooser/`):
 * a cinematic gold↔green split with a central "Minefy Group" ring emblem and
 * the sector labels burned into the image. Hovering (or focusing) a half
 * cross-fades the background from the neutral split into that side's
 * dominant hover state. Choosing a side navigates to `/mineracao` or
 * `/agrofy`; from there the user stays inside that sector — nothing links
 * back to `/`. Reloading `/` always shows this screen again.
 */
export function SectorChooser() {
  const t = useTranslations("chooser");
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<SectorKey | null>(null);
  const [revealed, setRevealed] = useState(false);

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

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#050505]">
      <h1 className="sr-only">{t("metadata.title")}</h1>

      {/* ── Desktop / tablet — cinematic split, cross-fading on hover ── */}
      <div className="absolute inset-0 hidden md:block">
        {/* Background stack: idle composite + each sector's hover state,
            layered and cross-faded purely via opacity — never more than one
            fully opaque at a time, so no clip-path/hit-test games needed. */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hover === null ? 1 : 0, scale: hover === null ? 1 : 1.02 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={DEFAULT_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {SECTORS.map((s) => (
          <motion.div
            key={s.key}
            className="absolute inset-0"
            animate={{
              opacity: hover === s.key ? 1 : 0,
              scale: hover === s.key && !reduce ? 1.045 : 1,
            }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={s.hoverImage} alt="" fill className="object-cover" sizes="100vw" />
          </motion.div>
        ))}

        {/* Clickable halves — plain, non-overlapping rectangles (each is
            exactly its own 50% of the viewport), so there is no shared
            element for a click meant for one side to be swallowed by the
            other — the failure mode the v1 clip-path seam had to work
            around. Focus/hover on either half drives the cross-fade above. */}
        {SECTORS.map((s, i) => (
          <Link
            key={s.key}
            href={s.href}
            aria-label={t(`${s.key}.aria`)}
            onMouseEnter={() => setHover(s.key)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(s.key)}
            onBlur={() => setHover(null)}
            className={`group absolute inset-y-0 block cursor-pointer focus-visible:outline-none ${
              i === 0 ? "left-0 w-1/2" : "right-0 w-1/2"
            }`}
          >
            {/* Labels + emblem are already burned into the artwork — this
                span exists purely for screen readers / SEO, not for sighted
                users. */}
            <span className="sr-only">
              {t(`${s.key}.label`)} — {t(`${s.key}.text`)}
            </span>
            <HoverCta sectorKey={s.key} active={hover === s.key} reduce={!!reduce} />
            <div className="pointer-events-none absolute inset-6 rounded-[2rem] outline outline-2 outline-offset-0 outline-white/0 transition-colors group-focus-visible:outline-white/70" />
          </Link>
        ))}
      </div>

      {/* ── Mobile — stacked cards, tap to enter ── */}
      <div className="absolute inset-0 flex flex-col md:hidden">
        {SECTORS.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            aria-label={t(`${s.key}.aria`)}
            className="relative block h-1/2 w-full overflow-hidden active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:-outline-offset-4"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: reduce ? 1 : 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={s.hoverImage}
                alt=""
                fill
                priority
                className="object-cover"
                style={{ objectPosition: s.mobileObjectPosition }}
                sizes="100vw"
              />
            </motion.div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-[#050505]/15"
              aria-hidden="true"
            />
            <span className="sr-only">
              {t(`${s.key}.label`)} — {t(`${s.key}.text`)}
            </span>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <span
                className={`inline-flex items-center gap-2 rounded-full bg-black/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white ring-1 backdrop-blur-sm ${
                  s.key === "mining" ? "ring-[#D4A847]/30" : "ring-[#4ADE80]/30"
                }`}
              >
                {t(`${s.key}.cta`)}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Curtain — fades away once, revealing the composite (replaces the
          old logo preloader). Plain CSS transition on purpose, not a
          motion.div: this is the one element that hides the entire page, so
          it must resolve on the browser's own style/compositor pipeline
          rather than depend on Motion's JS-driven tween loop. */}
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
