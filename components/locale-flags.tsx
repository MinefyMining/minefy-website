"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * SITE-I18N (CEO 2026-10-13): seletor de idioma por QUATRO BANDEIRAS
 * pequenas no canto superior direito — pedido direto: "coloque bandeiras
 * pequenas no canto superior direito para o cliente navegar entre os
 * idiomas" e "não precisa colocar o nome do idioma". Sem nomes visíveis e
 * sem tooltip textual; apenas aria-label para leitores de tela, destaque
 * inequívoco do idioma ativo e foco visível. SVGs locais inline — sem
 * emoji, sem download externo. Ao trocar, preserva página, query e âncora.
 */

const FLAGS = [
  { locale: "pt-BR", label: "Português (Brasil)", svg: <FlagBR /> },
  { locale: "en", label: "English (United States)", svg: <FlagUS /> },
  { locale: "es", label: "Español (España)", svg: <FlagES /> },
  { locale: "zh-CN", label: "简体中文（中国）", svg: <FlagCN /> },
] as const;

function FlagBR() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="2" fill="#009c3b" />
      <path d="M10 2.4 17.4 7 10 11.6 2.6 7Z" fill="#ffdf00" />
      <circle cx="10" cy="7" r="2.5" fill="#002776" />
      <path d="M7.7 6.4a2.6 2.6 0 0 1 4.7 1.3" fill="none" stroke="#fff" strokeWidth=".5" />
    </svg>
  );
}
function FlagUS() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="2" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#b22234" />
      ))}
      <rect width="9" height="6" rx="1" fill="#3c3b6e" />
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={1.5 + i * 1.3} cy="1.4" r=".45" fill="#fff" />
      ))}
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={1.5 + i * 1.3} cy="3" r=".45" fill="#fff" />
      ))}
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={1.5 + i * 1.3} cy="4.6" r=".45" fill="#fff" />
      ))}
    </svg>
  );
}
function FlagES() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="2" fill="#aa151b" />
      <rect y="3.5" width="20" height="7" fill="#f1bf00" />
    </svg>
  );
}
function FlagCN() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="2" fill="#de2910" />
      <path d="M3.4 2.2l.62 1.9h2l-1.62 1.18.62 1.9-1.62-1.17-1.62 1.17.62-1.9-1.62-1.18h2Z" fill="#ffde00" />
      <circle cx="7.4" cy="2.2" r=".7" fill="#ffde00" />
      <circle cx="8.6" cy="4" r=".7" fill="#ffde00" />
      <circle cx="8.6" cy="6.2" r=".7" fill="#ffde00" />
      <circle cx="7.4" cy="8" r=".7" fill="#ffde00" />
    </svg>
  );
}

export function LocaleFlags({ className = "" }: { className?: string }) {
  const active = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  // A âncora (#) não chega ao servidor: o componente está sob Suspense com
  // CSR bailout (renderiza só no cliente), então o hash é lido direto do
  // window no primeiro render — preservando página + query + âncora (brief).
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  return (
    <nav aria-label={t("localeNav")} className={`flex items-center gap-0.5 sm:gap-1 ${className}`}>
      {FLAGS.map(({ locale, label, svg }) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={`${pathname}${query ? `?${query}` : ""}${hash}`}
            locale={locale}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            className={`inline-flex min-h-[28px] min-w-[28px] items-center justify-center rounded-md p-1 sm:min-h-[36px] sm:min-w-[36px] sm:p-1.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847] ${
              isActive
                ? "ring-2 ring-[#D4A847] ring-offset-1 ring-offset-transparent scale-105"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            {svg}
          </Link>
        );
      })}
    </nav>
  );
}
