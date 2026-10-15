/**
 * SITE-I18N — roteamento de locales (núcleo puro, sem middleware runtime).
 *
 * Cobre os helpers de lib/site.ts que o proxy compõe com o next-intl:
 *  - staticHomeFor: homes localizadas por prefixo exato (/en, /es, /zh-CN),
 *    com e sem barra final, só no mundo Minefy (Agrofy PT-only);
 *  - stripLocalePrefix: separação do prefixo para o redirecionamento agro;
 *  - localizedCanonicalFor: canonical por versão (PT sem prefixo);
 *  - comportamento preservado de mapPathnameForSite (isolamento de mundos).
 */
import { describe, expect, it } from "vitest";
import {
  localizedCanonicalFor,
  mapPathnameForSite,
  staticHomeFor,
  stripLocalePrefix,
} from "../lib/site";

describe("staticHomeFor — homes localizadas", () => {
  it("/ serve a home PT no mundo Minefy", () => {
    expect(staticHomeFor("mineracao", "/")).toBe("/home.html");
  });
  it("/en, /es e /zh-CN servem as homes localizadas no mundo Minefy", () => {
    expect(staticHomeFor("mineracao", "/en")).toBe("/home-en.html");
    expect(staticHomeFor("mineracao", "/es")).toBe("/home-es.html");
    expect(staticHomeFor("mineracao", "/zh-CN")).toBe("/home-zh-CN.html");
  });
  it("aceita barra final no prefixo", () => {
    expect(staticHomeFor("mineracao", "/en/")).toBe("/home-en.html");
  });
  it("Agrofy não tem home localizada (PT-only)", () => {
    expect(staticHomeFor("agro", "/en")).toBeNull();
    expect(staticHomeFor("agro", "/")).toBeNull();
  });
  it("subrotas com prefixo NÃO viram home estática (seguem para o next-intl)", () => {
    expect(staticHomeFor("mineracao", "/en/solucoes")).toBeNull();
    expect(staticHomeFor("mineracao", "/mineracao")).toBeNull();
  });
});

describe("stripLocalePrefix", () => {
  it("separa prefixo de rota simples e composta", () => {
    expect(stripLocalePrefix("/en")).toEqual({ locale: "en", path: "/" });
    expect(stripLocalePrefix("/es/solucoes")).toEqual({ locale: "es", path: "/solucoes" });
    expect(stripLocalePrefix("/zh-CN/contato?x=1".split("?")[0])).toEqual({ locale: "zh-CN", path: "/contato" });
  });
  it("sem prefixo retorna locale null e o path intacto", () => {
    expect(stripLocalePrefix("/solucoes")).toEqual({ locale: null, path: "/solucoes" });
    expect(stripLocalePrefix("/")).toEqual({ locale: null, path: "/" });
  });
  it("não confunde segmento parecido com locale (/energy)", () => {
    expect(stripLocalePrefix("/energy")).toEqual({ locale: null, path: "/energy" });
  });
});

describe("localizedCanonicalFor", () => {
  it("PT sem prefixo; demais com prefixo estável", () => {
    expect(localizedCanonicalFor("mineracao", "/", "pt-BR")).toBe("https://www.minefymining.com/");
    expect(localizedCanonicalFor("mineracao", "/", "en")).toBe("https://www.minefymining.com/en");
    expect(localizedCanonicalFor("mineracao", "/solucoes", "es")).toBe(
      "https://www.minefymining.com/es/solucoes",
    );
    expect(localizedCanonicalFor("mineracao", "/contato", "zh-CN")).toBe(
      "https://www.minefymining.com/zh-CN/contato",
    );
  });
});

describe("mapPathnameForSite — comportamento preservado", () => {
  it("isolamento de mundos mantido", () => {
    expect(mapPathnameForSite("mineracao", "/agrofy")).toBe("/mineracao-cross-world-blocked");
    expect(mapPathnameForSite("agro", "/solucoes")).toBe("/agrofy/solucoes");
    expect(mapPathnameForSite("agro", "/agrofy")).toBe("/agrofy");
    expect(mapPathnameForSite("mineracao", "/")).toBe("/mineracao");
  });
});
