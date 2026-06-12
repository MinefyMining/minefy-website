"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const clients = [
  { name: "Vale", logo: "/images/clients/vale-mono.png" },
  { name: "Engineering do Brasil", logo: "/images/clients/engineering-mono.png" },
  { name: "Aterpa", logo: "/images/clients/aterpa-mono.png" },
  { name: "Coedra", logo: "/images/clients/coedra-mono.png" },
  { name: "SG Bras", logo: "/images/clients/sgbras-mono.png" },
  { name: "SCL Salum Construções", logo: "/images/clients/scl-mono.png" },
  { name: "Consórcio Mina Fábrica", logo: "/images/clients/minafabrica-mono.png" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

/** Monochrome logo with a text fallback — the client is never lost if the image fails. */
function ClientLogo({ name, logo }: { name: string; logo: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className="relative text-center text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors duration-300 group-hover:text-white">
        {name}
      </span>
    );
  }

  return (
    <Image
      src={logo}
      alt={name}
      width={220}
      height={84}
      onError={() => setErrored(true)}
      className="relative max-h-12 w-auto object-contain opacity-55 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
    />
  );
}

export function ClientCarousel() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {clients.map((client) => (
        <motion.div
          key={client.name}
          variants={item}
          className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4A847]/40 hover:bg-white/[0.04]"
        >
          {/* gold spotlight that fades in on hover */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(212,168,71,0.10), transparent 70%)" }}
            aria-hidden="true"
          />
          <ClientLogo name={client.name} logo={client.logo} />
        </motion.div>
      ))}
    </motion.div>
  );
}
