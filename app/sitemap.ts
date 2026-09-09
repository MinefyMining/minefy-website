import type { MetadataRoute } from "next";

/**
 * Sitemap of the PUBLIC URLs on the primary domain (minefymining.com — the
 * mineração/corporate world; see `proxy.ts` for the domain split). Paths are
 * the externally-visible ones: the home is `/` (internally rewritten to
 * `/mineracao`), never the internal rewrite target. The Agrofy world lives
 * on its own domain and is deliberately not listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.minefymining.com";
  const routes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/solucoes", priority: 0.9 },
    { path: "/solucoes/ia-corporativa", priority: 0.9 },
    { path: "/solucoes/agentes-autonomos", priority: 0.9 },
    { path: "/solucoes/servicos-ti", priority: 0.9 },
    { path: "/experiencias", priority: 0.8 },
    { path: "/quem-somos", priority: 0.6 },
    { path: "/projetos", priority: 0.6 },
    { path: "/contato", priority: 0.7 },
    { path: "/privacidade", priority: 0.3 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
