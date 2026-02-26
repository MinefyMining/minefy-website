"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
}

export function ContactForm({ variant = "full" }: ContactFormProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.name")} {...field} />
                  </FormControl>
                  <FormMessage>{t("validation.nameRequired")}</FormMessage>
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
                    <Input placeholder={t("form.phone")} {...field} />
                  </FormControl>
                  <FormMessage>{t("validation.phoneRequired")}</FormMessage>
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
                    <Input type="email" placeholder={t("form.email")} {...field} />
                  </FormControl>
                  <FormMessage>{t("validation.emailInvalid")}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.subject")} {...field} />
                  </FormControl>
                  <FormMessage>{t("validation.subjectRequired")}</FormMessage>
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
                  <Textarea placeholder={t("form.message")} rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={status === "sending"}
            className="w-full md:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            {status === "sending" ? t("form.sending") : t("form.submit")}
          </Button>
          {status === "success" && (
            <p className="text-green-500 text-sm">{t("form.success")}</p>
          )}
          {status === "error" && (
            <p className="text-destructive text-sm">{t("form.error")}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
