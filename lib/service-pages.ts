import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ServicePageData } from "@/components/service-page";

export const SITE_URL = "https://www.minefymining.com";

/** The three new service fronts — single source for slugs, i18n namespaces
 * and the `?servico=` enum value each page's CTAs pre-select. */
export const SERVICE_PAGES = {
  "ia-corporativa": { namespace: "services.ia", interest: "ia-corporativa" },
  "agentes-autonomos": { namespace: "services.agentes", interest: "agentes-autonomos" },
  "servicos-ti": { namespace: "services.ti", interest: "servicos-ti" },
} as const;

export type ServiceSlug = keyof typeof SERVICE_PAGES;

export async function buildServiceMetadata(
  locale: string,
  slug: ServiceSlug,
): Promise<Metadata> {
  const { namespace } = SERVICE_PAGES[slug];
  const t = await getTranslations({ locale, namespace: `${namespace}.metadata` });
  const canonical = `${SITE_URL}/solucoes/${slug}`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical },
    openGraph: { title: t("title"), description: t("description"), url: canonical },
  };
}

export async function buildServiceData(slug: ServiceSlug): Promise<ServicePageData> {
  const { namespace, interest } = SERVICE_PAGES[slug];
  const t = await getTranslations(namespace);
  const tLabels = await getTranslations("services.labels");

  const hasExamples = t.has("examples");
  const hasScopeNote = t.has("scopeNote");
  const hasExamplesNote = t.has("examplesNote");

  return {
    badge: t("badge"),
    title: t("title"),
    benefit: t("benefit"),
    scope: t.raw("scope") as Array<{ title: string; text: string }>,
    scopeNote: hasScopeNote ? t("scopeNote") : undefined,
    examples: hasExamples ? (t.raw("examples") as string[]) : undefined,
    examplesNote: hasExamplesNote ? t("examplesNote") : undefined,
    deliverables: t.raw("deliverables") as string[],
    cta: t("cta"),
    contactInterest: interest,
    labels: {
      scope: tLabels("scope"),
      deliverables: tLabels("deliverables"),
      examples: tLabels("examples"),
      backToHub: tLabels("backToHub"),
    },
  };
}
