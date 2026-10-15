import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // SITE-I18N (CEO 2026-10-13): respeitar o idioma EXPLÍCITO da URL e a
  // escolha guardada do visitante — nunca redirecionar pelo Accept-Language
  // do navegador. O cookie NEXT_LOCALE do next-intl continua persistindo a
  // escolha feita pelo seletor.
  localeDetection: false,
});
