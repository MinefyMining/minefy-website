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
// MIKE-REVISAO O2: inclui designação de linha (XAS+n) e fabricantes de
// componente (motores) — identificar o fornecedor por modelo é o mesmo
// vazamento que citá-lo por nome.
const FORBIDDEN = /galileosky|atlas.?copco|hardhat|roboflex|samsung|kubota|\bmwm\b|\bxas[\s-]?\d/i;

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
      ...walkFiles(join(ROOT, "lib")),
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
  /**
   * SEM ALLOWLIST — decisão da rodada 2026-09-09: a rodada anterior mantinha
   * uma allowlist que apenas documentava os claims sem prova; a copy foi
   * reescrita de forma conservadora e agora QUALQUER hit falha o gate.
   * Claim novo com vocabulário absoluto (ou promessa de gratuidade, ou
   * ranking "#1") exige justificativa por escrito + revisão CMO/CLO ANTES
   * de entrar no dicionário — não depois.
   */
  const ABSOLUTE =
    /\b(100%|zero|nunca|sempre|garantid\w*|infal[ií]v\w*|à prova de falhas|nada se perde|sem perdas|gratuit\w*|previn\w*|impede\w*|antes que aconte\w*)\b/i;
  const RANKING = /(^|[\s(>«"'])#1\b/;

  it("nenhum vocabulário absoluto, promessa de gratuidade ou ranking em messages/", () => {
    const messages = JSON.parse(
      readFileSync(join(ROOT, "messages", "pt-BR.json"), "utf8"),
    );
    const violations: string[] = [];
    const walk = (o: unknown, path: string) => {
      if (typeof o === "string") {
        const m = o.match(ABSOLUTE) ?? o.match(RANKING);
        if (m) violations.push(`${path} → "${m[0]}" em "${o.slice(0, 70)}…"`);
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

describe("card #compressores usa fotografia real AUTORIZADA (direção de arte CEO 2026-09-09)", () => {
  /**
   * A trava anterior (MIKE-REVISAO B2) forçava SVG para impedir foto de
   * catálogo com marca de fornecedor. Por ordem do CEO (2026-09-09) o card
   * volta a FOTOGRAFIA REAL TRATADA — regra técnica errada não supera o
   * pedido do CEO. O guard de MARCAS segue integral: o FORBIDDEN acima
   * continua varrendo conteúdo E nomes de arquivo público. O que muda é a
   * mecânica: em vez de proibir binário por extensão, aceita-se SOMENTE o
   * conjunto autorizado em public/images/premium/ — assets com proveniência
   * registrada em shared/website-evolution-2026-09-09/referencias/
   * PREMIUM-PROVENIENCIA.md (interno, fora do repo). Asset novo ali exige
   * registrar proveniência e estender esta lista conscientemente.
   */
  const AUTHORIZED_PREMIUM = [
    "agent-portrait.jpg",
    "compressor-studio.jpg",
    "scroller-cinematic.jpg",
  ];

  it("a imagem do card é a fotografia tratada autorizada", () => {
    const messages = JSON.parse(
      readFileSync(join(ROOT, "messages", "pt-BR.json"), "utf8"),
    );
    const item = (messages.solutions.items as Array<{ id: string; image: string }>).find(
      (i) => i.id === "compressores",
    );
    expect(item).toBeDefined();
    expect(item!.image).toBe("/images/premium/compressor-studio.jpg");
  });

  it("qualquer mídia de compressor em public/ é a autorizada — foto de catálogo avulsa segue proibida", () => {
    const offenders = walkFiles(join(ROOT, "public"))
      .map((f) => relative(ROOT, f))
      .filter((f) => /compressor/i.test(f))
      .filter((f) => f !== "public/images/premium/compressor-studio.jpg");
    expect(offenders).toEqual([]);
  });

  it("public/images/premium/ contém SOMENTE os assets autorizados desta rodada", () => {
    const files = readdirSync(join(ROOT, "public", "images", "premium")).sort();
    expect(files).toEqual([...AUTHORIZED_PREMIUM].sort());
  });
});
