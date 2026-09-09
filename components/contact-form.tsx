"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import {
  contactSchema,
  SERVICOS,
  type ContactFormData,
  type Servico,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { minAgeWaitMs } from "@/lib/contact-token-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Status = "idle" | "sending" | "success" | "unavailable" | "rate-limited" | "error";

/**
 * fetch com teto de tempo (AbortController): rede travada não pode deixar
 * o formulário preso em "Enviando" para sempre — abort vira erro honesto
 * no chamador, com os campos digitados preservados e os links de fallback
 * (mailto/WhatsApp) pré-preenchidos.
 */
function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

interface ContactFormProps {
  variant?: "compact" | "full";
  /** Which ecosystem this form instance lives in. Cosmetic + default-service
   * only: the API derives the real division from the request Host. */
  division?: "mineracao" | "agrofy";
  /** Pre-selected service/interest — the mineração contact page passes the
   * validated `?servico=` value; without one, the world's anchor service is
   * the default. Always editable by the visitor (Agrofy hides the field and
   * submits its own anchor). */
  initialService?: Servico;
}

export function ContactForm({
  variant = "full",
  division = "mineracao",
  initialService,
}: ContactFormProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  /**
   * Nonce HMAC anti-abuso (MIKE-ARQUITETURA 5.3 · MIKE-REVISAO B1/B1b),
   * buscado em `/api/contact-token` no PRIMEIRO FOCO do formulário — nunca
   * no render da página (ISR congelaria um token de 30min no cache por até
   * 24h) e nem no mount (evita 1 request por pageview/prefetch).
   * `null` = emissão indisponível (secret não configurado, fetch falhou);
   * a API decide em fail-open, o formulário nunca trava aqui.
   *
   * CLOCK SKEW: a espera da idade mínima usa APENAS relógio monotônico
   * LOCAL (`performance.now()` desde o recebimento do token) — jamais
   * comparar `Date.now()` do browser com `issuedAt` do servidor: um
   * relógio de cliente atrasado 1h prenderia o envio por 1h. A espera tem
   * teto rígido de MIN_AGE + margem; nenhum caminho espera ilimitado.
   */
  const tokenRef = useRef<{ value: string; receivedAtMono: number } | null>(null);
  const tokenRequested = useRef(false);
  const fetchToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetchWithTimeout("/api/contact-token", { cache: "no-store" }, 5_000);
      if (!res.ok) return null;
      const json = (await res.json()) as { token?: string | null };
      if (!json.token) return null;
      tokenRef.current = { value: json.token, receivedAtMono: performance.now() };
      return json.token;
    } catch {
      return null;
    }
  }, []);
  const ensureTokenRequested = useCallback(() => {
    if (tokenRequested.current) return;
    tokenRequested.current = true;
    void fetchToken();
  }, [fetchToken]);

  /** Espera transparente (dentro do estado "enviando") até o token atingir
   * a idade mínima — medida no monotônico local desde o recebimento, com
   * teto de MIN_AGE + margem. Visitante rápido nunca é bloqueado; relógio
   * de parede do cliente é irrelevante. */
  async function waitTokenMinAge() {
    const current = tokenRef.current;
    if (!current) return;
    const remaining = minAgeWaitMs(performance.now() - current.receivedAtMono);
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }
  }

  const statusRef = useRef<HTMLDivElement>(null);
  const isAgro = division === "agrofy";
  const defaultService: Servico =
    initialService ?? (isAgro ? "agro-telemetria" : "mineracao-telemetria");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      empresa: "",
      subject: "",
      message: "",
      servico: defaultService,
      division,
      hp: "",
    },
  });

  /** Fallback links pre-filled with the visitor's draft — captured at
   * failure time (never computed during render), so the lead survives a
   * provider outage by leaving through another channel. */
  const [fallbackLinks, setFallbackLinks] = useState<{
    mailto: string;
    whatsapp: string;
  } | null>(null);

  // Move focus to the status region when an outcome lands, so AT users
  // hear it (effect, not render — refs are only touched here).
  useEffect(() => {
    if (status === "success" || status === "unavailable" || status === "rate-limited" || status === "error") {
      statusRef.current?.focus();
    }
  }, [status]);

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    const draft = [
      data.subject,
      "",
      data.message ?? "",
      "",
      `${data.name} · ${data.phone} · ${data.email}`,
    ]
      .join("\n")
      .trim();
    const links = {
      mailto: `mailto:contact@minefymining.com?subject=${encodeURIComponent(
        data.subject || "Contato pelo site",
      )}&body=${encodeURIComponent(draft)}`,
      whatsapp: `https://api.whatsapp.com/send?phone=5531993801664&text=${encodeURIComponent(
        draft,
      )}`,
    };
    try {
      const post = async (token: string | null) => {
        if (token) await waitTokenMinAge();
        return fetchWithTimeout(
          "/api/contact",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, t: token ?? undefined }),
          },
          15_000,
        );
      };

      let token = tokenRef.current?.value ?? (await fetchToken());
      let response = await post(token);

      // 409 token_stale (aba esquecida >30min, bfcache, skew): re-emite e
      // reenvia UMA vez — os campos digitados ficam intactos (nenhum reset
      // fora do caminho de sucesso). O lead não se perde por burocracia de
      // nonce.
      if (response.status === 409) {
        const payload = (await response
          .clone()
          .json()
          .catch(() => null)) as { code?: string } | null;
        if (payload?.code === "token_stale") {
          token = await fetchToken();
          response = await post(token);
        }
      }

      if (response.ok) {
        setStatus("success");
        setFallbackLinks(null);
        form.reset();
      } else if (response.status === 429) {
        setStatus("rate-limited");
        setFallbackLinks(links);
      } else if (response.status === 502 || response.status === 503) {
        setStatus("unavailable");
        setFallbackLinks(links);
      } else {
        setStatus("error");
        setFallbackLinks(links);
      }
    } catch {
      setStatus("unavailable");
      setFallbackLinks(links);
    }
  }

  const failed =
    status === "unavailable" || status === "rate-limited" || status === "error";

  return (
    <div className={variant === "full" ? "max-w-2xl mx-auto" : ""}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onFocusCapture={ensureTokenRequested}
          onPointerDownCapture={ensureTokenRequested}
          className="relative space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.name")}
                      maxLength={120}
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.phone")}
                      maxLength={32}
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("form.email")}
                      maxLength={254}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.company")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.company")}
                      maxLength={120}
                      autoComplete="organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Serviço/interesse — enum, ortogonal à divisão. Oculto no mundo
                Agrofy (o formulário agro envia o serviço-âncora do mundo). */}
            {!isAgro && (
              <FormField
                control={form.control}
                name="servico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.service")}</FormLabel>
                    <FormControl>
                      <select
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value as Servico)}
                        className={cn(
                          "border-input dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        )}
                      >
                        {SERVICOS.filter((s) => s !== "agro-telemetria").map((svc) => (
                          <option key={svc} value={svc} className="bg-card text-foreground">
                            {t(`form.serviceOptions.${svc}`)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.subject")} maxLength={160} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.message")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("form.message")} rows={5} maxLength={4000} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Honeypot anti-abuso — escondido de verdade para AT: aria-hidden,
              fora de tela, fora da ordem de tab, autocomplete off. Bot que o
              preencher recebe 200 e nada é enviado. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="contact-hp">Não preencha este campo</label>
            <input
              id="contact-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("hp")}
            />
          </div>

          <Button
            type="submit"
            disabled={status === "sending"}
            aria-busy={status === "sending"}
            className={
              isAgro
                ? "w-full md:w-auto rounded-full bg-[#16A34A] text-white hover:bg-[#15803D] px-8"
                : "w-full md:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            }
          >
            {status === "sending" ? t("form.sending") : t("form.submit")}
          </Button>

          {/* Estado acessível: região única, foco movido ao concluir; nunca
              comunicado só por cor (ícone + texto). */}
          <div
            ref={statusRef}
            tabIndex={-1}
            role={failed ? "alert" : "status"}
            aria-live="polite"
            className="outline-none"
          >
            {status === "success" && (
              <p className="inline-flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("form.success")}
              </p>
            )}
            {status === "rate-limited" && (
              <p className="inline-flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("form.errorRateLimit")}
              </p>
            )}
            {(status === "unavailable" || status === "error") && (
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("form.errorUnavailable")}
                </p>
                {/* O lead sai por outro canal em vez de morrer: links já
                    pré-preenchidos com o que o visitante digitou. */}
                <p className="text-sm text-muted-foreground">
                  {t.rich("form.fallback", {
                    whatsapp: (chunks) => (
                      <a
                        href={fallbackLinks?.whatsapp ?? "https://api.whatsapp.com/send?phone=5531993801664"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {chunks}
                      </a>
                    ),
                    email: (chunks) => (
                      <a
                        href={fallbackLinks?.mailto ?? "mailto:contact@minefymining.com"}
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
