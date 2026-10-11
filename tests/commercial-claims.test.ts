/**
 * Commercial claims guard — P0R R1 (2026-10-11).
 *
 * Contrato editorial vigente: portfólio completo presente nominalmente,
 * cada pendência com estado factual na MESMA cláusula da capacidade, meta
 * -35% identificada como meta (nunca resultado), e guardas ainda válidas
 * contra afirmações sem evidência (universalidade de hardware, T10/T12,
 * latência numérica, compliance automático, 24/7 incondicional, migração
 * da meta para o case).
 *
 * Esta versão responde às revisões reais Mike (P0R-MIKE-01..04) e Faye
 * (P0R-FAYE-01..04): vínculo de cláusula (não de frase inteira nem de
 * produto vizinho), negativos causais nos três modos (sem qualificação,
 * concluída/universal, capacidade omitida), guardas de preservação dos
 * recursos existentes e distinção estados-de-freio ≠ temperatura.
 * Sem validador linguístico genérico: regex por capacidade, nas listas
 * certas.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

interface SolutionItem {
  id: string;
  badge: string;
  description: string;
  features?: string[];
  safetyFeatures?: string[];
  operationalFeatures?: string[];
  tiers?: Array<{ name: string; specs: string[] }>;
  metric: { value: string; label: string };
  image: string;
}

interface HomeMsg {
  products: { items: Array<{ description: string }> };
  faq: { items: Array<{ a: string }> };
  outcomes: { items: Array<{ text: string }> };
  howItWorks: { steps: Array<{ text: string }> };
}

interface Messages {
  home: HomeMsg;
  solutions: { items: SolutionItem[] };
  projects: unknown;
  about: unknown;
  corporateHome: unknown;
}

const ROOT = join(__dirname, "..");
const messages = JSON.parse(
  readFileSync(join(ROOT, "messages", "pt-BR.json"), "utf8"),
) as Messages;
const raw = messages as unknown as Record<string, unknown>;
const solutionsItems = messages.solutions.items;

interface Doc {
  items: Record<string, SolutionItem>;
  home: HomeMsg;
  projects: unknown;
}
const buildDoc = (m: Messages): Doc => ({
  items: Object.fromEntries(m.solutions.items.map((i) => [i.id, i])),
  home: m.home,
  projects: m.projects,
});
const doc = buildDoc(messages);
const cloneDoc = () => buildDoc(JSON.parse(JSON.stringify(messages)) as Messages);

/** Marcadores de estado pendente e de conclusão (escopo: copy comercial). */
const PENDING = /(em desenvolvimento|a desenvolver|\bpendentes?\b|planejada|a validar|a homologar)/i;
const DONE = /(conclu[ií]d|comprovad|em opera[cç][aã]o|garantid|toda a frota|todos os equipamentos)/i;

/** Divide em cláusulas por "." ou ";" — ":" não separa (estado: capacidade). */
const clauses = (s: string) => s.split(/[.;](?:\s|$)/);

/**
 * Capacidade(s) e estado pendente na MESMA cláusula; `extra` (quando dado)
 * também na mesma cláusula; nenhuma marca de conclusão na string inteira.
 */
function clauseOk(s: string | undefined, caps: RegExp[], extra?: RegExp): boolean {
  if (!s || DONE.test(s)) return false;
  return clauses(s).some(
    (c) => caps.every((rx) => rx.test(c)) && PENDING.test(c) && (!extra || extra.test(c)),
  );
}
/**
 * some + veto: exige um item qualificado E rejeita a lista se qualquer item
 * que mencione as mesmas capacidades as afirmar concluídas/universais
 * (um "em desenvolvimento" num item não libera o irmão contraditório).
 */
const anyOk = (list: string[] | undefined, caps: RegExp[], extra?: RegExp) =>
  !(list ?? []).some((s) => caps.some((rx) => rx.test(s)) && DONE.test(s)) &&
  (list ?? []).some((s) => clauseOk(s, caps, extra));

