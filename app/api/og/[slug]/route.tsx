import { ogImage } from "@/lib/og";
import type { Site } from "@/lib/site";
import messages from "@/messages/pt-BR.json";

/**
 * Imagens OpenGraph 1200×630 geradas localmente via `next/og` — MIKE-REVISAO
 * O3. Vive sob `/api/*` DE PROPÓSITO: o matcher do proxy exclui `/api`, então
 * a URL é idêntica e resolvível nos DOIS domínios (a 1ª tentativa, com a
 * convenção `opengraph-image.tsx`, emitia a URL do path INTERNO —
 * `/pt-BR/agrofy/...` — que devolvia 404 no host Agrofy).
 *
 * WHITELIST estática: o slug só seleciona uma entrada deste mapa — nenhum
 * texto do request entra na imagem (sem vetor de conteúdo arbitrário).
 * `lib/seo.ts#ogSlug` gera o slug do lado das páginas; os dois lados derivam
 * do mesmo par (site, path externo) e não podem divergir.
 */
const OG_PAGES: Record<string, { title: string; site: Site }> = {
  home: { title: messages.corporateHome.metadata.title, site: "mineracao" },
  solucoes: { title: messages.services.hub.metadata.title, site: "mineracao" },
  "solucoes-ia-corporativa": { title: messages.services.ia.metadata.title, site: "mineracao" },
  "solucoes-agentes-autonomos": { title: messages.services.agentes.metadata.title, site: "mineracao" },
  "solucoes-servicos-ti": { title: messages.services.ti.metadata.title, site: "mineracao" },
  experiencias: { title: messages.experiences.metadata.title, site: "mineracao" },
  contato: { title: messages.contact.metadata.title, site: "mineracao" },
  "quem-somos": { title: messages.about.metadata.title, site: "mineracao" },
  projetos: { title: messages.projects.metadata.title, site: "mineracao" },
  privacidade: { title: messages.privacy.metadata.title, site: "mineracao" },
  "agro-home": { title: messages.agrofy.metadata.title, site: "agro" },
  "agro-solucoes": { title: messages.agrofySolutions.metadata.title, site: "agro" },
  "agro-quem-somos": { title: messages.agrofyAbout.metadata.title, site: "agro" },
  "agro-piloto": { title: messages.agrofyPilot.metadata.title, site: "agro" },
  "agro-contato": { title: messages.agrofy.contactPage.metadata.title, site: "agro" },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = OG_PAGES[slug];
  if (!page) {
    return new Response("Not found", { status: 404 });
  }
  const response = ogImage(page);
  // Conteúdo determinístico por deploy — cacheável sem medo.
  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  );
  return response;
}
