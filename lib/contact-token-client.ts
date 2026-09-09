/**
 * Metade CLIENT-SAFE do nonce de contato (sem `node:crypto`) — importável
 * pelo `ContactForm`. A fonte única da janela mínima/máxima vive aqui;
 * `lib/contact-token.ts` (servidor) importa daqui para nunca divergir.
 */

/** Idade mínima do token para a API aceitar (heurística anti-bot). */
export const CONTACT_TOKEN_MIN_AGE_MS = 3_000;
/** Idade máxima — depois disso a API re-exige um token novo. */
export const CONTACT_TOKEN_MAX_AGE_MS = 30 * 60_000;

/**
 * Lê o `issuedAt` (ms epoch) do token sem validar assinatura — uso
 * exclusivo no cliente, para saber quanto falta para a idade mínima e
 * esperar de forma transparente em vez de tomar 400. `null` se malformado.
 */
export function tokenIssuedAt(token: string): number | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  try {
    const b64 = token.slice(0, dot).replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(b64);
    if (!/^\d{10,16}$/.test(decoded)) return null;
    return Number(decoded);
  } catch {
    return null;
  }
}