/** [path, string] de toda folha string — usado na guarda de escopo da meta. */
function leafEntries(node: unknown, path = ""): Array<[string, string]> {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => leafEntries(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
      leafEntries(v, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

/** Caminhos ordenados das folhas que citam 35% — a meta só pode viver no Fleet 360. */
function metaScopePaths(node: unknown): string[] {
  return leafEntries(node)
    .filter(([, s]) => /35\s?%/.test(s))
    .map(([p]) => p)
    .sort();
}

const META_PATHS_ESPERADOS = ["solutions.items[3].description", "solutions.items[3].metric.value"];

/**
 * Guarda contextual RTK/alta precisão (P0R-R1-FAYE-03): não é veto de palavra.
 * Toda folha dos escopos que mencione alta precisão/RTK precisa apresentá-la
 * como opção condicionada (opcional / dependente de módulo / a confirmar)
 * e não pode carregar marca de conclusão/universalidade. Retorna os caminhos
 * infratores; a lista vazia é o estado válido.
 */
const RTK_CAPS = /alta precisão|RTK/i;
const RTK_QUALIF = /opcional|dependente de módulo|a confirmar/i;
function rtkGuardViolations(node: unknown, scopes: readonly string[]): string[] {
  return scopes.flatMap((s) =>
    leafEntries((node as Record<string, unknown>)[s], s)
      .filter(([, txt]) => RTK_CAPS.test(txt) && (!RTK_QUALIF.test(txt) || DONE.test(txt)))
      .map(([p]) => p),
  );
}

/* ── Predicados P0R (catálogo + home), usados no dado real e nas fixtures ── */
const pred = {
  oleo: (d: Doc) =>
    anyOk(d.items["actisky"].safetyFeatures, [/pressão e temperatura do óleo/i], /validação do sinal/i),
  freioTermico: (d: Doc) =>
    anyOk(d.items["actisky"].safetyFeatures, [/temperatura de freios/i, /superaquecimento/i]),
  emissoes: (d: Doc) =>
    clauseOk(d.items["actisky"].description, [/monitoramento de emissões/i, /metodologia/i]),
  distribuicao: (d: Doc) =>
    anyOk(d.items["analytics"].features, [
      /distribuição automática programada/i,
      /diári/i,
      /semana/i,
      /mensa/i,
    ]),
  meta: (d: Doc) => {
    const f = d.items["fleet360"];
    if (!/^Meta:\s*-35%$/.test(f.metric.value)) return false;
    if (!/^Paradas não planejadas · a validar$/.test(f.metric.label)) return false;
    const semMeta = f.description.replace(/Meta:\s*-35%/g, "");
    if (/35\s?%/.test(semMeta)) return false;
    if (!/meta de desenvolvimento/i.test(f.description)) return false;
    if (!/sem estudo ou piloto/i.test(f.description)) return false;
    return !DONE.test(f.description);
  },
  preditiva: (d: Doc) => {
    const f = d.items["fleet360"];
    return (
      /preditiva/i.test(f.badge) &&
      /em desenvolvimento/i.test(f.badge) &&
      anyOk(f.features, [/manutenção preditiva/i]) &&
      anyOk(f.features, [/otimização de ciclos/i])
    );
  },
  proximidade: (d: Doc) => anyOk(d.items["safety"].features, [/proximidade entre equipamentos/i]),
  rtkOpcional: (d: Doc) =>
    (d.items["actisky"].operationalFeatures ?? []).some(
      (s) => /RTK|alta precisão/i.test(s) && /opcional|dependente/i.test(s) && !DONE.test(s),
    ),
  suporte247: (d: Doc) =>
    (d.items["consulting"].features ?? []).some(
      (s) => /24\/7/.test(s) && /a dimensionar|formalizar/i.test(s) && !/garantid|incondicional/i.test(s),
    ),
  // resumos home
  resumoOleo: (d: Doc) =>
    clauseOk(d.home.products.items[1].description, [/pressão e temperatura do óleo/i], /validação do sinal/i),
  resumoFreios: (d: Doc) =>
    clauseOk(d.home.products.items[1].description, [/temperatura de freios/i, /superaquecimento/i]),
  resumoDistribuicao: (d: Doc) =>
    clauseOk(d.home.products.items[2].description, [/distribuição automática programada/i]),
  resumoPreditiva: (d: Doc) => clauseOk(d.home.products.items[3].description, [/preditiva/i]),
  resumoProximidade: (d: Doc) =>
    clauseOk(d.home.products.items[4].description, [/proximidade entre equipamentos/i]),
  faqOleo: (d: Doc) =>
    clauseOk(d.home.faq.items[0].a, [/pressão e temperatura do óleo/i], /validação do sinal/i),
  outcomesPreditiva: (d: Doc) => clauseOk(d.home.outcomes.items[1].text, [/preditiva/i]),
  outcomesSafety: (d: Doc) => {
    const t = d.home.outcomes.items[2].text;
    return (
      clauseOk(t, [/proximidade entre equipamentos/i]) &&
      /fadiga[^.]*conforme instalação/i.test(t) &&
      /conforme configuração/i.test(t)
    );
  },
};

describe("P0R R1 — presença do portfólio com estado factual na mesma cláusula", () => {
  it("ActiSky: pressão e temperatura do óleo — em desenvolvimento, validação do sinal por equipamento", () => {
    expect(pred.oleo(doc)).toBe(true);
  });
  it("ActiSky: temperatura de freios E superaquecimento — a desenvolver/homologar (AND, não OR)", () => {
    expect(pred.freioTermico(doc)).toBe(true);
  });
  it("ActiSky: monitoramento de emissões — capacidade planejada, fonte e metodologia validadas", () => {
    expect(pred.emissoes(doc)).toBe(true);
  });
  it("ActiSky: RTK/alta precisão como configuração opcional e dependente, nunca universal", () => {
    expect(pred.rtkOpcional(doc)).toBe(true);
  });
  it("Analytics: distribuição automática programada diária/semanal/mensal — em desenvolvimento", () => {
    expect(pred.distribuicao(doc)).toBe(true);
  });
  it("Fleet 360: -35% é Meta, a validar, com ressalva no mesmo produto", () => {
    expect(pred.meta(doc)).toBe(true);
  });
  it("Fleet 360: preditiva e otimização presentes, ambas em desenvolvimento", () => {
    expect(pred.preditiva(doc)).toBe(true);
  });
  it("Safety: proximidade entre equipamentos com integração/homologação de campo pendentes", () => {
    expect(pred.proximidade(doc)).toBe(true);
  });
  it("Consultoria: 24/7 só como modalidade a dimensionar, nunca garantida", () => {
    expect(pred.suporte247(doc)).toBe(true);
  });
  it("Home: resumo ActiSky traz óleo E freios com pendência local (P0R-MIKE-01)", () => {
    expect(pred.resumoOleo(doc)).toBe(true);
    expect(pred.resumoFreios(doc)).toBe(true);
  });
  it("Home: resumos de distribuição, preditiva e proximidade com estado local", () => {
    expect(pred.resumoDistribuicao(doc)).toBe(true);
    expect(pred.resumoPreditiva(doc)).toBe(true);
    expect(pred.resumoProximidade(doc)).toBe(true);
  });
  it("Home FAQ: óleo com validação do sinal pendente", () => {
    expect(pred.faqOleo(doc)).toBe(true);
  });
  it("Home outcomes: preditiva em desenvolvimento e Safety com todas as qualificações (P0R-MIKE-04/FAYE-01)", () => {
    expect(pred.outcomesPreditiva(doc)).toBe(true);
    expect(pred.outcomesSafety(doc)).toBe(true);
  });
  it("Estados de freio preservados como informação distinta — nunca medida térmica", () => {
    const act = doc.items["actisky"];
    const textos = [...(act.safetyFeatures ?? []), ...clauses(act.description)];
    const estados = textos.filter((t) => /estados de freio/i.test(t));
    expect(estados.length).toBeGreaterThan(0);
    for (const t of estados) {
      if (/temperatura/i.test(t)) expect(t).toMatch(/não indicam temperatura/i);
    }
    const termica = (act.safetyFeatures ?? []).find((s) => /superaquecimento/i.test(s)) ?? "";
    expect(termica).not.toMatch(/estados de freio/i);
  });
});

describe("P0R R1 — guardas ainda válidas (P0R-MIKE-03 / FAYE-02)", () => {
  const SCOPES = ["home", "solutions", "projects", "about", "corporateHome"] as const;
  const scopeText = () => SCOPES.map((s) => JSON.stringify(raw[s])).join("\n");
  const STILL_FORBIDDEN: Array<[string, RegExp]> = [
    ["homologação universal de tablets", /todas homologadas/i],
    ["plug-and-play universal", /plug.?and.?play/i],
    ["latência numérica inventada", /milissegundos/i],
    ["generalização 'todos os equipamentos'", /todos os equipamentos/i],
    ["modelo sem evidência (T10/T12)", /Minefy T1[02]/],
    ["compliance como garantia de produto", /compliance NR-22/i],
    ["suporte 24/7 em campo incondicional", /24\/7 em campo/i],
    ["rótulo 'downtime' como métrica", /downtime/i],
  ];
  for (const [name, rx] of STILL_FORBIDDEN) {
    it(`não contém: ${name}`, () => {
      expect(scopeText()).not.toMatch(rx);
    });
  }
  it("-35% existe somente no Fleet 360, sempre como Meta", () => {
    expect(metaScopePaths(raw)).toEqual(META_PATHS_ESPERADOS);
  });
  it("RTK/alta precisão: capacidade legítima qualificada, nunca universal (guarda contextual)", () => {
    // Positivo: a forma nominal qualificada passa (não é veto de palavra).
    expect(
      rtkGuardViolations(
        { home: "Posição por GPS de alta precisão (RTK) como configuração opcional, dependente de módulo, instalação e ensaio" },
        ["home"],
      ),
    ).toEqual([]);
    // Positivo Q-2 (P0R-R2-MIKE-01 ≡ FAYE-01): "homologado" como condição da
    // fórmula do brief para opções de tablet não é marca de conclusão.
    expect(
      rtkGuardViolations({ home: "RTK opcional, a confirmar no modelo fornecido e homologado" }, ["home"]),
    ).toEqual([]);
    // O catálogo real não tem nenhuma folha infratora nos 5 escopos.
    expect(rtkGuardViolations(raw, SCOPES)).toEqual([]);
  });
  it("case Vargem Grande não recebe capacidades futuras", () => {
    expect(JSON.stringify(messages.projects)).not.toMatch(
      /óleo|freios|superaquecimento|preditiv|proximidade|emiss|distribuição automática|Meta:/i,
    );
  });
  it("ActiSky mantém a condição dos sinais (barramento/sensores/instalação/homologação)", () => {
    expect(doc.items["actisky"].description).toMatch(/dependem[^.]*homologação/i);
  });
  it("métrica de consultoria não é 24/7", () => {
    expect(doc.items["consulting"].metric.value).not.toMatch(/24\/7/);
  });
});

describe("P0R R1 — preservação dos recursos existentes", () => {
  it("ActiSky operacional: ciclos, velocidade/RPM, combustível com canal/unidade, horímetro, ociosidade", () => {
    const op = doc.items["actisky"].operationalFeatures ?? [];
    expect(op.some((s) => /ciclos de carga/i.test(s))).toBe(true);
    expect(op.some((s) => /velocidade e RPM/i.test(s))).toBe(true);
    expect(op.some((s) => /combustível/i.test(s) && /canal e unidade/i.test(s))).toBe(true);
    expect(op.some((s) => /horímetro/i.test(s))).toBe(true);
    expect(op.some((s) => /ociosidade/i.test(s))).toBe(true);
  });
  it("ActiSky segurança: motor/arrefecimento, caçamba, basculamento, geofencing", () => {
    const sf = doc.items["actisky"].safetyFeatures ?? [];
    expect(sf.some((s) => /motor e do sistema de arrefecimento/i.test(s))).toBe(true);
    expect(sf.some((s) => /caçamba alta em deslocamento/i.test(s))).toBe(true);
    expect(sf.some((s) => /basculamento/i.test(s))).toBe(true);
    expect(sf.some((s) => /zona de risco/i.test(s))).toBe(true);
  });
  it("Analytics: dashboards WebSocket, KPIs, anomalias, isolamento e RDO CSV/XLSX/PDF", () => {
    const f = doc.items["analytics"].features ?? [];
    expect(f.some((s) => /WebSocket/i.test(s))).toBe(true);
    expect(f.some((s) => /KPIs/i.test(s))).toBe(true);
    expect(f.some((s) => /anomalias/i.test(s))).toBe(true);
    expect(f.some((s) => /isolamento/i.test(s))).toBe(true);
    const rdo = f.find((s) => /RDO/i.test(s));
    expect(rdo).toBeDefined();
    expect(rdo).toMatch(/CSV/);
    expect(rdo).toMatch(/XLSX/);
    expect(rdo).toMatch(/PDF/);
  });
  it("Fleet 360: consumo, histórico, despacho e alertas preventivos por regras", () => {
    const f = doc.items["fleet360"].features ?? [];
    expect(f.some((s) => /consumo/i.test(s))).toBe(true);
    expect(f.some((s) => /histórico/i.test(s))).toBe(true);
    expect(f.some((s) => /despacho/i.test(s))).toBe(true);
    expect(f.some((s) => /manutenção preventiva por regras/i.test(s))).toBe(true);
  });
  it("Safety: ADAS/DMS conforme instalação, near-misses, dashboard e apoio NR-22/ANM", () => {
    const f = doc.items["safety"].features ?? [];
    expect(f.some((s) => /ADAS\/DMS/i.test(s) && /instalação/i.test(s))).toBe(true);
    expect(f.some((s) => /near-misses/i.test(s))).toBe(true);
    expect(f.some((s) => /dashboard de segurança/i.test(s))).toBe(true);
    expect(f.some((s) => /apoio aos procedimentos de segurança/i.test(s))).toBe(true);
    expect(f.every((s) => !/compliance|certificação/i.test(s))).toBe(true);
  });
  it("Tablets: berço, luva, MDM, alimentação veicular, CAN/seriais/câmeras, Android/Linux, RTK opcional", () => {
    const tiers = doc.items["tablets"].tiers ?? [];
    const specs = tiers.flatMap((t) => t.specs);
    expect(specs.some((s) => /berço/i.test(s))).toBe(true);
    expect(specs.some((s) => /luva/i.test(s))).toBe(true);
    expect(specs.some((s) => /MDM/i.test(s))).toBe(true);
    expect(specs.some((s) => /alimentação veicular/i.test(s))).toBe(true);
    expect(specs.some((s) => /CAN e seriais/i.test(s) && /câmeras/i.test(s))).toBe(true);
    expect(specs.some((s) => /Android\/Linux/i.test(s))).toBe(true);
    expect(specs.some((s) => /RTK opcional/i.test(s))).toBe(true);
  });
});

describe("P0R R1 — negativos causais (fixtures DEVEM falhar)", () => {
  // óleo
  it("óleo sem qualificação falha", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[1] = "Pressão e temperatura do óleo";
    expect(pred.oleo(bad)).toBe(false);
  });
  it("óleo com integração concluída/universal falha (FAYE-03.1)", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[1] =
      "Pressão e temperatura do óleo — integração em desenvolvimento concluída; validação do sinal realizada em toda a frota";
    expect(pred.oleo(bad)).toBe(false);
  });
  it("óleo omitido falha", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[1] = "Temperatura do motor";
    expect(pred.oleo(bad)).toBe(false);
  });
  // freio térmico
  it("freio com homologação concluída falha (P0R-QA-02)", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[2] =
      "Temperatura de freios e alertas de superaquecimento — homologação concluída por equipamento";
    expect(pred.freioTermico(bad)).toBe(false);
  });
  it("freio sem temperatura (só superaquecimento) falha (MIKE-02)", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[2] =
      "Alertas de superaquecimento — a desenvolver por equipamento";
    expect(pred.freioTermico(bad)).toBe(false);
  });
  it("freio sem qualificação falha", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[2] =
      "Temperatura de freios e alertas de superaquecimento";
    expect(pred.freioTermico(bad)).toBe(false);
  });
  it("freio 'independente do modelo' falha — 'independente' não é estado pendente (P0R-R1-FAYE-01)", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[2] =
      "Temperatura de freios e alertas de superaquecimento, independente do modelo";
    expect(pred.freioTermico(bad)).toBe(false);
  });
  // emissões
  it("emissões qualificadas por outra frase falham (FAYE-03.2)", () => {
    const bad = cloneDoc();
    bad.items["actisky"].description =
      "Monitoramento de emissões em tempo real, medido diretamente. Integração planejada com ERP.";
    expect(pred.emissoes(bad)).toBe(false);
  });
  it("emissões sem qualificação falham", () => {
    const bad = cloneDoc();
    bad.items["actisky"].description =
      "Monitoramento de emissões: dependente de fonte e metodologia validadas.";
    expect(pred.emissoes(bad)).toBe(false);
  });
  it("emissões concluídas falham", () => {
    const bad = cloneDoc();
    bad.items["actisky"].description =
      "Monitoramento de emissões: capacidade concluída, com fonte e metodologia validadas.";
    expect(pred.emissoes(bad)).toBe(false);
  });
  it("emissões omitidas falham", () => {
    const bad = cloneDoc();
    bad.items["actisky"].description =
      "Módulos IoT de telemetria CAN J1939. Os sinais dependem da instalação e da homologação por modelo.";
    expect(pred.emissoes(bad)).toBe(false);
  });
  // distribuição
  it("distribuição com qualificador pertencendo ao ERP falha (FAYE-03.3)", () => {
    const bad = cloneDoc();
    (bad.items["analytics"].features as string[])[5] =
      "Distribuição automática programada diária, semanal e mensal; integrações API/ERP em desenvolvimento";
    expect(pred.distribuicao(bad)).toBe(false);
  });
  it("distribuição sem estado falha", () => {
    const bad = cloneDoc();
    (bad.items["analytics"].features as string[])[5] =
      "Distribuição automática programada de relatórios (diária, semanal e mensal)";
    expect(pred.distribuicao(bad)).toBe(false);
  });
  it("distribuição concluída falha", () => {
    const bad = cloneDoc();
    (bad.items["analytics"].features as string[])[5] =
      "Distribuição automática programada de relatórios (diária, semanal e mensal) concluída e ativa";
    expect(pred.distribuicao(bad)).toBe(false);
  });
  it("distribuição com periodicidade omitida falha", () => {
    const bad = cloneDoc();
    (bad.items["analytics"].features as string[])[5] =
      "Em desenvolvimento: distribuição automática programada de relatórios";
    expect(pred.distribuicao(bad)).toBe(false);
  });
  it("distribuição 'independente do cliente' falha (P2-c)", () => {
    const bad = cloneDoc();
    (bad.items["analytics"].features as string[])[5] =
      "Distribuição automática programada diária, semanal e mensal, independente do cliente";
    expect(pred.distribuicao(bad)).toBe(false);
  });
  // meta
  it("-35% sem prefixo Meta falha", () => {
    const bad = cloneDoc();
    bad.items["fleet360"].metric.value = "-35%";
    expect(pred.meta(bad)).toBe(false);
  });
  it("resultado 35% acrescentado à descrição falha (FAYE-03.4)", () => {
    const bad = cloneDoc();
    bad.items["fleet360"].description += " Clientes já reduziram 35% das paradas.";
    expect(pred.meta(bad)).toBe(false);
  });
  it("label de resultado comprovado falha (FAYE-03.5)", () => {
    const bad = cloneDoc();
    bad.items["fleet360"].metric.label = "Redução comprovada em piloto, a validar em novos sites";
    expect(pred.meta(bad)).toBe(false);
  });
  it("meta sem a ressalva 'sem estudo ou piloto' falha", () => {
    const bad = cloneDoc();
    bad.items["fleet360"].description =
      "Gestão preditiva da frota pesada. Meta: -35% de paradas não planejadas.";
    expect(pred.meta(bad)).toBe(false);
  });
  // preditiva
  it("preditiva 'em operação' falha mesmo com outro item preditivo pendente (F03-6 fiel)", () => {
    const bad = cloneDoc();
    (bad.items["fleet360"].features as string[])[0] = "Manutenção preditiva por IA em operação";
    (bad.items["fleet360"].features as string[])[2] =
      "Manutenção preditiva — modelo em desenvolvimento contínuo";
    expect(pred.preditiva(bad)).toBe(false); // o pendente não libera o contraditório
  });
  it("preditiva sem qualificação falha", () => {
    const bad = cloneDoc();
    (bad.items["fleet360"].features as string[])[0] =
      "Monitoramento de condição por telemetria e manutenção preditiva";
    expect(pred.preditiva(bad)).toBe(false);
  });
  it("preditiva omitida falha", () => {
    const bad = cloneDoc();
    (bad.items["fleet360"].features as string[])[0] = "Monitoramento de condição por telemetria";
    expect(pred.preditiva(bad)).toBe(false);
  });
  // proximidade
  it("proximidade com homologação de campo concluída falha (P0R-QA-02)", () => {
    const bad = cloneDoc();
    (bad.items["safety"].features as string[])[1] =
      "Proximidade entre equipamentos — integração e homologação de campo concluídas";
    expect(pred.proximidade(bad)).toBe(false);
  });
  it("proximidade sem qualificação falha", () => {
    const bad = cloneDoc();
    (bad.items["safety"].features as string[])[1] = "Proximidade entre equipamentos";
    expect(pred.proximidade(bad)).toBe(false);
  });
  // itens contraditórios coexistentes na mesma lista (SOME)
  it("SOME: óleo pendente não libera óleo 'em operação em toda a frota' na mesma lista", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[4] =
      "Pressão e temperatura do óleo em operação em toda a frota";
    expect(pred.oleo(bad)).toBe(false);
  });
  it("SOME: proximidade pendente não libera irmão com homologação concluída", () => {
    const bad = cloneDoc();
    (bad.items["safety"].features as string[])[5] =
      "Proximidade entre equipamentos — homologação de campo concluída";
    expect(pred.proximidade(bad)).toBe(false);
  });
  it("SOME: freio pendente não libera irmão com homologação concluída", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].safetyFeatures as string[])[3] =
      "Caçamba alta em deslocamento e temperatura de freios — homologação concluída";
    expect(pred.freioTermico(bad)).toBe(false);
  });
  // RTK
  it("RTK universal 'em toda a frota' falha (FAYE-03.10)", () => {
    const bad = cloneDoc();
    (bad.items["actisky"].operationalFeatures as string[])[4] =
      "GPS de alta precisão RTK conforme padrão em toda a frota";
    expect(pred.rtkOpcional(bad)).toBe(false);
  });
  it("RTK universal com palavras em ordem diferente falha na guarda contextual (GPS-3)", () => {
    const bad = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;
    (bad["solutions"] as { items: Array<{ operationalFeatures?: string[] }> }).items[1]
      .operationalFeatures![4] = "Posição GPS RTK de alta precisão padrão em toda a frota";
    expect(rtkGuardViolations(bad, ["solutions"])).toEqual([
      "solutions.items[1].operationalFeatures[4]",
    ]);
  });
  // home / FAQ
  it("resumo home sem freios falha (P0R-QA-01)", () => {
    const bad = cloneDoc();
    bad.home.products.items[1].description =
      "Módulos IoT com CAN J1939. Pressão e temperatura do óleo: integração em desenvolvimento, ativada após validação do sinal por equipamento.";
    expect(pred.resumoFreios(bad)).toBe(false);
    expect(pred.resumoOleo(bad)).toBe(true); // óleo continua válido — o teste falha pelo freio
  });
  it("óleo da home qualificado pela frase de emissões falha (FAYE-03.11)", () => {
    const bad = cloneDoc();
    bad.home.products.items[1].description =
      "Pressão e temperatura do óleo integradas. Emissões em desenvolvimento.";
    expect(pred.resumoOleo(bad)).toBe(false);
  });
  it("FAQ com validação concluída em toda a frota falha (FAYE-03.12)", () => {
    const bad = cloneDoc();
    bad.home.faq.items[0].a =
      "Pressão e temperatura do óleo com validação do sinal concluída em toda a frota.";
    expect(pred.faqOleo(bad)).toBe(false);
  });
  it("outcome Safety sem ressalva de instalação/configuração falha (FAYE-01)", () => {
    const bad = cloneDoc();
    bad.home.outcomes.items[2].text =
      "Alertas de fadiga e distração, proximidade entre equipamentos — integração e homologação de campo pendentes — e zonas de risco apoiam a operação.";
    expect(pred.outcomesSafety(bad)).toBe(false);
  });
  // guardas — exercitam os helpers reais, não tautologias
  it("meta migrada para o case é apanhada pela guarda real de escopo", () => {
    const bad = JSON.parse(JSON.stringify(raw)) as {
      projects: { vargemGrande: { intro: string } };
    };
    bad.projects.vargemGrande.intro += " Redução de 35% nas paradas.";
    const paths = metaScopePaths(bad);
    expect(paths).not.toEqual(META_PATHS_ESPERADOS);
    expect(paths).toContain("projects.vargemGrande.intro");
    // e o dado real continua confinado ao Fleet 360
    expect(metaScopePaths(raw)).toEqual(META_PATHS_ESPERADOS);
  });
  // modos ausentes apontados na revisão R1 (FAYE-04)
  it("resumoDistribuicao sem estado falha", () => {
    const bad = cloneDoc();
    bad.home.products.items[2].description =
      "Dashboards operacionais em tempo real. Distribuição automática programada (diária, semanal e mensal).";
    expect(pred.resumoDistribuicao(bad)).toBe(false);
  });
  it("resumoPreditiva sem estado falha", () => {
    const bad = cloneDoc();
    bad.home.products.items[3].description =
      "Gestão de frota pesada com manutenção preditiva por IA.";
    expect(pred.resumoPreditiva(bad)).toBe(false);
  });
  it("resumoProximidade sem estado falha", () => {
    const bad = cloneDoc();
    bad.home.products.items[4].description =
      "Segurança operacional: monitoramento de fadiga e proximidade entre equipamentos.";
    expect(pred.resumoProximidade(bad)).toBe(false);
  });
  it("outcomesPreditiva sem 'em desenvolvimento' falha", () => {
    const bad = cloneDoc();
    bad.home.outcomes.items[1].text =
      "Temperatura e RPM monitorados disparam alertas: a manutenção preditiva do Fleet 360 antecipa a falha.";
    expect(pred.outcomesPreditiva(bad)).toBe(false);
  });
  it("suporte247 garantido/incondicional falha", () => {
    const bad = cloneDoc();
    (bad.items["consulting"].features as string[])[4] =
      "Suporte técnico 24/7 garantido em campo";
    expect(pred.suporte247(bad)).toBe(false);
  });
  it("suporte247 omitido falha", () => {
    const bad = cloneDoc();
    (bad.items["consulting"].features as string[])[4] =
      "Suporte técnico em campo, com cobertura e prazos definidos em contrato";
    expect(pred.suporte247(bad)).toBe(false);
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
    const byId = doc.items;
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
      expect(typeof item.metric.value).toBe("string");
      expect(typeof item.metric.label).toBe("string");
    }
  });
});
