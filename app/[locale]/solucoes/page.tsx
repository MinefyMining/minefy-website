import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "solutions.metadata",
  });
  return { title: t("title"), description: t("description") };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    image: string;
    features?: string[];
    safetyFeatures?: string[];
    operationalFeatures?: string[];
    benefits?: string[];
  }>;

  return (
    <>
      {/* Heading */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{t("hero.title")}</h1>
      </section>

      {/* Solutions */}
      {items.map((item, i) => (
        <section
          key={i}
          className={`py-16 px-4 ${i % 2 === 1 ? "bg-muted" : ""}`}
        >
          <div
            className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            {/* Image */}
            <div className="relative aspect-video rounded-[1.875rem] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>

              {item.features && (
                <ul className="space-y-2">
                  {item.features.map((f, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span> {f}
                    </li>
                  ))}
                </ul>
              )}

              {item.safetyFeatures && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider">
                    Segurança
                  </h4>
                  <ul className="space-y-1">
                    {item.safetyFeatures.map((f, j) => (
                      <li
                        key={j}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.operationalFeatures && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider">
                    Operacional
                  </h4>
                  <ul className="space-y-1">
                    {item.operationalFeatures.map((f, j) => (
                      <li
                        key={j}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.benefits && (
                <ul className="space-y-2">
                  {item.benefits.map((b, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t("cta.text")}
          </p>
          <Link
            href="/contato"
            className="inline-block rounded-[1.25rem] bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
