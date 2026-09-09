import { describe, expect, it } from "vitest";
import { mapPathnameForSite } from "@/lib/site-routing";

/**
 * Contrato de rotas/domínios do split mineração × Agrofy (proxy.ts).
 * Regressão aqui = página pública mudando de lugar ou mundo vazando
 * pro domínio errado.
 */
describe("mapPathnameForSite — mundo mineração (minefymining.com)", () => {
  it("reescreve apenas a home para o arquivo interno /mineracao", () => {
    expect(mapPathnameForSite("mineracao", "/")).toBe("/mineracao");
  });

  it.each([
    "/solucoes",
    "/solucoes/ia-corporativa",
    "/solucoes/agentes-autonomos",
    "/solucoes/servicos-ti",
    "/experiencias",
    "/quem-somos",
    "/projetos",
    "/contato",
    "/privacidade",
  ])("preserva o path público %s sem reescrita", (path) => {
    expect(mapPathnameForSite("mineracao", path)).toBe(path);
  });

  it("bloqueia o mundo Agrofy no domínio de mineração (isolamento)", () => {
    expect(mapPathnameForSite("mineracao", "/agrofy")).toBe(
      "/mineracao-cross-world-blocked",
    );
    expect(mapPathnameForSite("mineracao", "/agrofy/solucoes")).toBe(
      "/mineracao-cross-world-blocked",
    );
  });
});

describe("mapPathnameForSite — mundo Agrofy (agrofymining.com)", () => {
  it("mapeia a home para /agrofy", () => {
    expect(mapPathnameForSite("agro", "/")).toBe("/agrofy");
  });

  it("prefixa paths externos com /agrofy (URL externa permanece limpa)", () => {
    expect(mapPathnameForSite("agro", "/solucoes")).toBe("/agrofy/solucoes");
    expect(mapPathnameForSite("agro", "/contato")).toBe("/agrofy/contato");
    expect(mapPathnameForSite("agro", "/piloto")).toBe("/agrofy/piloto");
  });

  it("não duplica o prefixo quando o path interno já vem prefixado", () => {
    expect(mapPathnameForSite("agro", "/agrofy/solucoes")).toBe("/agrofy/solucoes");
  });

  it("404 simétrico: rota exclusiva de mineração no domínio agro", () => {
    // /mineracao vira /agrofy/mineracao, que não existe → 404
    expect(mapPathnameForSite("agro", "/mineracao")).toBe("/agrofy/mineracao");
    // as novas páginas de serviço também não existem no mundo agro
    expect(mapPathnameForSite("agro", "/solucoes/ia-corporativa")).toBe(
      "/agrofy/solucoes/ia-corporativa",
    );
  });
});
