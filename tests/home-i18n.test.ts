/**
 * SITE-I18N — home cinematográfica localizada.
 *
 * Cobre o pipeline scripts/home-i18n → public/home*.html + home-text.*.js:
 *  - paridade e placeholders dos dicionários (413 folhas × 4 idiomas);
 *  - FRESCURA: regenerar os artefatos a partir dos dicionários não muda
 *    nenhum byte (ninguém editou o HTML gerado à mão);
 *  - estrutura das quatro homes: lang, canonical próprio, hreflang recíproco
 *    (4 + x-default), og:locale, nav de bandeiras com 4 links e destaque do
 *    ativo, IDs essenciais preservados, nenhum token {{ }} restante;
 *  - dicionários home-text.<locale>.js carregáveis como dados puros.
 */
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const LOCALES = ["pt-BR", "en", "es", "zh-CN"] as const;
const HTML_FILE: Record<string, string> = {
  "pt-BR": "home.html",
  en: "home-en.html",
  es: "home-es.html",
  "zh-CN": "home-zh-CN.html",
};
const PREFIX: Record<string, string> = { "pt-BR": "", en: "/en", es: "/es", "zh-CN": "/zh-CN" };
const OG_LOCALE: Record<string, string> = { "pt-BR": "pt_BR", en: "en_US", es: "es_ES", "zh-CN": "zh_CN" };
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

const loadDict = (l: string) =>
  JSON.parse(readFileSync(join(ROOT, "scripts", "home-i18n", "locales", `${l}.json`), "utf8"));

type Leaf = [string, unknown];
function flat(node: unknown, path = "", out: Leaf[] = []): Leaf[] {
  if (Array.isArray(node)) node.forEach((v, i) => flat(v, `${path}[${i}]`, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) flat(v, path ? `${path}.${k}` : k, out);
  } else out.push([path, node]);
  return out;
}

describe("SITE-I18N — dicionários da home", () => {
  const ptLeaves = flat(loadDict("pt-BR"));
  for (const locale of ["en", "es", "zh-CN"]) {
    it(`${locale}: paridade de chaves e placeholders`, () => {
      const leaves = flat(loadDict(locale));
      const byPath = new Map(leaves);
      const missing = ptLeaves.filter(([p]) => !byPath.has(p)).map(([p]) => p);
      const extra = leaves.filter(([p]) => !new Map(ptLeaves).has(p)).map(([p]) => p);
      expect(missing).toEqual([]);
      expect(extra).toEqual([]);
      const empty = leaves.filter(([, v]) => typeof v === "string" && !v.trim());
      expect(empty).toEqual([]);
      for (const [p, v] of ptLeaves) {
        if (typeof v !== "string") continue;
        const other = byPath.get(p);
        if (typeof other !== "string") continue;
        expect((other.match(/\{[a-z]+\}/g) ?? []).sort(), p).toEqual(
          (v.match(/\{[a-z]+\}/g) ?? []).sort(),
        );
      }
    });
  }
});

describe("SITE-I18N — frescura dos artefatos gerados", () => {
  it("regenerar não muda nenhum byte (HTML ×4 + dicionários ×4)", () => {
    const before = Object.fromEntries(
      readdirSync(PUBLIC)
        .filter((f) => /^home(-[a-zA-Z-]+)?\.html$|^home-text\.[a-zA-Z-]+\.js$/.test(f))
        .map((f) => [f, sha(readFileSync(join(PUBLIC, f), "utf8"))]),
    );
    execFileSync("node", [join(ROOT, "scripts", "build-home-i18n.mjs")], { stdio: "pipe" });
    const after = Object.fromEntries(
      readdirSync(PUBLIC)
        .filter((f) => /^home(-[a-zA-Z-]+)?\.html$|^home-text\.[a-zA-Z-]+\.js$/.test(f))
        .map((f) => [f, sha(readFileSync(join(PUBLIC, f), "utf8"))]),
    );
    expect(after).toEqual(before);
  });
});

describe("SITE-I18N — estrutura das quatro homes", () => {
  const ESSENTIAL_IDS = [
    "header", "main", "jornada", "story-canvas", "preditiva", "frota",
    "inteligencia", "command-markers", "solucoes", "contato", "mobile-menu",
  ];
  for (const locale of LOCALES) {
    describe(locale, () => {
      const html = readFileSync(join(PUBLIC, HTML_FILE[locale]), "utf8");

      it("lang correto no HTML inicial", () => {
        expect(html).toContain(`<html lang="${locale}">`);
      });
      it("canonical da própria versão + og:locale", () => {
        expect(html).toContain(
          `<link rel="canonical" href="https://www.minefymining.com${PREFIX[locale] || "/"}">`,
        );
        expect(html).toContain(`<meta property="og:locale" content="${OG_LOCALE[locale]}">`);
      });
      it("hreflang recíproco: 4 idiomas + x-default", () => {
        for (const l of LOCALES) {
          expect(html).toContain(
            `<link rel="alternate" hreflang="${l}" href="https://www.minefymining.com${PREFIX[l] || "/"}">`,
          );
        }
        expect(html).toContain(
          '<link rel="alternate" hreflang="x-default" href="https://www.minefymining.com/">',
        );
      });
      it("nav de bandeiras com 4 links, aria-labels e ativo correto", () => {
        expect(html).toContain('class="locale-flags"');
        for (const href of ["/", "/en", "/es", "/zh-CN"]) {
          expect(html).toContain(`href="${href}"`);
        }
        expect(html).toContain(`aria-label="${loadDict(locale)["flags.navAria"]}"`);
        const active = html.match(/class="locale-flag is-active" href="([^"]+)"/);
        expect(active?.[1]).toBe(PREFIX[locale] || "/");
      });
      it("IDs essenciais preservados", () => {
        for (const id of ESSENTIAL_IDS) expect(html).toContain(`id="${id}"`);
      });
      it("sem tokens de template restantes", () => {
        expect(html).not.toMatch(/\{\{[^}]+\}\}/);
      });
    });
  }

  it("dicionários home-text.<locale>.js são dados puros carregáveis", async () => {
    for (const locale of LOCALES) {
      const mod = await import(`../public/home-text.${locale}.js`);
      expect(mod.DICT).toBeDefined();
      expect(typeof mod.DICT["meta.description"]).toBe("string");
      expect(JSON.stringify(mod.DICT)).not.toContain("{{");
    }
  });
});
