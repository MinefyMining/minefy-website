import { describe, expect, it } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { mapPathnameForSite } from "@/lib/site";
import messages from "@/messages/pt-BR.json";

const APP = join(__dirname, "..", "app", "[locale]");

/** Coleta os paths EXTERNOS (URL pública) das páginas de um route group. */
function pageRoutes(group: string, stripPrefix = ""): string[] {
  const base = join(APP, group);
  const routes: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full, `${rel}/${entry}`);
      } else if (entry === "page.tsx") {
        routes.push(rel === "" ? "/" : rel);
      }
    }
  };
  walk(base, "");
  return routes
    .map((r) => (stripPrefix && r.startsWith(stripPrefix) ? r.slice(stripPrefix.length) || "/" : r))
    .sort();
}

describe("inventário de rotas (MIKE-ARQUITETURA 2.4)", () => {
  it("nenhuma página de (mineracao) vive num path com 'agrofy', e toda página de (agrofy) vive sob /agrofy", () => {
    const mineracao = pageRoutes("(mineracao)");
    for (const r of mineracao) expect(r).not.toMatch(/agrofy/);

    const agroRaw: string[] = [];
    const base = join(APP, "(agrofy)");
    const walk = (dir: string, rel: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full, `${rel}/${entry}`);
        else if (entry === "page.tsx") agroRaw.push(rel === "" ? "/" : rel);
      }
    };
    walk(base, "");
    for (const r of agroRaw) expect(r.startsWith("/agrofy")).toBe(true);
  });

  it("TODA rota do mundo mineração está na tabela esperada E é 404 no domínio agro — rota nova sem entrada aqui QUEBRA este teste (é a trava)", () => {
    // A home externa é "/" (o arquivo é /mineracao, alvo do rewrite).
    const fsRoutes = pageRoutes("(mineracao)")
      .map((r) => (r === "/mineracao" ? "/" : r))
      .sort();
    const EXPECTED = [
      "/",
      "/contato",
      "/experiencias",
      "/privacidade",
      "/projetos",
      "/quem-somos",
      "/solucoes",
      "/solucoes/agentes-autonomos",
      "/solucoes/scroller",
      "/solucoes/ia-corporativa",
      "/solucoes/servicos-ti",
    ].sort();
    expect(fsRoutes).toEqual(EXPECTED);

    for (const route of EXPECTED) {
      // No domínio agro, cada rota de mineração vira /agrofy/<rota>, que não
      // tem página → 404 automático. Vazamento entre mundos impossível.
      const mapped = mapPathnameForSite("agro", route);
      expect(mapped.startsWith("/agrofy")).toBe(true);
    }
  });

  it("trava de âncora: os 8 ids do catálogo industrial de /solucoes são imutáveis", () => {
    const ids = (messages.solutions.items as Array<{ id: string }>).map((i) => i.id);
    expect(ids).toEqual([
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
});
