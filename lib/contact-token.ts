import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Nonce HMAC stateless para o formulário de contato (MIKE-ARQUITETURA 5.3):
 * a rota dedicada `/api/contact-token` emite (a página é ISR — token no render congelaria no cache além da janela de 30min) `t = base64url(issuedAt) +
 * "." + HMAC_SHA256(issuedAt, CONTACT_TOKEN_SECRET)`; a API valida a
 * assinatura e a janela `3s < now - issuedAt < 30min`. Sem estado, sem
 * banco, sem vendor. Enquanto a env var não existir na Vercel, tudo opera
 * em fail-open (não bloquear lead legítimo por config faltando) — a
 * pendência está registrada no ALEX-ENTREGA.md.
 */

import {
  CONTACT_TOKEN_MIN_AGE_MS as MIN_AGE_MS,
  CONTACT_TOKEN_MAX_AGE_MS as MAX_AGE_MS,
} from "./contact-token-client";

function secret(): string | null {
  return process.env.CONTACT_TOKEN_SECRET || null;
}

function sign(issuedAt: string, key: string): string {
  return createHmac("sha256", key).update(issuedAt).digest("hex");
}

/** Emite o token; `null` quando a env var não está configurada. */
export function issueContactToken(now: number = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const issuedAt = String(now);
  return `${Buffer.from(issuedAt).toString("base64url")}.${sign(issuedAt, key)}`;
}

export type TokenVerdict = "valid" | "invalid" | "unconfigured";

export function verifyContactToken(
  token: string | undefined,
  now: number = Date.now(),
): TokenVerdict {
  const key = secret();
  if (!key) return "unconfigured";
  if (!token) return "invalid";
  const dot = token.indexOf(".");
  if (dot <= 0) return "invalid";
  let issuedAt: string;
  try {
    issuedAt = Buffer.from(token.slice(0, dot), "base64url").toString("utf8");
  } catch {
    return "invalid";
  }
  if (!/^\d{10,16}$/.test(issuedAt)) return "invalid";
  const expected = sign(issuedAt, key);
  const given = token.slice(dot + 1);
  if (given.length !== expected.length) return "invalid";
  try {
    if (!timingSafeEqual(Buffer.from(given, "utf8"), Buffer.from(expected, "utf8"))) {
      return "invalid";
    }
  } catch {
    return "invalid";
  }
  const age = now - Number(issuedAt);
  if (age < MIN_AGE_MS || age > MAX_AGE_MS) return "invalid";
  return "valid";
}
