"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

/**
 * FAQ em largura editorial (`max-w-7xl`): duas colunas independentes no
 * desktop (cada uma empilha sozinha — abrir um item não empurra a coluna
 * vizinha), uma no mobile. Acessível de verdade: botão com `aria-expanded`
 * + `aria-controls`, painel com `id`/`role=region`/`aria-labelledby` e
 * foco visível. Vários itens podem ficar abertos ao mesmo tempo.
 */
export function FaqSection({ title, subtitle, items }: FaqSectionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // Duas colunas por divisão sequencial (metade a metade) — preserva a
  // ordem de leitura por coluna e deixa cada coluna com altura própria.
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  const renderItem = (item: FaqItem, i: number) => {
    const isOpen = open.has(i);
    const buttonId = `${baseId}-faq-q-${i}`;
    const panelId = `${baseId}-faq-a-${i}`;
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: (i % half) * 0.05 }}
        className={`overflow-hidden rounded-2xl border transition-colors ${
          isOpen ? "border-primary/40 bg-card" : "border-border bg-card/60"
        }`}
      >
        <button
          type="button"
          id={buttonId}
          onClick={() => toggle(i)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          <span className="text-base font-semibold text-foreground">{item.q}</span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary"
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-4 lg:grid-cols-2">
          {columns.map((column, c) => (
            <div key={c} className="space-y-4">
              {column.map((item, j) => renderItem(item, c * half + j))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
