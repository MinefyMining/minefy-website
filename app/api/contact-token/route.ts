import { NextResponse } from "next/server";
import { issueContactToken } from "@/lib/contact-token";

/**
 * Emissão do nonce HMAC do formulário de contato (MIKE-ARQUITETURA 5.3).
 *
 * Por que uma rota dedicada em vez de emitir na página: `/contato` renderiza
 * sob ISR (`revalidate = 86400` no layout do grupo) — um token emitido no
 * render ficaria congelado no cache por até 24h e estouraria a janela de
 * 30min do nonce, bloqueando lead legítimo com formulário "quebrado".
 * O cliente busca o token AQUI no mount (e re-busca quando a API responder
 * `invalid_token`), então a idade do token ≈ tempo real do visitante na
 * página — exatamente o sinal anti-bot que o nonce quer medir.
 *
 * Sem CONTACT_TOKEN_SECRET configurada, devolve `token: null` e a API de
 * contato segue em fail-open (pendência registrada; nunca ler/ecoar o valor
 * do secret — PM-30).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { token: issueContactToken() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
