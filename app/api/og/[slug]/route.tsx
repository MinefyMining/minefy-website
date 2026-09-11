import { ogImage } from "@/lib/og";
import { OG_PAGES } from "@/lib/og-pages";

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
