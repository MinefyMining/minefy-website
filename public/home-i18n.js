// SITE-I18N — loader runtime da home cinematográfica.
// Módulo estático minúsculo (seguro para Node): detecta o locale servido em
// <html lang> e importa DINAMICAMENTE só o dicionário daquele idioma — o
// grafo estático de abertura da home não carrega as ~25 kB de texto, e a
// mesma implementação JS atende os quatro idiomas (sem duplicação).
const SUPPORTED = ["en", "es", "zh-CN"];

export function detectLocale() {
  if (typeof document === "undefined" || !document.documentElement) return "pt-BR"; // Node/testes
  const lang = document.documentElement.lang;
  return SUPPORTED.includes(lang) ? lang : "pt-BR";
}

function resolveKey(dict, token) {
  if (dict == null) return undefined;
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

let cached = null;

/** Carrega (uma vez) o dicionário do locale da página e devolve t/tRaw/fmt. */
export async function loadI18n() {
  if (cached) return cached;
  const locale = detectLocale();
  const { DICT } = await import(`./home-text.${locale}.js?v=20261013-i18n`);
  const nf = new Intl.NumberFormat(locale);
  cached = {
    locale,
    t(key, vars) {
      let value = resolveKey(DICT, key);
      if (typeof value !== "string") return key;
      if (vars) for (const [k, val] of Object.entries(vars)) value = value.replaceAll("{" + k + "}", String(val));
      return value;
    },
    tRaw(key) {
      return resolveKey(DICT, key);
    },
    fmt(n, digits = 1) {
      return nf.format(Number(Number(n).toFixed(digits)));
    },
  };
  return cached;
}
