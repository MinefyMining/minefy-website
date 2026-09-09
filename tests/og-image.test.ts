/**
 * Trava do contrato de og:image (MIKE-REVISAO-FINAL F1/F2) — critérios:
 *  (a) a URL emitida começa com o SITE_ORIGIN do mundo da página;
 *  (b) não contém /pt-BR;
 *  (c) não contém /agrofy;
 *  (d) responde 200 image/png sem redirect com o Host daquele mundo —
 *      (d) é runtime: fica no smoke de preview (curl nos dois hosts,
 *      evidência em ALEX-ENTREGA); (a)-(c) + a integridade da whitelist
 *      ficam mecanizados aqui.
 * A rota /api/og/[slug] fica FORA do matcher do proxy (proxy.ts exclui
 * /api), então a URL resolve idêntica nos dois domínios — mesma
 * propriedade que o Mike validou no B1 para /api/contact-token.
 */
import { describe, expect, it } from "vitest";
import { pageMetadata, ogSlug } from "@/lib/seo";
import { OG_PAGES } from "@/lib/og-pages";
import { SITE_ORIGIN, type Site } from "@/lib/site";

/**
 * Páginas publicadas VARRIDAS DO FILESYSTEM (F4): qualquer `page.tsx` novo
 * em um dos dois mundos entra aqui automaticamente — rota nova sem entrada
 * na whitelist OG_PAGES quebra a suíte em vez de virar og:image 404
 * silencioso em produção.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function pagesOf(groupDir: string, stripPrefix: string): string[] {
  const root = join(__dirname, "..", "app", "[locale]", groupDir);
  const paths: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, `${rel}/${entry}`);
      else if (entry === "page.tsx") paths.push(rel || "/");
    }
  };
  walk(root, "");
  return paths.map((p) => {
    const external = p === stripPrefix ? "/" : p.replace(new RegExp(`^${stripPrefix}`), "");
    return external === "" ? "/" : external;
  });
}

const PAGES: Array<{ site: Site; path: string }> = [
  ...pagesOf("(mineracao)", "/mineracao").map((path) => ({ site: "mineracao" as Site, path })),
  ...pagesOf("(agrofy)", "/agrofy").map((path) => ({ site: "agro" as Site, path })),
];

function ogImageUrl(site: Site, path: string): string {
  const meta = pageMetadata({ site, path, title: "t", description: "d" });
  const images = meta.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  return typeof first === "object" && first !== null && "url" in first
    ? String(first.url)
    : String(first);
}

describe("og:image — URL externa estável nos dois domínios (F1/F2)", () => {
  it.each(PAGES)("(%#) $site $path", ({ site, path }) => {
    const url = ogImageUrl(site, path);
    // (a) origem do mundo que serve a página
    expect(url.startsWith(`${SITE_ORIGIN[site]}/api/og/`)).toBe(true);
    // (b) nunca o prefixo de locale interno
    expect(url).not.toContain("/pt-BR");
    // (c) nunca o prefixo interno do mundo agro
    expect(url).not.toContain("/agrofy");
    // o slug emitido EXISTE na whitelist da rota, no mundo certo
    const slug = ogSlug(site, path);
    expect(url.endsWith(`/api/og/${slug}`)).toBe(true);
    expect(OG_PAGES[slug]).toBeDefined();
    expect(OG_PAGES[slug].site).toBe(site);
    // twitter:image acompanha
    const tw = pageMetadata({ site, path, title: "t", description: "d" }).twitter;
    expect((tw as { images?: string[] }).images?.[0]).toBe(url);
  });

  it("toda entrada da whitelist corresponde a uma página publicada (sem slug órfão)", () => {
    const expected = new Set(PAGES.map(({ site, path }) => ogSlug(site, path)));
    expect(Object.keys(OG_PAGES).sort()).toEqual([...expected].sort());
  });

  it("nenhuma convenção opengraph-image.tsx volta ao app (emite URL de path interno — F1)", async () => {
    const { readdirSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (/^opengraph-image\./.test(entry) || /^twitter-image\./.test(entry)) hits.push(full);
      }
    };
    walk(join(__dirname, "..", "app"));
    expect(hits).toEqual([]);
  });
});
