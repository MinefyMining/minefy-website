import type { Site } from "./site";
import messages from "@/messages/pt-BR.json";

/**
 * WHITELIST das imagens OG servidas por `/api/og/[slug]` (MIKE-REVISAO
 * F1/F2): slug → título + mundo. Módulo separado da rota para ser
 * importável pelos testes (`tests/og-image.test.ts`) sem carregar
 * `next/og`. Nenhum texto de request entra na imagem — o slug apenas
 * seleciona uma entrada daqui.
 */
export const OG_PAGES: Record<string, { title: string; site: Site }> = {
  home: { title: messages.corporateHome.metadata.title, site: "mineracao" },
  solucoes: { title: messages.services.hub.metadata.title, site: "mineracao" },
  "solucoes-scroller": { title: messages.services.scroller.metadata.title, site: "mineracao" },
  "solucoes-ia-corporativa": { title: messages.services.ia.metadata.title, site: "mineracao" },
  "solucoes-agentes-autonomos": { title: messages.services.agentes.metadata.title, site: "mineracao" },
  "solucoes-servicos-ti": { title: messages.services.ti.metadata.title, site: "mineracao" },
  experiencias: { title: messages.experiences.metadata.title, site: "mineracao" },
  contato: { title: messages.contact.metadata.title, site: "mineracao" },
  "quem-somos": { title: messages.about.metadata.title, site: "mineracao" },
  projetos: { title: messages.projects.metadata.title, site: "mineracao" },
  privacidade: { title: messages.privacy.metadata.title, site: "mineracao" },
  "agro-home": { title: messages.agrofy.metadata.title, site: "agro" },
  "agro-solucoes": { title: messages.agrofySolutions.metadata.title, site: "agro" },
  "agro-quem-somos": { title: messages.agrofyAbout.metadata.title, site: "agro" },
  "agro-piloto": { title: messages.agrofyPilot.metadata.title, site: "agro" },
  "agro-contato": { title: messages.agrofy.contactPage.metadata.title, site: "agro" },
};
