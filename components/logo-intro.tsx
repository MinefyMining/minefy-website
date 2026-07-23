"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useMounted } from "@/lib/use-theme-store";

const INTRO_W = 240; // px — rendered width of the intro logo

type Phase = "gen" | "fly" | "done";
type Fly = { x: number; y: number; scale: number };
type Variant = "gold" | "green";

// Module-level (in-memory) set of `sessionKey`s that have already played.
// Deliberately NOT `sessionStorage`: that API persists across a real reload
// (F5) within the same tab per spec, which is the opposite of what's wanted
// here — the intro should play again on a genuine reload of the site, but
// not repeat on every internal client-side navigation. A plain module
// variable gives exactly that: a real reload re-evaluates this module from
// scratch (fresh, empty `Set`), while Next.js client-side route transitions
// reuse the already-loaded module (the flag survives), so the intro fires
// once per real page load and never again until the next hard
// reload/new tab. Keyed by `sessionKey` so the two ecosystems never
// interfere with each other's "already played" state.
const playedThisLoad = new Set<string>();

const THEME: Record<Variant, { ring: string; glow: string; dot: string }> = {
  gold: {
    ring: "#D4A847",
    glow: "rgba(212,168,71,0.55)",
    dot: "rgba(212,168,71,0.10)",
  },
  green: {
    ring: "#16A34A",
    glow: "rgba(34,197,94,0.55)",
    dot: "rgba(74,222,128,0.10)", // #4ADE80 @ 10%
  },
};

type LogoIntroProps = {
  /** Color theme: gold for Minefy (default), green for Agrofy. */
  variant?: Variant;
  /** Path to the logo image that "generates" and flies into the header. */
  logoSrc?: string;
  alt?: string;
  /** Intrinsic width/height of `logoSrc`, used to keep its aspect ratio. */
  logoWidth?: number;
  logoHeight?: number;
  /** DOM id of the header logo this intro should land on (`getBoundingClientRect`). */
  targetId?: string;
  /** In-memory flag key gating the "once per real page load" behavior — keep
   * distinct per ecosystem so visiting one world doesn't skip the intro on
   * the other. Resets on a genuine reload/new tab, survives client-side
   * (SPA) navigation within the same load — see `playedThisLoad` above. */
  sessionKey?: string;
  /** Landing-scale correction for when `logoSrc` is a different asset than the
   * header's `#site-logo` image. The fly scale maps the intro box onto the
   * header img's rendered width assuming both assets have the same
   * content-to-canvas fill; when they differ, pass
   * `headerFill / introFill` (visible-content width ÷ canvas width of each
   * asset) so the VISIBLE artwork lands at exactly the header's visible size.
   * Defaults to 1 (same asset in intro and header, e.g. the Minefy gold logo). */
  fillCompensation?: number;
  /**
   * Optional full-bleed photo shown behind the "generating" logo instead of
   * the flat `bg-background` fill — lets the intro open directly on the
   * hero photo (e.g. the CEO's mining/agro group art with the emblem
   * removed) rather than a plain color, so the ring/logo appears to
   * "belong" to that photo before flying up to the header.
   *
   * IMPORTANT: this must be a CLEAN plate — the emblem/wordmark burned into
   * the source composite has to be removed first. The logo here animates
   * away from center, so if the same emblem is still baked into the photo
   * it would visibly double up (one static, one flying) for the ~2s the
   * intro is on screen. Don't pass the raw CEO artwork directly.
   */
  backgroundSrc?: string;
};

/**
 * Brand intro: the logo "generates" in the center of the screen (blur-in +
 * a ring drawing around it + glow), then flies up to its final position in
 * the header. Plays once per real page load (a hard reload/new tab plays it
 * again; client-side navigation between pages does not — see
 * `playedThisLoad` above), and is skipped entirely under
 * `prefers-reduced-motion`. Measures the real header logo (`#targetId`) so
 * the landing position matches exactly. The whole overlay is
 * `aria-hidden="true"` (purely decorative, non-interactive — `pointerEvents:
 * "none"` so it never traps focus or blocks clicks) and unmounts itself once
 * the fly-in finishes, handing off to the real header logo underneath.
 *
 * Shared between the two ecosystems via props — `<LogoIntro />` (no props)
 * renders the gold Minefy intro anchoring on `(mineracao)`'s header; the
 * Agrofy world renders `<LogoIntro variant="green" .../>` anchoring on its
 * own header. Each carries its own `sessionKey` so the two never interfere.
 *
 * `backgroundSrc` (optional) swaps the flat-color backdrop for a full-bleed
 * photo — see that prop's own docstring for the "clean plate" requirement.
 * Neither world passes it yet: it's wired up here ready for the CEO's
 * mining/agro group photos once a background-removed (no emblem/wordmark)
 * version of each exists.
 */
