"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

type SectorKey = "mining" | "agro";
type Zone = SectorKey | null;

/**
 * The "Minefy Group" ring emblem burned into `split-default.png`, measured
 * directly in that file's native pixel space (1849×851). The emblem is
 * centered and near-circular in the source art, so a single {cx, cy, r}
 * triple — found by overlaying test circles on the composite until they
 * traced the glow — describes it well enough for hit-testing.
 *
 * Because the background is rendered with `object-fit: cover` at 50%/50%
 * (the default, untouched object-position), a uniform scale factor —
 * `max(containerW / imageW, containerH / imageH)` — maps this image-space
 * circle onto screen space for ANY viewport size/aspect ratio. That keeps
 * the invisible hit-test circle pixel-accurate to the visible ring instead
 * of a hand-tuned percentage that only happens to work at one resolution.
 */
const RING_IMAGE_SPACE = { cx: 928, cy: 396, r: 272 };
const RING_IMAGE_SIZE = { w: 1849, h: 851 };

/** Maps a pointer position (relative to the background container) to the
 *  {cx, cy, r} circle as actually rendered on screen right now. */
function projectRing(containerW: number, containerH: number) {
  const scale = Math.max(
    containerW / RING_IMAGE_SIZE.w,
    containerH / RING_IMAGE_SIZE.h,
  );
  const displayedW = RING_IMAGE_SIZE.w * scale;
  const displayedH = RING_IMAGE_SIZE.h * scale;
  const offsetX = (containerW - displayedW) / 2;
  const offsetY = (containerH - displayedH) / 2;
  return {
    cx: offsetX + RING_IMAGE_SPACE.cx * scale,
    cy: offsetY + RING_IMAGE_SPACE.cy * scale,
    r: RING_IMAGE_SPACE.r * scale,
  };
}

/** Zone resolution for a pointer at (x, y) within a container of the given
 *  size: inside the projected ring radius is always neutral — regardless of
 *  which half x falls on — otherwise left/right of the ring's own center. */
function resolveZone(
  x: number,
  y: number,
  containerW: number,
  containerH: number,
): Zone {
  const { cx, cy, r } = projectRing(containerW, containerH);
  const dx = x - cx;
  const dy = y - cy;
  if (dx * dx + dy * dy <= r * r) return null;
  return x < cx ? "mining" : "agro";
}

/** Sector opposite of a given zone — the side whose film darkens while the
 *  other half is being hovered. */
const OPPOSITE_SECTOR: Record<SectorKey, SectorKey> = {
  mining: "agro",
  agro: "mining",
};

const SECTORS: Array<{
  key: SectorKey;
  href: "/mineracao" | "/agrofy";
  ring: string;
  mobileObjectPosition: string;
}> = [
  {
    key: "mining",
    href: "/mineracao",
    ring: "ring-[#D4A847]/35",
    // Excavator + haul truck sit in the left third of the source frame;
    // biasing the crop there (rather than dead-center) keeps the machinery
    // and the "MINERAÇÃO" corner label in view on a narrow, tall card.
    mobileObjectPosition: "18% 38%",
  },
  {
    key: "agro",
    href: "/agrofy",
    ring: "ring-[#4ADE80]/35",
    // Sprayer + "AGRONEGÓCIO" label sit in the right half of the source
    // frame — mirror bias for the same reason as above.
    mobileObjectPosition: "80% 42%",
  },
];

// The CEO-authored composite: mining (gold) fusing into agro (green) around
// a central "Minefy / GROUP" ring emblem, with the sector labels + menu
// glyphs already burned into the image. This is the ONLY background — it
// never changes. Per the CEO's 2026-07-21 correction, the previous
// cross-fade into hover-mineracao.png / hover-agro.png (full-screen image
// swap) is gone; those two files stay on disk but are no longer referenced
// anywhere in this component, desktop or mobile.
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
 * Visual design is the CEO's own composite artwork (`public/images/chooser/
 * split-default.png`): a cinematic gold↔green split with a central "Minefy
 * Group" ring emblem and the sector labels burned into the image. That
 * background is single and static — it never changes. Hovering (or
 * focusing) a half darkens the OPPOSITE half with a soft black film over
 * that same static image; the half under the pointer, and the central ring,
 * stay clear. Choosing a side navigates to `/mineracao` or `/agrofy`; from
 * there the user stays inside that sector — nothing links back to `/`.
 * Reloading `/` always shows this screen again.
 */
export function SectorChooser() {
  const t = useTranslations("chooser");
  const router = useRouter();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<Zone>(null);
  const [revealed, setRevealed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

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

  /** The stage (background + click-catcher) resolves its own zone from raw
   *  pointer coordinates on every move — no hover state is trusted from
   *  individual elements, since the ring's neutral zone cuts across both
   *  halves and no DOM element boundary maps to a circle. */
  const handlePointerMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover(resolveZone(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height));
  }, []);

  const handlePointerLeave = useCallback(() => setHover(null), []);

  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const zone = resolveZone(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
      // Inside the ring: neutral zone, just the Minefy Group brand mark —
      // clicking it is deliberately a no-op, never a navigation.
      if (zone === null) return;
      const sector = SECTORS.find((s) => s.key === zone);
      if (sector) router.push(sector.href);
    },
    [router],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#050505]">
      <h1 className="sr-only">{t("metadata.title")}</h1>

      {/* ── Desktop / tablet — static composite, opposite-half film on hover ──
          The whole stage is one pointer surface: onMouseMove/onClick resolve
          the 3-zone geometry (left half / right half / central ring) from
          raw coordinates via `resolveZone`, so the neutral circle can cut
          across both halves without fighting DOM element boundaries. */}
      <div
        ref={stageRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
        className={`absolute inset-0 hidden md:block ${hover === null ? "cursor-default" : "cursor-pointer"}`}
      >
        {/* Background: the single static composite. Rendered as a plain
            <Image>, opacity fixed at 1 by nothing but the browser's own
            paint — never gated behind a motion/JS state — so it can never
            be caught mid-animation (or stuck invisible) behind the entry
            curtain. It never swaps, never cross-fades, never scales. */}
        <div className="absolute inset-0">
          <Image
            src={DEFAULT_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Sole hover effect: a dark film over the half OPPOSITE the mouse,
            over the same static image — never the half being pointed at,
            and never while inside the central ring (hover === null). */}
        {SECTORS.map((s, i) => (
          <motion.div
            key={`${s.key}-film`}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 ${i === 0 ? "left-0 w-1/2" : "right-0 w-1/2"}`}
            animate={{ opacity: hover === OPPOSITE_SECTOR[s.key] ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                i === 0
                  ? "linear-gradient(to left, transparent, rgba(0,0,0,0.55) 60%)"
                  : "linear-gradient(to right, transparent, rgba(0,0,0,0.55) 60%)",
            }}
          />
        ))}

        {/* Real, focusable links — kept for a11y/SEO and keyboard navigation.
            Pointer clicks are handled entirely by the stage above (so the
            circle's neutral zone is respected); these stay `pointer-events-
            none` for the mouse but remain tabbable, and Enter/Space still
            navigates natively since keyboard activation isn't hit-tested. */}
        {SECTORS.map((s, i) => (
          <Link
            key={s.key}
            href={s.href}
            aria-label={t(`${s.key}.aria`)}
            onFocus={() => setHover(s.key)}
            onBlur={() => setHover(null)}
            className={`group pointer-events-none absolute inset-y-0 block focus-visible:outline-none ${
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
                src={DEFAULT_IMAGE}
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
