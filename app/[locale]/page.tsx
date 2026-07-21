import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SectorChooser } from "@/components/sector-chooser";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chooser.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * The site's entry screen — a full-bleed, chrome-free sector picker (replaces
 * the old logo preloader). Deliberately outside the `(site)` route group, so
 * it renders with no Header/Footer. Choosing a side navigates to `/mineracao`
 * or `/agrofy`; from there the user stays inside that sector — nothing links
 * back to `/`. Reloading `/` always shows this screen again.
 */
export default async function ChooserPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SectorChooser />;
}
