import { canonicalFor, resolveSiteFromHost, type Site } from "@/lib/site";

/**
 * Sitemap por DOMÍNIO: um deployment serve dois mundos, então o sitemap é um
 * Route Handler dinâmico que lê o Host real e emite apenas as URLs PÚBLICAS
 * daquele mundo (paths externos — nunca `/mineracao` nem `/agrofy/*`).
 * O matcher do proxy exclui paths com ponto, então o Host chega intacto.
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
    .map((path) => `  <url><loc>${canonicalFor(site, path)}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
