"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ParticleField } from "@/components/particle-field";
import { DotGridBackground } from "@/components/dot-grid-background";
import { MagneticButton } from "@/components/magnetic-button";

interface AgroHeroHomeProps {
  badge: string;
  title: string;
  subtitle: string;
  trust: string;
  cta: string;
  ctaSecondary: string;
  appUrl: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 18 },
  },
};

/**
 * Green mirror of `HeroHome` — full-screen animated hero for the Agrofy
 * home. Same layered background (photo + dark wash + radial vignette +
 * particle constellation + cursor dot-grid) and stagger choreography as the
 * mining hero, but with agro copy/photo and green accents.
 *
 * `ParticleField` gets explicit green `colorRgb`/`highlightRgb` (the canvas
 * engine draws with `ctx.fillStyle`/`strokeStyle`, so CSS scoping can't
 * reach it). `DotGridBackground`'s cursor spotlight is recolored via the
 * `.agro-theme .dotgrid-glow` CSS override in globals.css instead, since
 * that component's color comes from a shared class, not props.
 */
export function AgroHeroHome({
  badge,
  title,
  subtitle,
  trust,
  cta,
  ctaSecondary,
  appUrl,
}: AgroHeroHomeProps) {
  // Highlight the first word with the animated green gradient.
  const [firstWord, ...rest] = title.split(" ");
  const restTitle = rest.join(" ");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Background photo — kept as a faint, cinematic texture under the tech
          layers. Same file as `LogoIntro`'s `backgroundSrc` in this world's
          layout, so when the brand-intro overlay fades out on mount, it
          reveals this exact same scene underneath — no visible photo swap. */}
      <Image
        src="/images/home-hero/hero-agrofy-bg.jpg"
        alt="Pulverizador autopropelido em operação numa lavoura de soja ao pôr do sol"
        fill
        priority
        className="scale-105 object-cover object-[75%_55%]"
        sizes="100vw"
      />

      {/* Heavy dark wash so the photo reads as texture and the constellation pops */}
      <div className="absolute inset-0 bg-[#0A0A0A]/82" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/55"
        aria-hidden="true"
      />
      {/* radial vignette + green core glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 30% 45%, rgba(34,197,94,0.12), transparent 60%), radial-gradient(120% 100% at 50% 50%, transparent 40%, #0A0A0A 100%)",
        }}
        aria-hidden="true"
      />

      {/* Animated ambient layers — particle constellation + cursor dot-grid, both green */}
      <ParticleField className="opacity-90" colorRgb="34,197,94" highlightRgb="134,239,172" />
      <DotGridBackground className="opacity-60" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          className="max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/40 bg-[#16A34A]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#4ADE80]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
              </span>
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            <span className="text-green-flow">{firstWord}</span>{" "}
            {restTitle}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Link
                href="/contato"
                className="btn-sheen inline-flex items-center rounded-lg bg-[#16A34A] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(22,163,74,0.3)] transition-colors duration-200 hover:bg-[#15803D]"
              >
                {cta}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/10"
              >
                {ctaSecondary}
              </a>
            </MagneticButton>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 inline-flex items-center gap-2 text-sm text-white/55"
          >
            <Check className="h-4 w-4 shrink-0 text-[#4ADE80]" />
            {trust}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <motion.div
          className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="h-1.5 w-1 rounded-full bg-[#4ADE80]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
