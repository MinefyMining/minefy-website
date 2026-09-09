import { describe, expect, it } from "vitest";
import { contactSchema, isContactService, CONTACT_SERVICES } from "@/lib/contact-schema";

const valid = {
  name: "Maria Silva",
  phone: "+55 31 99999-0000",
  email: "maria@example.com",
  subject: "Quero conversar sobre IA",
};

describe("contactSchema", () => {
  it("aceita o payload mínimo válido (empresa, mensagem e serviço opcionais)", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("aceita payload completo com serviço do enum, empresa e divisão", () => {
    const r = contactSchema.safeParse({
      ...valid,
      company: "Empresa Exemplo S.A.",
      message: "Contexto do projeto",
      service: "ia-corporativa",
      division: "mineracao",
      website: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    expect(contactSchema.safeParse({ ...valid, email: "não-é-email" }).success).toBe(false);
  });

  it("rejeita serviço fora do enum (campo separado da divisão)", () => {
    expect(
      contactSchema.safeParse({ ...valid, service: "blockchain-quantico" }).success,
    ).toBe(false);
  });

  it("rejeita divisão fora do enum", () => {
    expect(contactSchema.safeParse({ ...valid, division: "espacial" }).success).toBe(false);
  });

  it("aplica limites de tamanho", () => {
    expect(contactSchema.safeParse({ ...valid, name: "a".repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: "a".repeat(161) }).success).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, message: "a".repeat(4001) }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, company: "a".repeat(161) }).success,
    ).toBe(false);
  });

  it("exige os campos obrigatórios", () => {
    expect(contactSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: "" }).success).toBe(false);
  });
});

describe("isContactService (pré-seleção via ?interesse=)", () => {
  it("aceita todos os slugs do enum", () => {
    for (const s of CONTACT_SERVICES) expect(isContactService(s)).toBe(true);
  });
  it("rejeita valores desconhecidos e null", () => {
    expect(isContactService("qualquer-coisa")).toBe(false);
    expect(isContactService(null)).toBe(false);
  });
});
