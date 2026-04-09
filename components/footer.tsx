"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";

const companyLinks = [
  { key: "about", href: "/quem-somos" },
  { key: "projects", href: "/projetos" },
  { key: "contact", href: "/contato" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const solutionLinks = t.raw("solutionLinks") as Array<{ label: string; href: string }>;

  return (
    <footer className="bg-[#111] border-t border-[#222]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/">
              <Image src="/images/logo-transparente.png" alt="Minefy" width={800} height={570} className="w-[100px] h-auto" />
            </Link>
            <p className="text-sm text-[#888] max-w-xs">{t("tagline")}</p>

            {/* Platform link in footer too */}
            <a
              href={t("platformUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#D4A847] hover:text-[#C49B3F] font-medium transition-colors"
            >
              Acessar Plataforma
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* Social */}
            <div className="flex items-center gap-4 pt-2">
              <a href={t("social.instagram")} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#666] hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" /></svg>
              </a>
              <a href={t("social.linkedin")} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#666] hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.84 20.452H3.834V9H6.84v11.452Z" /></svg>
              </a>
              <a href={t("social.whatsapp")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#666] hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.604-1.476A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.588-5.932-1.612l-.424-.252-2.723.874.87-2.635-.276-.44A9.793 9.793 0 0 1 2.182 12c0-5.414 4.404-9.818 9.818-9.818S21.818 6.586 21.818 12 17.414 21.818 12 21.818z" /></svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4A847] mb-4">{t("columns.solutions")}</h3>
            <ul className="space-y-2.5">
              {solutionLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#888] hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4A847] mb-4">{t("columns.company")}</h3>
            <ul className="space-y-2.5">
              {companyLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="text-sm text-[#888] hover:text-white transition-colors">{tNav(key)}</Link>
                </li>
              ))}
              <li>
                <a href={t("platformUrl")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#888] hover:text-white transition-colors">
                  Plataforma
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4A847] mb-4">{t("columns.contact")}</h3>
            <ul className="space-y-2.5">
              <li><a href={`mailto:${t("email")}`} className="text-sm text-[#888] hover:text-white transition-colors">{t("email")}</a></li>
              <li><a href={`tel:${t("phone")}`} className="text-sm text-[#888] hover:text-white transition-colors">{t("phone")}</a></li>
              <li><span className="text-sm text-[#888]">Nova Lima, MG</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#222]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-xs text-[#666]">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
