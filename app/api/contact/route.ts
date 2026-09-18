import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "node:crypto";
import { contactSchema, type Servico } from "@/lib/contact-schema";
import { verifyContactToken } from "@/lib/contact-token";
import { resolveSiteFromHost } from "@/lib/site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// `noreply@` aqui é CORRETO e fica: transacional Resend do site (aviso do
// site para nós mesmos), não comunicação de persona — MIKE-ARQUITETURA 5.8.
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Minefy Website <noreply@minefymining.com>";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@minefymining.com";

/** Guard de tamanho ANTES do parse (anti-abuso 5.3 — Content-Length pode
 * faltar ou mentir, então o corpo lido é a medida que vale). */
const MAX_BODY_BYTES = 16_384;

/** Rótulos PT-BR do serviço/interesse para o e-mail interno de notificação. */
const SERVICE_LABELS: Record<Servico, string> = {
  "mineracao-telemetria": "Operação industrial e telemetria",
  "ia-corporativa": "IA corporativa",
  "agentes-autonomos": "Agentes autônomos",
  "servicos-ti": "Serviços de TI",
  "agro-telemetria": "Telemetria agrícola",
  outro: "Outro assunto",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  // Id de correlação para logs SEM PII — nunca logar nome/e-mail/telefone/corpo.
  const correlationId = randomUUID().slice(0, 8);
  try {
    // ── Guard de tamanho antes de qualquer parse ──
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Payload too large" },
        { status: 413 },
      );
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Payload too large" },
        { status: 413 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, message: "Validation error" },
        { status: 400 },
      );
    }

    // ── Honeypot ANTES do parse: preenchido ⇒ bot. Mesma resposta de
    // sucesso (nada revelado), nenhum e-mail enviado. ──
    if (
      typeof body === "object" &&
      body !== null &&
      typeof (body as Record<string, unknown>).hp === "string" &&
      ((body as Record<string, unknown>).hp as string).trim() !== ""
    ) {
      return NextResponse.json({ success: true, message: "Email sent" });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // ── Nonce HMAC stateless (5.3): valida quando o secret existe; sem a
    // env var configurada opera em fail-open COM log (não bloquear lead
    // legítimo por config faltando — pendência registrada). ──
    const tokenVerdict = verifyContactToken(data.t);
    if (tokenVerdict === "invalid") {
      // 409 + code distinto do 400 de schema (MIKE-REVISAO B1b): o cliente
      // re-emite o token via /api/contact-token e reenvia UMA vez sem tocar
      // nos campos digitados (aba esquecida/bfcache não pode custar o
      // lead). Não revela nada que a rota pública de emissão já não
      // entregue — bot também renova, e é por isso que isto é speed bump,
      // não rate limit.
      return NextResponse.json(
        { success: false, code: "token_stale", message: "Token expired" },
        { status: 409 },
      );
    }
    if (tokenVerdict === "unconfigured") {
      console.warn(
        `contact_token_unconfigured cid=${correlationId} — CONTACT_TOKEN_SECRET ausente; operando em fail-open`,
      );
    }

    // ── Divisão é DERIVADA do Host — o valor do corpo é ignorado (um POST
    // forjado não consegue rotular lead no mundo errado). ──
    const site = resolveSiteFromHost(request.headers.get("host"));
    const division = site === "agro" ? "agrofy" : "mineracao";

    if (!resend) {
      console.error(
        `lead_delivery_failed cid=${correlationId} reason=unconfigured servico=${data.servico} division=${division}`,
      );
      return NextResponse.json(
        { success: false, message: "Email service not configured" },
        { status: 503 },
      );
    }

    const divisionLabel = division === "agrofy" ? "Agrofy" : "Mineração";
    const serviceLabel = SERVICE_LABELS[data.servico];
    const subjectTag = `${divisionLabel} · ${serviceLabel}`;

    const { data: sendResult, error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `[Website · ${subjectTag}] ${escapeHtml(data.subject)}`,
      html: `
        <h2>Nova mensagem do site — ${escapeHtml(subjectTag)}</h2>
        <p><strong>Divisão:</strong> ${divisionLabel}</p>
        <p><strong>Serviço / interesse:</strong> ${escapeHtml(serviceLabel)}</p>
        <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
        ${data.empresa ? `<p><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</p>` : ""}
        <p><strong>Telefone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Mensagem:</strong> ${escapeHtml(data.message || "N/A")}</p>
      `,
    });

    if (sendError) {
      console.error(
        `lead_delivery_failed cid=${correlationId} reason=provider servico=${data.servico} division=${division}`,
      );
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 502 },
      );
    }

    console.log(
      `contact_sent cid=${correlationId} servico=${data.servico} division=${division} resend_id=${sendResult?.id ?? "unknown"}`,
    );
    return NextResponse.json({ success: true, message: "Email sent" });
  } catch {
    console.error(`lead_delivery_failed cid=${correlationId} reason=exception`);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 },
    );
  }
}
