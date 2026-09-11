import { setRequestLocale } from "next-intl/server";
import { ServicePage } from "@/components/service-page";
import { buildServiceData, buildServiceMetadata } from "@/lib/service-pages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildServiceMetadata(locale, "agentes-autonomos");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await buildServiceData("agentes-autonomos");
  return <ServicePage data={data} />;
}
