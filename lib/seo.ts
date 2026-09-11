import type { Metadata } from "next";
import { canonicalFor, SITE_ORIGIN, type Site } from "./site";

/**
 * Metadata completa por página (MIKE-ARQUITETURA §1.5 · MIKE-REVISAO O3):
 * canonical absoluto + openGraph (url/siteName/type) + twitter card.
 * A imagem OG é servida por `/api/og/[slug]` (gerada localmente com
 * `next/og`, sem serviço externo) — `/api/*` fica fora do matcher do proxy,
 * então a URL resolve igual nos dois domínios. `path` é sempre o EXTERNO
 * (canonical agro nunca contém /agrofy).
 */
export function pageMetadata(opts: {
  site: Site;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { site, path, title, description } = opts;
  const url = canonicalFor(site, path);
  const image = {
    url: `${SITE_ORIGIN[site]}/api/og/${ogSlug(site, path)}`,
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site === "agro" ? "Agrofy" : "Minefy Mining System",
      type: "website",
      locale: "pt_BR",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

/** Slug determinístico da imagem OG para (site, path externo) — precisa
 * bater com a whitelist de `app/api/og/[slug]/route.tsx`. */
export function ogSlug(site: Site, path: string): string {
  const base = path === "/" ? "home" : path.slice(1).replace(/\//g, "-");
  return site === "agro" ? `agro-${base}` : base;
}
