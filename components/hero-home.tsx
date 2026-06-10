"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { AuroraBackground } from "@/components/aurora-background";
import { MagneticButton } from "@/components/magnetic-button";

interface HeroHomeProps {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  appUrl: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 18 },
  },
};

export function HeroHome({
  badge,
  title,
  subtitle,
  cta,
  ctaSecondary,
  appUrl,
}: HeroHomeProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Background photo */}
      <Image
        src="/images/mining/hero-cat-d11.jpg"
        alt="CAT D11 operando em mina a céu aberto"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Left gradient overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"
        aria-hidden="true"
      />

      {/* Animated ambient layer (aurora + particles), masked so it reads as depth */}
      <AuroraBackground grid className="opacity-70 mix-blend-screen" />

      {/* Content — stagger entrance (motion auto-respects prefers-reduced-motion
          via <MotionConfig reducedMotion="user"> in the locale layout) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          className="max-w-xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A847]/30 bg-[#D4A847]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#D4A847]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4A847] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4A847]" />
              </span>
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 text-base leading-relaxed text-white/70 md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Link
                href="/contato"
                className="inline-flex items-center rounded-lg bg-[#D4A847] px-6 py-3 text-sm font-semibold text-[#0A0A0A] shadow-[0_8px_30px_rgba(212,168,71,0.25)] transition-colors duration-200 hover:bg-[#C49B3F]"
              >
                {cta}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
              >
                {ctaSecondary}
              </a>
            </MagneticButton>
          </motion.div>
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
          <span className="h-1.5 w-1 rounded-full bg-[#D4A847]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
