import { canonicalFor, localizedCanonicalFor, resolveSiteFromHost, type Site } from "@/lib/site";
import { locales } from "@/i18n/config";

/**
 * Sitemap por DOMÍNIO: um deployment serve dois mundos, então o sitemap é um
 * Route Handler dinâmico que lê o Host real e emite apenas as URLs PÚBLICAS
 * daquele mundo (paths externos — nunca `/mineracao` nem `/agrofy/*`).
 * O matcher do proxy exclui paths com ponto, então o Host chega intacto.
 *
 * SITE-I18N (CEO 2026-10-13): no mundo Minefy cada URL declara as versões
 * reais existentes via xhtml:link hreflang (pt-BR, en, es, zh-CN + x-default)
 * — só idiomas efetivamente servidos; o mundo Agrofy permanece PT-only, sem
 * bloco de alternates.
 */
const PUBLIC_PATHS: Record<Site, string[]> = {
  mineracao: [
    "/",
    "/solucoes",
    "/solucoes/ia-corporativa",
    "/solucoes/agentes-autonomos",
    "/solucoes/servicos-ti",
    "/experiencias",
    "/quem-somos",
    "/projetos",
    "/contato",
    "/privacidade",
  ],
  agro: ["/", "/solucoes", "/quem-somos", "/piloto", "/contato"],
};

export function GET(request: Request) {
  const site = resolveSiteFromHost(request.headers.get("host"));
  const urls = PUBLIC_PATHS[site]
    .map((path) => {
      if (site === "agro") return `  <url><loc>${canonicalFor(site, path)}</loc></url>`;
      const links = [
        ...locales.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${localizedCanonicalFor(site, path, l)}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedCanonicalFor(site, path, "pt-BR")}"/>`,
      ].join("\n");
      return `  <url>\n    <loc>${localizedCanonicalFor(site, path, "pt-BR")}</loc>\n${links}\n  </url>`;
    })
    .join("\n");
  const xmlns =
    site === "mineracao"
      ? `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"`
      : `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${xmlns}>\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
