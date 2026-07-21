"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useMounted } from "@/lib/use-theme-store";

const INTRO_W = 240; // px — rendered width of the intro logo

type Phase = "gen" | "fly" | "done";
type Fly = { x: number; y: number; scale: number };
type Variant = "gold" | "green";

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
  /** sessionStorage key gating the "once per session" behavior — keep distinct
   * per ecosystem so visiting one world doesn't skip the intro on the other. */
  sessionKey?: string;
};

/**
 * Brand intro: the logo "generates" in the center of the screen (blur-in +
 * a ring drawing around it + glow), then flies up to its final position in
 * the header. Plays once per browser session; skipped entirely under
 * `prefers-reduced-motion`. Measures the real header logo (`#targetId`) so
 * the landing position matches exactly.
 *
 * Shared between the two ecosystems via props — `<LogoIntro />` (no props)
 * renders the gold Minefy intro anchoring on `(mineracao)`'s header; the
 * Agrofy world renders `<LogoIntro variant="green" .../>` anchoring on its
 * own header. Each carries its own `sessionKey` so the two never interfere.
 */
export function LogoIntro({
  variant = "gold",
  logoSrc = "/images/logo-transparente.png",
  alt = "Minefy",
  logoWidth = 800,
  logoHeight = 570,
  targetId = "site-logo",
  sessionKey = "minefy-intro",
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
  // it already played this session. Evaluated only after mount (client-only),
  // so SSR/no-JS render nothing and there is no hydration mismatch.
  const skip =
    mounted &&
    (reduce === true ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem(sessionKey) !== null));

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
          scale: r.width / INTRO_W,
        });
      } else {
        setFly({ x: -window.innerWidth / 2 + 120, y: -window.innerHeight / 2 + 60, scale: 0.34 });
      }
      setPhase("fly");
    }, 1650);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [mounted, skip, targetId]);

  // Don't render the opaque overlay during SSR / before mount or without JS
  // (no-JS visitors would otherwise be stuck on a black screen), nor when the
  // intro is skipped or already finished.
  if (!mounted || skip || phase === "done") return null;

  const finish = () => {
    sessionStorage.setItem(sessionKey, "1");
    document.body.style.overflow = "";
    setPhase("done");
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center" style={{ pointerEvents: "none" }}>
      {/* Background — fades out as the logo flies into place */}
      <motion.div
        className="absolute inset-0 bg-background"
        animate={{ opacity: phase === "fly" ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {/* faint dot texture under the logo for the "tech" feel */}
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
