"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useIsLight } from "@/lib/use-theme-store";

type Variant = "dark" | "light";

const clients = [
  { name: "Vale", base: "vale" },
  { name: "Engineering do Brasil", base: "engineering" },
  { name: "Aterpa", base: "aterpa" },
  { name: "Coedra", base: "coedra" },
  { name: "SG Bras", base: "sgbras" },
  { name: "SCL Salum Construções", base: "scl" },
  { name: "Consórcio Mina Fábrica", base: "minafabrica" },
  { name: "Trust", base: "trust" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

/** Logo with a text fallback — the client is never lost if the image fails. */
function ClientLogo({ name, src, variant }: { name: string; src: string; variant: Variant }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        className={`relative text-center text-sm font-semibold uppercase tracking-wide ${
          variant === "light" ? "text-[#0A0A0A]" : "text-white/70 group-hover:text-white"
        }`}
      >
        {name}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={220}
      height={84}
      onError={() => setErrored(true)}
      className={
        variant === "light"
          ? "relative max-h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          : "relative max-h-12 w-auto object-contain opacity-55 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
      }
    />
  );
}

export function ClientCarousel() {
  const variant: Variant = useIsLight() ? "light" : "dark";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {clients.map((client) => {
        const src =
          variant === "light"
            ? `/images/clients/${client.base}.png`
            : `/images/clients/${client.base}-mono.png`;

        return (
          <motion.div
            key={client.name}
            variants={item}
            className={
              variant === "light"
                ? "group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
                : "group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4A847]/40 hover:bg-white/[0.04]"
            }
          >
            {variant === "light" ? (
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#D4A847]/0 transition-all duration-300 group-hover:ring-[#D4A847]/60"
                aria-hidden="true"
              />
            ) : (
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(212,168,71,0.10), transparent 70%)" }}
                aria-hidden="true"
              />
            )}
            <ClientLogo name={client.name} src={src} variant={variant} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
