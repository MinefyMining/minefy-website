/**
 * Metade CLIENT-SAFE do nonce de contato (sem `node:crypto`) — importável
 * pelo `ContactForm`. A fonte única da janela mínima/máxima vive aqui;
 * `lib/contact-token.ts` (servidor) importa daqui para nunca divergir.
 */

/**
 * Idade mínima do token para a API aceitar. Reduzida de 3s para 1s na
 * revisão do CTO (MIKE-REVISAO B1b): com o token emitido sob demanda (no
 * primeiro foco do formulário), um piso de 3s passaria a ser alcançável por
 * autofill/gerenciador de senhas — e piso de tempo não detém bot (bot
 * espera de graça). 1s mantém o corte contra o POST cru instantâneo sem
 * jamais atrapalhar humano. Decisão registrada no ALEX-ENTREGA.md.
 */
export const CONTACT_TOKEN_MIN_AGE_MS = 1_000;
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

/** Margem somada à idade mínima na espera do cliente (cobre skew pequeno
 * entre instâncias serverless do emissor/validador). */
export const CONTACT_TOKEN_WAIT_MARGIN_MS = 300;

/**
 * Quanto o CLIENTE ainda deve esperar antes do POST, dado o tempo
 * MONOTÔNICO LOCAL decorrido desde o recebimento do token
 * (`performance.now()` de agora − o de quando o token chegou).
 *
 * Função pura e deliberadamente cega para `Date.now()`: relógio de parede
 * do cliente (atrasado ou adiantado quanto for) NÃO entra na conta — só o
 * tempo decorrido nesta aba. Resultado sempre no intervalo
 * [0, MIN_AGE + margem]; nenhum caminho produz espera ilimitada.
 */
export function minAgeWaitMs(elapsedMonoMs: number): number {
  const cap = CONTACT_TOKEN_MIN_AGE_MS + CONTACT_TOKEN_WAIT_MARGIN_MS;
  if (!Number.isFinite(elapsedMonoMs)) return cap;
  return Math.min(Math.max(0, cap - elapsedMonoMs), cap);
}
