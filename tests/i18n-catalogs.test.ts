/**
 * SITE-I18N — guardas dos catálogos de mensagens (messages/*.json).
 *
 * Garante, para os quatro idiomas (pt-BR, en, es, zh-CN):
 *  - paridade ESTRUTURAL completa de chaves com pt-BR (objetos e arrays),
 *    sem chave faltante, extra ou vazia — nenhum fallback silencioso em PT;
 *  - placeholders ICU ({var}) preservados exatamente em cada folha;
 *  - marcas/identificadores preservados (Minefy, ActiSky, Fleet 360);
 *  - subárvores Agro* INTACTAS em PT (Agrofy não é traduzido neste pacote);
 *  - nenhum fornecedor/fabricante em nenhum catálogo (regra de marca CEO).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const LOCALES = ["en", "es", "zh-CN"] as const;
const load = (l: string) =>
  JSON.parse(readFileSync(join(ROOT, "messages", `${l}.json`), "utf8")) as Record<string, unknown>;

const pt = load("pt-BR");

type Leaf = [string, unknown];
function flat(node: unknown, path = "", out: Leaf[] = []): Leaf[] {
  if (Array.isArray(node)) {
    node.forEach((v, i) => flat(v, `${path}[${i}]`, out));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      flat(v, path ? `${path}.${k}` : k, out);
    }
  } else {
    out.push([path, node]);
  }
  return out;
}
const ptLeaves = flat(pt);

const FORBIDDEN = /galileosky|atlas.?copco|hardhat|roboflex|samsung|kubota|\bmwm\b|\bxas[\s-]?\d/i;

describe("SITE-I18N — catálogos de mensagens", () => {
  for (const locale of LOCALES) {
    describe(locale, () => {
      const dict = load(locale);
      const leaves = flat(dict);
      const byPath = new Map(leaves);

      it("paridade total de chaves (objetos e arrays)", () => {
        const missing = ptLeaves.filter(([p]) => !byPath.has(p)).map(([p]) => p);
        const extra = leaves.filter(([p]) => !new Map(ptLeaves).has(p)).map(([p]) => p);
        expect(missing).toEqual([]);
        expect(extra).toEqual([]);
      });

      it("nenhuma folha de texto vazia que seja preenchida em pt-BR", () => {
        const ptMap = new Map(ptLeaves);
        const empty = leaves
          .filter(([p, v]) => typeof v === "string" && !v.trim() && typeof ptMap.get(p) === "string" && (ptMap.get(p) as string).trim() !== "")
          // zh-CN: titleB de aiIntro é intencionalmente vazio (o título
          // chinês se escreve em duas linhas, não três — ver componente).
          .filter(([p]) => !(locale === "zh-CN" && p === "chrome.aiIntro.titleB"));
        expect(empty).toEqual([]);
      });

      it("placeholders ICU preservados folha a folha", () => {
        const bad: string[] = [];
        for (const [p, v] of ptLeaves) {
          if (typeof v !== "string") continue;
          const other = byPath.get(p);
          if (typeof other !== "string") continue;
          const a = (v.match(/\{[a-zA-Z]+\}/g) ?? []).sort();
          const b = (other.match(/\{[a-zA-Z]+\}/g) ?? []).sort();
          if (a.join() !== b.join()) bad.push(p);
        }
        expect(bad).toEqual([]);
      });

      it("marcas preservadas no texto", () => {
        const text = JSON.stringify(dict);
        expect(text).toContain("Minefy");
        expect(text).toContain("ActiSky");
        expect(text).toContain("Fleet 360");
      });

      it("subárvores Agro* permanecem em PT (iguais ao pt-BR)", () => {
        for (const ns of ["agrofy", "agroNav", "agroFooter"]) {
          expect(JSON.stringify(dict[ns])).toBe(JSON.stringify(pt[ns]));
        }
      });

      it("nenhum fornecedor/fabricante no catálogo", () => {
        expect(JSON.stringify(dict)).not.toMatch(FORBIDDEN);
      });
    });
  }

  it("namespace chrome existe nos quatro idiomas com as mesmas subárvores", () => {
    for (const locale of ["pt-BR", ...LOCALES]) {
      const dict = load(locale);
      const chrome = dict["chrome"] as Record<string, unknown>;
      expect(chrome).toBeDefined();
      expect(Object.keys(chrome).sort()).toEqual(["agentFlow", "aiIntro", "experienceLab"]);
    }
  });
});
