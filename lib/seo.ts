import type { Metadata } from "next";
import { canonicalFor, localizedCanonicalFor, SITE_ORIGIN, type Site } from "./site";
import { locales } from "@/i18n/config";

/**
 * Metadata completa por página (MIKE-ARQUITETURA §1.5 · MIKE-REVISAO O3):
 * canonical absoluto + openGraph (url/siteName/type) + twitter card.
 * A imagem OG é servida por `/api/og/[slug]` (gerada localmente com
 * `next/og`, sem serviço externo) — `/api/*` fica fora do matcher do proxy,
 * então a URL resolve igual nos dois domínios. `path` é sempre o EXTERNO
 * (canonical agro nunca contém /agrofy).
 *
 * SITE-I18N (CEO 2026-10-13): no mundo Minefy, `locale` produz canonical da
 * PRÓPRIA versão (PT sem prefixo; `/en`, `/es`, `/zh-CN` com prefixo) e
 * hreflang recíproco entre as quatro versões + x-default. O mundo Agrofy
 * permanece PT-only: sem bloco `languages` e canonical sempre PT.
 */
const OG_LOCALE: Record<string, string> = {
  "pt-BR": "pt_BR",
  en: "en_US",
  es: "es_ES",
  "zh-CN": "zh_CN",
};

export function pageMetadata(opts: {
  site: Site;
  path: string;
  title: string;
  description: string;
  locale?: string;
}): Metadata {
  const { site, path, title, description } = opts;
  const locale = site === "mineracao" ? (opts.locale ?? "pt-BR") : "pt-BR";
  const url = site === "mineracao" ? localizedCanonicalFor(site, path, locale) : canonicalFor(site, path);
  const image = {
    url: `${SITE_ORIGIN[site]}/api/og/${ogSlug(site, path)}`,
    width: 1200,
    height: 630,
    alt: title,
  };
  const languages =
    site === "mineracao"
      ? Object.fromEntries([
          ...locales.map((l) => [l, localizedCanonicalFor(site, path, l)]),
          ["x-default", localizedCanonicalFor(site, path, "pt-BR")],
        ])
      : undefined;
  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      title,
      description,
      url,
      siteName: site === "agro" ? "Agrofy" : "Minefy Mining System",
      type: "website",
      locale: OG_LOCALE[locale] ?? "pt_BR",
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
