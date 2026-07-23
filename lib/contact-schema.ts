import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Preencha esse campo"),
  phone: z.string().min(1, "Preencha esse campo"),
  email: z.string().min(1, "Preencha esse campo").email("Digite um endereço de e-mail válido"),
  subject: z.string().min(1, "Preencha esse campo"),
  message: z.string().optional(),
  // Which ecosystem the submission came from — mineração or Agrofy. Not
  // shown as a visible field; the form sets it based on which contact page
  // rendered it, so the email can be routed/labeled by origin. The API
  // route treats a missing value as "mineracao".
  division: z.enum(["mineracao", "agrofy"]).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
