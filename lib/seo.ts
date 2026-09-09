import type { Metadata } from "next";
import { canonicalFor, type Site } from "./site";

/**
 * Metadata completa por página (MIKE-ARQUITETURA §1.5 · MIKE-REVISAO O3):
 * canonical absoluto + openGraph (url/siteName/type) + twitter card.
 * A imagem OG NÃO entra aqui — vem da convenção `opengraph-image.tsx` de
 * cada rota (gerada localmente com `next/og`, sem serviço externo), que o
 * Next injeta e resolve contra o `metadataBase` do layout do route group.
 * `path` é sempre o EXTERNO (canonical agro nunca contém /agrofy).
 */
export function pageMetadata(opts: {
  site: Site;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { site, path, title, description } = opts;
  const url = canonicalFor(site, path);
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
