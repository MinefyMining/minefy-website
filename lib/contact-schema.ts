import { z } from "zod";

/** Serviço/interesse do lead — dimensão própria, SEPARADA da divisão
 * (mineração × Agrofy). Os CTAs das páginas de serviço pré-selecionam o
 * valor via `?interesse=<slug>`; o hub e a home deixam a escolha livre. */
export const CONTACT_SERVICES = [
  "mineracao-telemetria",
  "ia-corporativa",
  "agentes-autonomos",
  "servicos-ti",
  "outro",
] as const;

export type ContactService = (typeof CONTACT_SERVICES)[number];

export function isContactService(value: string | null): value is ContactService {
  return value !== null && (CONTACT_SERVICES as readonly string[]).includes(value);
}

export const contactSchema = z.object({
  name: z.string().min(1, "Preencha esse campo").max(120, "Máximo de 120 caracteres"),
  phone: z.string().min(1, "Preencha esse campo").max(40, "Máximo de 40 caracteres"),
  email: z
    .string()
    .min(1, "Preencha esse campo")
    .max(160, "Máximo de 160 caracteres")
    .email("Digite um endereço de e-mail válido"),
  company: z.string().max(160, "Máximo de 160 caracteres").optional(),
  subject: z.string().min(1, "Preencha esse campo").max(160, "Máximo de 160 caracteres"),
  message: z.string().max(4000, "Máximo de 4000 caracteres").optional(),
  /** Serviço/interesse — enum validado; opcional (o fluxo Agrofy não envia). */
  service: z.enum(CONTACT_SERVICES).optional(),
  // Which ecosystem the submission came from — mineração or Agrofy. Not
  // shown as a visible field; the form sets it based on which contact page
  // rendered it, so the email can be routed/labeled by origin. The API
  // route treats a missing value as "mineracao".
  division: z.enum(["mineracao", "agrofy"]).optional(),
  /** Honeypot anti-abuso: campo invisível para humanos ("website"). Quando
   * chega preenchido, a API aceita silenciosamente e NÃO envia e-mail —
   * proteção adequada ao runtime serverless, sem estado em memória. */
  website: z.string().max(200).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
