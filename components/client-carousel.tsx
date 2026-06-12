"use client";

import Image from "next/image";
import { motion } from "motion/react";

const clients = [
  { name: "Vale", logo: "/images/clients/vale.jpg" },
  { name: "Engineering do Brasil", logo: "/images/clients/engineering.jpg" },
  { name: "Aterpa", logo: "/images/clients/aterpa.jpg" },
  { name: "Coedra", logo: "/images/clients/coedra.jpg" },
  { name: "SG Bras", logo: "/images/clients/sgbras.jpg" },
  { name: "SCL Salum Construções", logo: "/images/clients/scl.jpg" },
  { name: "Consórcio Mina Fábrica", logo: "/images/clients/minafabrica.jpg" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

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
          className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
        >
          {/* gold ring on hover */}
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#D4A847]/0 transition-all duration-300 group-hover:ring-[#D4A847]/60"
            aria-hidden="true"
          />
          {/* gold sheen sweep */}
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#D4A847]/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            aria-hidden="true"
          />
          <Image
            src={client.logo}
            alt={client.name}
            width={220}
            height={90}
            className="relative max-h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
