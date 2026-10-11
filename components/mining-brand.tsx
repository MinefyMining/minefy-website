"use client";

import Image from "next/image";

/**
 * Identidade Minefy nas páginas institucionais (WEBSITE-QA-20261011, Entrega B).
 *
 * Usa a mesma wordmark aprovada da home cinematográfica — nunca o emblema
 * circular antigo (`/images/logo-transparente.png`). Dois assets, um por
 * composição, sem redesenhar letras, proporção, inclinação ou o corte do F
 * pelo Y:
 *  - `on-dark`: MINE branco + FY dourado, transparente — o arquivo da home
 *    (`assets/optimized/brand-wordmark.*.webp`, cache imutável).
 *  - `on-light`: MINE grafite `#1A1A1A` + FY dourado, transparente — derivado
 *    pixel a pixel do mesmo arquivo (só o branco muda de cor).
 *
 * A troca é feita só em CSS (variantes arbitrárias do Tailwind sobre
 * `html.light`), por isso não há flash de hidratação: o servidor pinta a
 * versão escura (tema padrão) e o tema claro troca antes da primeira pintura.
 * A imagem oculta usa `loading="lazy"`, então só é baixada quando entra em uso.
 *
 * `surface`:
 *  - `theme`  — fundo acompanha o tema (header rolado, menu móvel, rodapé).
 *  - `dark`   — fundo sempre escuro.
 *  - `header` — topo transparente sobre o hero: escuro por padrão (foto escura
 *    com overlay fixo); nas páginas cujo topo segue o tema
 *    (`[data-hero-surface="theme"]`, ver `globals.css`) acompanha o tema.
 */
export const MINING_BRAND_ON_DARK = "/assets/optimized/brand-wordmark.0446c18db9.webp";
export const MINING_BRAND_ON_LIGHT = "/assets/brand/minefy-wordmark-on-light.webp";
const BRAND_WIDTH = 1520;
const BRAND_HEIGHT = 320;

type Surface = "theme" | "dark" | "header";

const VISIBILITY: Record<Surface, { dark: string; light: string }> = {
  theme: { dark: "block [.light_&]:hidden", light: "hidden [.light_&]:block" },
  dark: { dark: "block", light: "hidden" },
  header: {
    dark: "block [.light_body:has([data-hero-surface=theme])_&]:hidden",
    light: "hidden [.light_body:has([data-hero-surface=theme])_&]:block",
  },
};

type MiningBrandProps = {
  surface?: Surface;
  /** Largura do wrapper (classes Tailwind, ex.: `w-[156px]`). A altura segue a proporção 1520:320. */
  className?: string;
  /** Preload da versão escura (header acima da dobra). */
  priority?: boolean;
  id?: string;
  /** `sizes` da imagem para o otimizador do Next. */
  sizes?: string;
};

export function MiningBrand({ surface = "theme", className = "", priority = false, id, sizes = "200px" }: MiningBrandProps) {
  const visibility = VISIBILITY[surface];
  return (
    <span id={id} className={`inline-block shrink-0 align-middle ${className}`}>
      <Image
        src={MINING_BRAND_ON_DARK}
        alt="Minefy"
        width={BRAND_WIDTH}
        height={BRAND_HEIGHT}
        priority={priority}
        sizes={sizes}
        className={`h-auto w-full ${visibility.dark}`}
      />
      {surface !== "dark" && (
        <Image
          src={MINING_BRAND_ON_LIGHT}
          alt="Minefy"
          width={BRAND_WIDTH}
          height={BRAND_HEIGHT}
          loading="lazy"
          sizes={sizes}
          className={`h-auto w-full ${visibility.light}`}
        />
      )}
    </span>
  );
}
