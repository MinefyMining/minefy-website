/**
 * Commercial claims guard — P0 auditoria de promessas do site (2026-10-10).
 *
 * Mecaniza o contrato do brief P0-BRIEF-KIMI: nas subárvores Minefy de
 * messages/pt-BR.json (home, solutions, projects, about, corporateHome)
 * nenhuma afirmação comercial pode ir além da capacidade comprovada:
 *
 *  - métricas de resultado sem estudo identificável (ex.: -35% downtime);
 *  - homologação/plug-and-play universal de hardware;
 *  - sinais CAN garantidos em toda máquina (óleo, superaquecimento de freios,
 *    emissões) ou precisão/latência universal (GPS alta precisão, ms);
 *  - manutenção preditiva como produto pronto (a evolução preditiva por IA
 *    está em desenvolvimento e deve ser rotulada como tal);
 *  - compliance regulatório como garantia de produto (NR-22/ANM);
 *  - suporte 24/7 em campo incondicional;
 *  - distribuição automática programada de relatórios como recurso pronto.
 *
 * Também trava as qualificações positivas exigidas (RDO CSV/XLSX/PDF
 * comprovado preservado e delimitado) e a estabilidade do catálogo
 * (ids, âncoras e contagens consumidas pelos componentes).
 *
 * Não replica strings da implementação: testa o contrato semântico da
 * oferta (o que não pode ser prometido e o que precisa estar qualificado),
 * não a redação exata de cada item.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const messages = JSON.parse(
  readFileSync(join(ROOT, "messages", "pt-BR.json"), "utf8"),
) as Record<string, unknown>;

/** Subárvores Minefy auditadas no P0 (Agrofy e demais chaves ficam de fora). */
const SCOPES = ["home", "solutions", "projects", "about", "corporateHome"];

function scopeText(): string {
  return SCOPES.map((s) => JSON.stringify(messages[s])).join("\n");
}

/** Toda string folha de um nó, para varreduras recursivas. */
function leafStrings(node: unknown): string[] {
  if (typeof node === "string") return [node];
  if (Array.isArray(node)) return node.flatMap(leafStrings);
  if (node && typeof node === "object") {
    return Object.values(node as Record<string, unknown>).flatMap(leafStrings);
  }
  return [];
}

const solutionsItems = (messages["solutions"] as { items: Array<Record<string, unknown>> })
  .items;
const byId = Object.fromEntries(solutionsItems.map((i) => [i.id as string, i]));

describe("afirmações comerciais proibidas (P0)", () => {
  const FORBIDDEN: Array<{ name: string; pattern: RegExp }> = [
    { name: "métrica de downtime sem estudo (-35%)", pattern: /-35%/ },
    { name: "rótulo 'Downtime' como métrica", pattern: /downtime/i },
    { name: "homologação universal de tablets", pattern: /todas homologadas/i },
    { name: "plug-and-play universal", pattern: /plug.?and.?play/i },
    { name: "latência em milissegundos sem medida", pattern: /milissegundos/i },
    { name: "pressão de óleo como sinal comprovado", pattern: /pressão de óleo/i },
    { name: "superaquecimento de freios como sinal comprovado", pattern: /superaquecimento de freios/i },
    { name: "monitoramento de emissões sem medição", pattern: /monitoramento de emissões/i },
    { name: "GPS de alta precisão universal", pattern: /GPS de alta precisão/i },
    { name: "preditiva como produto pronto (badge/título)", pattern: /GESTÃO PREDITIVA|manutenção preditiva/i },
    { name: "compliance regulatório como garantia de produto", pattern: /compliance NR-22/i },
    { name: "suporte 24/7 em campo incondicional", pattern: /24\/7 em campo/i },
    { name: "generalização 'todos os equipamentos'", pattern: /todos os equipamentos/i },
    { name: "modelo de hardware não evidenciado (T10/T12)", pattern: /Minefy T10|Minefy T12/ },
    { name: "relatórios automáticos programados como prontos", pattern: /Relatórios automáticos \(diário\/semanal\/mensal\)/ },
  ];

  for (const { name, pattern } of FORBIDDEN) {
    it(`não contém: ${name}`, () => {
      expect(scopeText()).not.toMatch(pattern);
    });
  }
});

describe("qualificações obrigatórias preservadas (P0)", () => {
  it("Fleet 360 substitui métrica de downtime por condição da frota", () => {
    const metric = byId["fleet360"].metric as { value: string; label: string };
    expect(metric.value).not.toMatch(/%/);
    expect(metric.label).toMatch(/condição da frota/i);
  });

  it("Fleet 360 declara evolução preditiva por IA em desenvolvimento", () => {
    const leaves = leafStrings(byId["fleet360"]);
    expect(leaves.some((s) => /preditiv/i.test(s) && /em desenvolvimento/i.test(s))).toBe(true);
  });

  it("Analytics preserva exportação comprovada do RDO em CSV, XLSX e PDF", () => {
    const features = byId["analytics"].features as string[];
    const rdo = features.find((f) => /RDO/i.test(f));
    expect(rdo).toBeDefined();
    expect(rdo).toMatch(/CSV/);
    expect(rdo).toMatch(/XLSX/);
    expect(rdo).toMatch(/PDF/);
  });

  it("Analytics trata distribuição programada/ERP como evolução sob projeto", () => {
    const features = byId["analytics"].features as string[];
    expect(features.some((f) => /sob projeto/i.test(f))).toBe(true);
  });

  it("Safety substitui garantia de compliance por apoio aos procedimentos", () => {
    const features = byId["safety"].features as string[];
    expect(features.some((f) => /apoio aos procedimentos de segurança/i.test(f))).toBe(true);
    expect(features.every((f) => !/compliance/i.test(f))).toBe(true);
  });

  it("ActiSky condiciona sinais a barramento, sensores, instalação e homologação", () => {
    const description = byId["actisky"].description as string;
    expect(description).toMatch(/dependem/i);
    expect(description).toMatch(/homologação/i);
  });

  it("Consultoria não promete suporte 24/7", () => {
    const metric = byId["consulting"].metric as { value: string; label: string };
    expect(metric.value).not.toMatch(/24\/7/);
    const features = byId["consulting"].features as string[];
    expect(features.some((f) => /definidos? em contrato/i.test(f))).toBe(true);
  });
});

describe("estabilidade do catálogo (schema consumido pelos componentes)", () => {
  it("mantém os mesmos ids/âncoras de produtos", () => {
    expect(solutionsItems.map((i) => i.id)).toEqual([
      "tablets",
      "actisky",
      "analytics",
      "fleet360",
      "safety",
      "consulting",
      "caminhonetes",
      "compressores",
    ]);
  });

  it("mantém contagens de listas renderizadas", () => {
    expect((byId["tablets"].tiers as unknown[]).length).toBe(3);
    expect((byId["actisky"].safetyFeatures as unknown[]).length).toBe(5);
    expect((byId["actisky"].operationalFeatures as unknown[]).length).toBe(6);
    for (const id of ["analytics", "fleet360", "safety", "consulting", "caminhonetes", "compressores"]) {
      expect((byId[id].features as unknown[]).length).toBe(6);
    }
  });

  it("todo item mantém imagem e métrica value/label", () => {
    for (const item of solutionsItems) {
      expect(typeof item.image).toBe("string");
      const metric = item.metric as { value: unknown; label: unknown };
      expect(typeof metric.value).toBe("string");
      expect(typeof metric.label).toBe("string");
    }
  });
});
