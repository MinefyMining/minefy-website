export const locales = ["pt-BR", "en", "es", "zh-CN"] as const;
export const defaultLocale = "pt-BR" as const;

export type Locale = (typeof locales)[number];

/** Prefixo público de cada locale (PT sem prefixo; demais estáveis). */
export const localePrefix: Record<Locale, string> = {
  "pt-BR": "",
  en: "/en",
  es: "/es",
  "zh-CN": "/zh-CN",
};

/** Locales que NÃO são o padrão — usado para detectar prefixo na URL. */
export const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);
