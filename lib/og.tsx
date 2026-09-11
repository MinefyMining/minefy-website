import { ImageResponse } from "next/og";
import type { Site } from "./site";

/**
 * Fábrica local de imagens OpenGraph 1200×630 (MIKE-REVISAO O3) — geração
 * via `next/og` (embutido no Next 16), 100% local: sem serviço externo,
 * sem segredo, sem custo. Cada rota tem um `opengraph-image.tsx` de ~10
 * linhas que chama isto com o título da página vindo do dicionário.
 * Composição tipográfica própria (wordmark + título + linha de assinatura)
 * na identidade de cada mundo — dourado Minefy / verde Agrofy.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const ACCENT: Record<Site, string> = { mineracao: "#D4A847", agro: "#16A34A" };
const TAGLINE: Record<Site, string> = {
  mineracao: "Telemetria industrial · IA corporativa · Agentes autônomos · Serviços de TI",
  agro: "Telemetria agrícola ActiSky · Gestão de frota no campo",
};
const HOST: Record<Site, string> = {
  mineracao: "www.minefymining.com",
  agro: "www.agrofymining.com",
};

export function ogImage({
  title,
  site = "mineracao",
}: {
  title: string;
  site?: Site;
}) {
  const accent = ACCENT[site];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            `radial-gradient(720px 420px at 18% 8%, ${accent}26, transparent 65%), ` +
            "radial-gradient(600px 400px at 92% 100%, #7FB4D815, transparent 60%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 44,
              backgroundColor: accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: 10,
              color: accent,
            }}
          >
            {site === "agro" ? "AGROFY" : "MINEFY"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 46 ? 58 : 68,
            fontWeight: 800,
            lineHeight: 1.12,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              height: 3,
              width: 1032,
              backgroundImage: `linear-gradient(90deg, ${accent}, ${accent}00)`,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: "#B5B5B5",
            }}
          >
            <div style={{ display: "flex", maxWidth: 780 }}>{TAGLINE[site]}</div>
            <div style={{ display: "flex", color: accent }}>{HOST[site]}</div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
