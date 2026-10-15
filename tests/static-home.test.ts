/**
 * Guard da home estática (experiência cinematográfica — CEO 2026-10-09).
 * O bundle vem congelado do pacote de entrega
 * (`Minefy-Kimi/06-entregas/2026-10-09-site-minefy-publicacao/source/dist`);
 * só `home.html` (ex-`index.html`) foi adaptado para a origem pública.
 * Este teste trava as condições de publicação no domínio institucional:
 *   1. metadados apontam para https://www.minefymining.com, nunca para a
 *      origem privada de demonstração;
 *   2. todo recurso local referenciado por HTML/CSS/manifest existe em public/;
 *   3. links externos obrigatórios (plataforma, WhatsApp, e-mail) preservados;
 *   4. link "Website institucional" não é um loop para a própria home;
 *   5. guard de marcas (ActiSky, nunca fornecedor) também vale para o bundle.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(__dirname, "..", "public");
const ORIGIN = "https://www.minefymining.com";
const html = readFileSync(join(PUBLIC, "home.html"), "utf8");

describe("home.html — opening-screen performance budget", () => {
  it("keeps the initial JavaScript graph below 18 kB before compression", () => {
    const visited = new Set<string>();
    const visit = (file: string) => {
      file = file.replace(/^\.\//, "").split("?")[0];
      if (visited.has(file)) return;
      visited.add(file);
      const code = readFileSync(join(PUBLIC, file), "utf8");
      // Static imports only: dynamic imports belong to the destination section.
      for (const match of code.matchAll(/\bimport\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g)) visit(match[1]);
    };
    for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) visit(match[1]);
    const bytes = [...visited].reduce((total, file) => total + readFileSync(join(PUBLIC, file)).length, 0);
    expect(bytes).toBeLessThan(18000);
    expect([...visited]).not.toContain("story.js");
    expect([...visited]).not.toContain("command.js");
    expect([...visited].some(file => file.startsWith("vendor/"))).toBe(false);
  });
});

const FORBIDDEN = /galileosky|atlas.?copco|hardhat|roboflex|samsung|kubota|\bmwm\b|\bxas[\s-]?\d/i;

function attr(name: string, prop: "property" | "name" | "rel" = "property"): string | null {
  const re =
    prop === "rel"
      ? new RegExp(`<link[^>]*rel="${name}"[^>]*href="([^"]+)"`)
      : new RegExp(`<meta[^>]*${prop}="${name}"[^>]*content="([^"]+)"`);
  return html.match(re)?.[1] ?? null;
}

describe("home.html — metadados na origem pública", () => {
  it("não referencia a origem privada de demonstração", () => {
    expect(html).not.toMatch(/chatgpt\.site|patryckgiovani/i);
  });

  it("canonical, og:url, og:image e twitter:image apontam para o domínio institucional", () => {
    expect(attr("canonical", "rel")).toBe(`${ORIGIN}/`);
    expect(attr("og:url")).toBe(`${ORIGIN}/`);
    expect(attr("og:image")).toMatch(new RegExp(`^${ORIGIN}/assets/optimized/brand-social\\.[0-9a-f]{10}\\.png$`));
    expect(attr("twitter:image", "name")).toBe(attr("og:image"));
    expect(attr("og:image:type")).toBe("image/png");
    expect(attr("og:image:width")).toBe("1200");
    expect(attr("og:image:height")).toBe("675");
    expect(attr("twitter:card", "name")).toBe("summary_large_image");
  });

  it("a imagem og existe em public/ (1200×675 PNG derivado do WebP aprovado)", () => {
    const file = attr("og:image")!.replace(`${ORIGIN}/`, "");
    expect(existsSync(join(PUBLIC, file))).toBe(true);
  });

  it("idioma e título preservados do pacote aprovado", () => {
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain("<title>Minefy — Da máquina à decisão</title>");
  });
});

describe("home.html — links", () => {
  it("plataforma, WhatsApp e e-mail institucional preservados", () => {
    expect(html).toContain('href="https://app.minefymining.com"');
    expect(html).toContain('href="https://wa.me/5531993801664?');
    expect(html).toContain('href="mailto:contato@minefymining.com"');
  });

  it("'Website institucional' leva à home corporativa anterior (/mineracao), não à própria home", () => {
    expect(html).toContain('<a href="/mineracao">Website institucional ↗</a>');
    expect(html).not.toContain('href="https://www.minefymining.com"');
  });

  it("toda âncora interna (#id) tem destino na página", () => {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    expect(anchors.length).toBeGreaterThan(10);
    for (const a of anchors) expect(ids.has(a), `#${a}`).toBe(true);
  });
});

describe("bundle estático — integridade dos recursos locais", () => {
  const localRefs = (text: string) =>
    [...text.matchAll(/(?:href|src)="([^"#:?]+)(?:\?[^"]*)?"/g)]
      .map((m) => m[1])
      .filter(
        (p) =>
          !p.startsWith("data:") &&
          p !== "/mineracao" &&
          // SITE-I18N: os hrefs das bandeiras são ROTAS (a home localizada é
          // servida por rewrite do proxy), não arquivos em public/.
          !/^\/(en|es|zh-CN)$/.test(p),
      );

  it("todo href/src local do HTML existe em public/", () => {
    const refs = localRefs(html);
    expect(refs.length).toBeGreaterThan(10);
    for (const r of refs) expect(existsSync(join(PUBLIC, r)), r).toBe(true);
  });

  it("todo candidato de srcset/imagesrcset do HTML existe em public/", () => {
    const sets = [...html.matchAll(/(?:imagesrcset|srcset)="([^"]+)"/g)].map((m) => m[1]);
    expect(sets.length).toBeGreaterThan(3);
    for (const s of sets) {
      for (const cand of s.split(",")) {
        const file = cand.trim().split(/\s+/)[0];
        expect(existsSync(join(PUBLIC, file)), file).toBe(true);
      }
    }
  });

  it("toda url() dos CSS da home existe em public/", () => {
    const css = ["style.css", "story.css", "cinema.css", "command.css", "brand.css"]
      .map((f) => readFileSync(join(PUBLIC, f), "utf8"))
      .join("\n");
    const urls = [...css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)]
      .map((m) => m[1])
      .filter((u) => !u.startsWith("data:") && !u.startsWith("#"));
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(existsSync(join(PUBLIC, u)), u).toBe(true);
  });

  it("todo arquivo do manifesto de mídia existe em public/", () => {
    const manifest = readFileSync(join(PUBLIC, "media-manifest.js"), "utf8");
    const files = [...manifest.matchAll(/"(assets\/optimized\/[^"\s]+)"/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThan(15);
    for (const f of new Set(files)) expect(existsSync(join(PUBLIC, f)), f).toBe(true);
  });

  it("bibliotecas vendor referenciadas existem", () => {
    expect(existsSync(join(PUBLIC, "vendor", "gsap.min.js"))).toBe(true);
    expect(existsSync(join(PUBLIC, "vendor", "ScrollTrigger.min.js"))).toBe(true);
  });
});

describe("bundle estático — lista FECHADA de arquivos (BLOQUEADO-FAYE 2026-10-10: um log de hook entrou em public/)", () => {
  /** Inventário exato do bundle publicado: 65 arquivos vindos verbatim do
   * pacote + `home.html` + o PNG og + 2 variantes do celular com logo novo + o carregador de melhorias progressivas
   * + `assets/brand/minefy-wordmark-on-light.webp` (wordmark para composição clara das páginas
   * institucionais, WEBSITE-QA-20261011 — derivada pixel a pixel da wordmark aprovada da home).
   * SITE-I18N (2026-10-13): + `home-en.html`, `home-es.html`, `home-zh-CN.html`
   * (homes localizadas geradas em build), `home-i18n.js` (loader estático) e
   * `home-text.<locale>.js` ×4 (dicionários puros carregados sob demanda).
   * As variantes anteriores ficam disponíveis para páginas já abertas. Arquivo a mais (log, temporário,
   * dotfile) ou a menos QUEBRA este teste — é a trava. Mudou o bundle de
   * propósito? Regere `tests/fixtures/static-home-files.json` conscientemente. */
  const EXPECTED = JSON.parse(
    readFileSync(join(__dirname, "fixtures", "static-home-files.json"), "utf8"),
  ) as string[];

  const walk = (dir: string, rel = "", out: string[] = []): string[] => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(dir, entry.name), r, out);
      else out.push(r);
    }
    return out;
  };
  const bundleFiles = () =>
    walk(PUBLIC)
      .filter((f) => /^home(-[a-zA-Z-]+)?\.html$/.test(f) || /^(assets|vendor)\//.test(f) || /^[^/]+\.(js|css)$/.test(f))
      .sort();

  it("nenhum arquivo ou diretório oculto (segmento iniciado por ponto) em public/", () => {
    const hidden = walk(PUBLIC).filter((f) => f.split("/").some((s) => s.startsWith(".")));
    expect(hidden).toEqual([]);
  });

  it("o conjunto de arquivos do bundle é exatamente o inventário esperado", () => {
    expect(EXPECTED.length).toBe(79);
    expect(bundleFiles()).toEqual([...EXPECTED].sort());
  });
});

describe("bundle estático — guard de marcas (ActiSky, nunca fornecedor)", () => {
  it("HTML, JS e CSS da home não citam GalileoSky nem fornecedores", () => {
    const files = readdirSync(PUBLIC).filter((f) => /\.(html|js|css)$/.test(f));
    expect(files).toContain("home.html");
    const hits: string[] = [];
    for (const f of files) {
      const m = readFileSync(join(PUBLIC, f), "utf8").match(FORBIDDEN);
      if (m) hits.push(`${f} → "${m[0]}"`);
    }
    expect(hits).toEqual([]);
  });
});