export function LogoIntro({
  variant = "gold",
  logoSrc = "/images/logo-transparente.png",
  alt = "Minefy",
  logoWidth = 800,
  logoHeight = 570,
  targetId = "site-logo",
  sessionKey = "minefy-intro",
  fillCompensation = 1,
  backgroundSrc,
}: LogoIntroProps = {}) {
  const theme = THEME[variant];
  const reduce = useReducedMotion();
  const mounted = useMounted();
  // Start in "gen" so the overlay can play once mounted on the client. The
  // opaque overlay is only rendered after mount (see the `mounted` gate below):
  // without JS — and during SSR / the first hydration render — nothing is
  // painted, so no-JS visitors see the real page instead of a black screen.
  // `useMounted` is hydration-safe (SSR and first client render both `false`).
  const [phase, setPhase] = useState<Phase>("gen");
  const [fly, setFly] = useState<Fly | null>(null);

  // Whether the intro should play at all: skipped under reduced-motion or when
  // it already played during this page load. Evaluated only after mount
  // (client-only), so SSR/no-JS render nothing and there is no hydration
  // mismatch.
  const skip = mounted && (reduce === true || playedThisLoad.has(sessionKey));

  useEffect(() => {
    if (!mounted || skip) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const r = el.getBoundingClientRect();
        setFly({
          x: r.left + r.width / 2 - window.innerWidth / 2,
          y: r.top + r.height / 2 - window.innerHeight / 2,
          scale: (r.width / INTRO_W) * fillCompensation,
        });
      } else {
        setFly({
          x: -window.innerWidth / 2 + 120,
          y: -window.innerHeight / 2 + 60,
          scale: 0.34 * fillCompensation,
        });
      }
      setPhase("fly");
    }, 1650);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [mounted, skip, targetId, fillCompensation]);

  // Don't render the opaque overlay during SSR / before mount or without JS
  // (no-JS visitors would otherwise be stuck on a black screen), nor when the
  // intro is skipped or already finished.
  if (!mounted || skip || phase === "done") return null;

  const finish = () => {
    playedThisLoad.add(sessionKey);
    document.body.style.overflow = "";
    setPhase("done");
  };

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      {/* Background — fades out as the logo flies into place. Flat fallback
          fill; when `backgroundSrc` is set, the photo layer below covers it
          almost entirely, but this still guards any edge/overscroll gap. */}
      <motion.div
        className="absolute inset-0 bg-background"
        animate={{ opacity: phase === "fly" ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* Optional full-bleed photo (clean plate, no burned-in emblem) — the
          intro opens directly on the hero image instead of a flat color.
          Fades out in lockstep with the flat background above. */}
      {backgroundSrc && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: phase === "fly" ? 0 : 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image src={backgroundSrc} alt="" fill priority className="object-cover" sizes="100vw" />
          {/* Dark wash so the centered ring/logo and glow stay legible over
              the photo, matching the hero section's own treatment. */}
          <div className="absolute inset-0 bg-background/55" aria-hidden="true" />
        </motion.div>
      )}

      {/* faint dot texture under the logo for the "tech" feel — skipped over
          a real photo background, where the dot grid would just look noisy. */}
      {!backgroundSrc && (
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${theme.dot} 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(circle at 50% 50%, #000 0%, transparent 55%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 0%, transparent 55%)",
          }}
          animate={{ opacity: phase === "fly" ? 0 : [0, 1] }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Logo group (this is what flies to the header) */}
      <motion.div
        className="relative"
        style={{ width: INTRO_W }}
        animate={
          phase === "fly" && fly
            ? { x: fly.x, y: fly.y, scale: fly.scale }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={
          phase === "fly"
            ? { duration: 0.95, ease: [0.6, 0.01, 0.05, 0.95] }
            : { duration: 0 }
        }
        onAnimationComplete={() => phase === "fly" && finish()}
      >
        {/* glow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full"
          style={{
            background: `radial-gradient(circle, ${theme.glow}, transparent 70%)`,
            filter: "blur(34px)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: phase === "fly" ? 0 : [0, 0.9, 0.55], scale: [0.6, 1.25, 1] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* ring that draws around the logo while it "generates" */}
        <svg className="absolute -inset-5" viewBox="0 0 280 280" fill="none">
          <motion.circle
            cx="140"
            cy="140"
            r="135"
            stroke={theme.ring}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ rotate: -90, transformOrigin: "center" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: phase === "fly" ? 0 : 0.9 }}
            transition={{ pathLength: { duration: 1.2, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
          />
        </svg>

        {/* the logo itself — blur/scale in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(18px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Image
            src={logoSrc}
            alt={alt}
            width={logoWidth}
            height={logoHeight}
            priority
            className="h-auto w-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
