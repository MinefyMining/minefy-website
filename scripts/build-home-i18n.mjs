#!/usr/bin/env node
/**
 * SITE-I18N — gerador da home cinematográfica localizada.
 *
 * Lê `scripts/home-i18n/home.template.html` + `scripts/home-i18n/locales/<locale>.json`
 * e emite, por locale:
 *   - public/home.html            (pt-BR — referência)
 *   - public/home-<locale>.html   (en, es, zh-CN)
 *   - public/home-text.js         (dicionário runtime único para os módulos JS
 *                                  story/command/app/enhancements — sem duplicar
 *                                  quatro implementações JS)
 *
 * Tokens do template: `{{caminho.pontuado}}` (arrays por índice) + tokens
 * estruturais ({{LANG}}, {{CANONICAL}}, {{OG_LOCALE}}, {{HREFLANG}},
 * {{WA_TEXT}}, {{PREFIX}}, {{FLAG_CLASS_<locale>}}, {{FLAG_ARIA_<locale>}}).
 * Falha se sobrar token não resolvido — nunca gera HTML com buraco.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const I18N_DIR = join(ROOT, "scripts", "home-i18n");
const ORIGIN = "https://www.minefymining.com";
const OG_LOCALE = { "pt-BR": "pt_BR", en: "en_US", es: "es_ES", "zh-CN": "zh_CN" };
const PREFIX = { "pt-BR": "", en: "/en", es: "/es", "zh-CN": "/zh-CN" };

const template = readFileSync(join(I18N_DIR, "home.template.html"), "utf8");
const locales = readdirSync(join(I18N_DIR, "locales"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));
const dicts = Object.fromEntries(
  locales.map((l) => [l, JSON.parse(readFileSync(join(I18N_DIR, "locales", `${l}.json`), "utf8"))]),
);

/** Resolve "story.chapters.0.kicker" num dicionário com chaves planas+arrays. */
function resolve(dict, token) {
  if (token in dict) return dict[token];
  const parts = token.split(".");
  for (let i = parts.length - 1; i > 0; i--) {
    const head = parts.slice(0, i).join(".");
    if (head in dict) {
      let v = dict[head];
      for (let j = i; j < parts.length; j++) {
        const seg = parts[j];
        v = v?.[/^\d+$/.test(seg) ? Number(seg) : seg];
      }
      return v;
    }
  }
  return undefined;
}

function hreflangBlock() {
  const links = [
    ...locales.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${PREFIX[l] || "/"}">`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`,
  ];
  return links.join("\n  ");
}

function buildHtml(locale) {
  const dict = dicts[locale];
  const structural = {
    LANG: locale,
    CANONICAL: `${ORIGIN}${PREFIX[locale] || "/"}`,
    OG_LOCALE: OG_LOCALE[locale],
    HREFLANG: hreflangBlock(),
    WA_TEXT: encodeURIComponent(dict["contact.waText"]),
    PREFIX: PREFIX[locale],
  };
  const out = template.replace(/\{\{([^}]+)\}\}/g, (match, token) => {
    if (token.startsWith("FLAG_CLASS_")) {
      return token.slice(11) === locale ? " is-active" : "";
    }
    if (token.startsWith("FLAG_ARIA_")) {
      return token.slice(10) === locale ? ' aria-current="true"' : "";
    }
    if (token in structural) return structural[token];
    const value = resolve(dict, token);
    if (typeof value !== "string") {
      throw new Error(`Token não resolvido (${locale}): ${token}`);
    }
    return value;
  });
  const leftover = out.match(/\{\{[^}]+\}\}/g);
  if (leftover) throw new Error(`Tokens restantes (${locale}): ${leftover.join(", ")}`);
  return out;
}

function buildDictModule(locale) {
  return `// GERADO por scripts/build-home-i18n.mjs — não editar à mão.
// Dicionário da home cinematográfica (${locale}) — dados puros, seguro para
// importação em Node (testes) e carregado sob demanda por home-i18n.js.
export const DICT = ${JSON.stringify(dicts[locale], null, 1)};
`;
}

const outputs = { "pt-BR": "home.html", en: "home-en.html", es: "home-es.html", "zh-CN": "home-zh-CN.html" };
for (const [locale, file] of Object.entries(outputs)) {
  writeFileSync(join(ROOT, "public", file), buildHtml(locale));
  writeFileSync(join(ROOT, "public", `home-text.${locale}.js`), buildDictModule(locale));
  console.log(`✓ public/${file} + public/home-text.${locale}.js (${locale})`);
}
