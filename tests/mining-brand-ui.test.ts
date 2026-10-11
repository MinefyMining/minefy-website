/**
 * Identidade e abertura das páginas institucionais Minefy (WEBSITE-QA-20261011, Entrega B).
 *  1. Header, menu móvel e rodapé do mundo mineração usam a wordmark aprovada
 *     (`MiningBrand`), nunca o emblema circular antigo.
 *  2. O layout `(mineracao)` não monta a abertura bloqueante (`LogoIntro`);
 *     o componente compartilhado e o layout Agrofy ficam intactos.
 *  3. Os dois assets de marca são WebP com alpha, mesma proporção 1520×320,
 *     e a versão clara não contém branco (MINE grafite) enquanto a escura
 *     não contém grafite (MINE branco) — contraste garantido nos dois temas.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");
const RETIRED_EMBLEM = "/images/logo-transparente.png";

/** Cabeçalho VP8L (WebP sem perdas): largura, altura e bit de alpha. */
function webpInfo(file: string) {
  const bytes = readFileSync(join(ROOT, file));
  expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
  expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
  expect(bytes.subarray(12, 16).toString("ascii")).toBe("VP8L");
  expect(bytes[20]).toBe(0x2f);
  const bits = bytes.readUInt32LE(21);
  return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, alpha: ((bits >> 28) & 1) === 1 };
}

describe("MiningBrand — assets", () => {
  const brand = read("components/mining-brand.tsx");
  const onDark = brand.match(/MINING_BRAND_ON_DARK = "\/([^"]+)"/)![1];
  const onLight = brand.match(/MINING_BRAND_ON_LIGHT = "\/([^"]+)"/)![1];

  it("a versão escura é a wordmark aprovada da home e a clara vive em assets/brand/", () => {
    expect(onDark).toBe("assets/optimized/brand-wordmark.0446c18db9.webp");
    expect(onLight).toBe("assets/brand/minefy-wordmark-on-light.webp");
    expect(read("public/home.html")).toContain(`src="${onDark}"`);
  });

  it("ambas são WebP sem perdas com alpha e a mesma moldura 1520×320", () => {
    for (const file of [onDark, onLight]) {
      const info = webpInfo(join("public", file));
      expect(info, file).toEqual({ width: 1520, height: 320, alpha: true });
    }
  });

  it("os bytes diferem (recolorização) e a clara pesa no máximo o que pesa a escura", () => {
    const dark = readFileSync(join(ROOT, "public", onDark)), light = readFileSync(join(ROOT, "public", onLight));
    expect(light.equals(dark)).toBe(false);
    expect(light.length).toBeLessThanOrEqual(dark.length + 2048);
  });
});

describe("MiningBrand — uso no mundo mineração", () => {
  const files = ["components/mining-header.tsx", "components/mining-footer.tsx"];

  it("header, menu móvel e rodapé usam MiningBrand e não o emblema antigo", () => {
    for (const file of files) {
      const source = read(file);
      expect(source, file).toContain('from "@/components/mining-brand"');
      expect(source, file).not.toContain(RETIRED_EMBLEM);
      expect(source, file).not.toMatch(/from "next\/image"/);
    }
    expect((read("components/mining-header.tsx").match(/<MiningBrand/g) ?? []).length).toBe(2);
    expect((read("components/mining-footer.tsx").match(/<MiningBrand/g) ?? []).length).toBe(1);
  });

  it("o topo transparente é forçado escuro até rolar; rolado, menu e rodapé seguem o tema", () => {
    expect(read("components/mining-header.tsx")).toContain('surface={scrolled ? "theme" : "header"}');
    expect(read("components/mining-footer.tsx")).toContain('surface="theme"');
  });

  it("a troca por tema é feita em CSS (sem estado de hidratação) e a imagem oculta é lazy", () => {
    const brand = read("components/mining-brand.tsx");
    expect(brand).toContain("[.light_&]:hidden");
    expect(brand).toContain("[.light_&]:block");
    expect(brand).toContain("[.light_body:has([data-hero-surface=theme])_&]:hidden");
    expect(brand).toContain('loading="lazy"');
    expect(brand).not.toMatch(/useState|useEffect|useIsLight/);
    // A regra `.header-logo` de globals.css escurece o logo antigo no tema claro; a wordmark não a usa.
    expect(brand).not.toContain("header-logo");
  });
});

describe("abertura institucional — sem overlay bloqueante no mundo mineração", () => {
  it("o layout (mineracao) não importa nem monta LogoIntro", () => {
    const layout = read("app/[locale]/(mineracao)/layout.tsx");
    expect(layout).not.toMatch(/from "@\/components\/logo-intro"/);
    expect(layout).not.toContain("<LogoIntro");
    expect(layout).toContain("<MiningHeader />");
    expect(layout).toContain("<MiningFooter year={year} />");
  });

  it("o componente compartilhado e o layout Agrofy continuam como estavam", () => {
    const agro = read("app/[locale]/(agrofy)/layout.tsx");
    expect(agro).toContain('<LogoIntro\n        variant="green"');
    expect(agro).toContain('sessionKey="agrofy-intro"');
    const intro = read("components/logo-intro.tsx");
    expect(intro).toContain("blocking = true");
    expect(intro).toContain("document.body.style.overflow = \"hidden\"");
  });
});
