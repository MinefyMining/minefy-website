import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import messages from "@/messages/pt-BR.json";

/** Imagem OpenGraph gerada localmente (next/og) — MIKE-REVISAO O3. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Agrofy — telemetria ActiSky para o agronegócio | Minefy';

export default function OpengraphImage() {
  return ogImage({
    title: messages.agrofy.metadata.title,
    site: 'agro',
  });
}
