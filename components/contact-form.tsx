"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  CONTACT_SERVICES,
  type ContactFormData,
  type ContactService,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactFormProps {
  variant?: "compact" | "full";
  /** Which ecosystem this form instance lives in — tags the submission so
   * the notification email can be labeled/routed by origin. Defaults to
   * "mineracao"; the Agrofy contact page passes "agrofy". */
  division?: "mineracao" | "agrofy";
  /** Pre-selected service/interest — set by the mineração contact page from
   * the `?interesse=` query param that every service CTA carries, so the
   * visitor lands with the right context already chosen (still editable).
   * The Agrofy page doesn't pass it and its form hides the field entirely. */
  initialService?: ContactService;
}

export function ContactForm({
  variant = "full",
  division = "mineracao",
  initialService,
}: ContactFormProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const isAgro = division === "agrofy";

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      service: isAgro ? undefined : initialService,
      division,
      website: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, division }),
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={variant === "full" ? "max-w-2xl mx-auto" : ""}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.name")} maxLength={120} {...field} />
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
                    <Input placeholder={t("form.phone")} maxLength={40} {...field} />
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
                    <Input type="email" placeholder={t("form.email")} maxLength={160} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.company")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.company")} maxLength={160} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Serviço/interesse — enum validado, dimensão separada da divisão.
                Oculto no mundo Agrofy (o fluxo agro permanece o de sempre). */}
            {!isAgro && (
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.service")}</FormLabel>
                    <FormControl>
                      <select
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : (e.target.value as ContactService),
                          )
                        }
                        className={cn(
                          "border-input dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <option value="" className="bg-card text-foreground">
                          {t("form.servicePlaceholder")}
                        </option>
                        {CONTACT_SERVICES.map((svc) => (
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

          {/* Honeypot anti-abuso — invisível e fora da ordem de tab para
              humanos; bots que o preencherem têm o envio aceito e descartado
              silenciosamente pela API (sem estado em memória serverless). */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          <Button
            type="submit"
            disabled={status === "sending"}
            className={
              isAgro
                ? "w-full md:w-auto rounded-full bg-[#16A34A] text-white hover:bg-[#15803D] px-8"
                : "w-full md:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            }
          >
            {status === "sending" ? t("form.sending") : t("form.submit")}
          </Button>

          {/* Estado acessível: anunciado por leitores de tela sem roubar foco. */}
          <div aria-live="polite" role="status">
            {status === "success" && (
              <p className="text-green-500 text-sm">{t("form.success")}</p>
            )}
            {status === "error" && (
              <div className="space-y-1.5">
                <p className="text-destructive text-sm">{t("form.error")}</p>
                <p className="text-sm text-muted-foreground">
                  {t.rich("form.fallback", {
                    whatsapp: (chunks) => (
                      <a
                        href="https://api.whatsapp.com/send?phone=5531993801664"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {chunks}
                      </a>
                    ),
                    email: (chunks) => (
                      <a
                        href="mailto:louis.litt@minefymining.com"
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
