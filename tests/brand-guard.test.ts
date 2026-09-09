/**
 * Brand guard — mecaniza três regras invioláveis (MIKE-ARQUITETURA 2.4/4.4/4.5):
 * 1. "ActiSky, nunca GalileoSky" em material público.
 * 2. Nunca citar fornecedor/fabricante de componente (regra CEO 2026-07-17),
 *    inclusive em NOMES DE ARQUIVO públicos (URL também é material público).
 * 3. Vocabulário de garantia absoluta em copy pública exige revisão por
 *    escrito — allowlist explícita e comentada abaixo.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");
const FORBIDDEN = /galileosky|atlas.?copco|hardhat|roboflex|samsung/i;

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

describe("marcas proibidas (fornecedores + GalileoSky)", () => {
  it("conteúdo de messages/, components/ e app/ está limpo", () => {
    const files = [
      ...walkFiles(join(ROOT, "messages")),
      ...walkFiles(join(ROOT, "components")),
      ...walkFiles(join(ROOT, "app")),
    ].filter((f) => /\.(json|tsx?|css|mdx?)$/.test(f));
    const hits: string[] = [];
    for (const f of files) {
      const content = readFileSync(f, "utf8");
      const m = content.match(FORBIDDEN);
      if (m) hits.push(`${relative(ROOT, f)} → "${m[0]}"`);
    }
    expect(hits).toEqual([]);
  });

  it("NOMES de arquivo em public/ estão limpos (URL é material público)", () => {
    const hits = walkFiles(join(ROOT, "public"))
      .map((f) => relative(ROOT, f))
      .filter((f) => FORBIDDEN.test(f));
    expect(hits).toEqual([]);
  });
});

describe("vocabulário de garantia absoluta em copy pública (messages/)", () => {
  const ABSOLUTE =
    /\b(100%|zero|nunca|sempre|garantid\w*|infal[ií]v\w*|à prova de falhas|nada se perde|sem perdas)\b/i;

  /**
   * Allowlist EXPLÍCITA — cada entrada foi lida e tem justificativa.
   * Novo hit fora desta lista = alguém precisa justificar por escrito
   * (a redação substituta é da Jessica/CMO; a trava é do CTO).
   */
  const ALLOWLIST: Array<{ path: string; reason: string }> = [
    // Claims de histórico ESCALADOS (pendência CMO/CLO registrada no
    // ALEX-ENTREGA.md — decisão 4.2 do Mike: Alex não altera por conta):
    { path: "home.stats.items[2].value", reason: "'Zero' incidentes — claim público escalado a CMO/CLO" },
    { path: "projects.vargemGrande.metrics[3].value", reason: "'Zero' — métrica de projeto, escalada junto" },
    // Usos NÃO-promessa (negação ou qualidade contratável):
    { path: "services.agentes.examplesNote", reason: "'infalíveis' aparece NEGADO ('não toma decisões infalíveis')" },
    { path: "agrofyAbout.values.items[3].text", reason: "'nunca com promessa' — anti-promessa" },
    // Copy pré-existente com promessa branda sobre o PRÓPRIO produto —
    // registrada para revisão da CMO, não bloqueia (não é claim de terceiro):
    { path: "home.products.items[0].description", reason: "'sempre integrada à plataforma' — integração própria" },
    { path: "home.products.items[6].description", reason: "'sempre em plena condição' — condição de frota locada, revisar com CMO" },
    { path: "solutions.items[0].description", reason: "'vem garantida' — integração própria, revisar com CMO" },
    { path: "solutions.items[6].features[2]", reason: "'zero-quilômetro'/'sempre' — jargão automotivo + condição de frota" },
    { path: "agrofy.solutionsTeaser.items[0].description", reason: "'sempre integrada' — espelho agro do item acima" },
    { path: "agrofySolutions.items[0].description", reason: "'vem garantida' — espelho agro" },
  ];

  it("nenhum hit fora da allowlist comentada", () => {
    const messages = JSON.parse(
      readFileSync(join(ROOT, "messages", "pt-BR.json"), "utf8"),
    );
    const allowed = new Set(ALLOWLIST.map((a) => a.path));
    const violations: string[] = [];
    const walk = (o: unknown, path: string) => {
      if (typeof o === "string") {
        const m = o.match(ABSOLUTE);
        if (m && !allowed.has(path)) violations.push(`${path} → "${m[0]}" em "${o.slice(0, 70)}…"`);
      } else if (Array.isArray(o)) {
        o.forEach((v, i) => walk(v, `${path}[${i}]`));
      } else if (o && typeof o === "object") {
        for (const [k, v] of Object.entries(o)) walk(v, path ? `${path}.${k}` : k);
      }
    };
    walk(messages, "");
    expect(violations).toEqual([]);
  });
});
