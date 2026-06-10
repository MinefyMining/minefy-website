"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const INTRO_W = 240; // px — rendered width of the intro logo

type Phase = "gen" | "fly" | "done";
type Fly = { x: number; y: number; scale: number };

/**
 * Brand intro: the logo "generates" in the center of the screen (blur-in +
 * a gold ring drawing around it + glow), then flies up to its final position
 * in the header. Plays once per browser session; skipped entirely under
 * `prefers-reduced-motion`. Measures the real header logo (#site-logo) so the
 * landing position matches exactly.
 */
export function LogoIntro() {
  const reduce = useReducedMotion();
  // Start in "gen" so the overlay is present on first paint (no page flash,
  // and SSR === first client render → no hydration mismatch).
  const [phase, setPhase] = useState<Phase>("gen");
  const [fly, setFly] = useState<Fly | null>(null);

  useEffect(() => {
    if (reduce || sessionStorage.getItem("minefy-intro")) {
      setPhase("done");
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      const el = document.getElementById("site-logo");
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
  }, [reduce]);

  if (phase === "done") return null;

  const finish = () => {
    sessionStorage.setItem("minefy-intro", "1");
    document.body.style.overflow = "";
    setPhase("done");
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center" style={{ pointerEvents: "none" }}>
      {/* Background — fades out as the logo flies into place */}
      <motion.div
        className="absolute inset-0 bg-[#0A0A0A]"
        animate={{ opacity: phase === "fly" ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {/* faint dot texture under the logo for the "tech" feel */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(212,168,71,0.10) 1px, transparent 1px)",
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
        {/* gold glow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,168,71,0.55), transparent 70%)",
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
            stroke="#D4A847"
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
            src="/images/logo-transparente.png"
            alt="Minefy"
            width={800}
            height={570}
            priority
            className="h-auto w-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
