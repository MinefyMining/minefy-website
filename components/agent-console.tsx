"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Play, RotateCcw, UserCheck } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   Console de execução do Agente Minefy — a cena de IA do palco do hero
   (direção de arte CEO 2026-09-09: interface operacional demonstrativa,
   não ilustração de fluxo; retrato do agente integrado em tamanho
   reconhecível, sem círculo/átomo/órbita).

   É uma DEMONSTRAÇÃO auto-contida: todos os dados são fictícios
   ("Empresa Exemplo S.A.", POP-031, CT-2026/019…), nada fala com sistema
   real e a UI diz isso de forma persistente. Cenários distintos dos do
   laboratório de /experiencias — aqui é visão compacta da capacidade,
   lá é a experiência profunda.

   Estados: idle → run (etapas 1-3 avançam sozinhas) → review (PARA e
   espera o clique humano em "Aprovar" — a aprovação é o coração do
   fluxo) → done. Timer só corre com o console visível (IntersectionObserver)
   e com a aba ativa; transições são opacity/transform e morrem sob
   reduced-motion (bloco global). SSR entrega o estado idle completo:
   cenário, etapas e CTA legíveis sem JS.
   ──────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: "pedido", label: "Pedido" },
  { id: "fontes", label: "Fontes" },
  { id: "preparacao", label: "Preparação" },
  { id: "revisao", label: "Revisão" },
  { id: "resultado", label: "Resultado" },
] as const;

interface StepContent {
  title: string;
  lines: Array<{ k: string; v: string }>;
}

interface Scenario {
  id: string;
  label: string;
  intro: string;
  steps: [StepContent, StepContent, StepContent, StepContent, StepContent];
}

const SCENARIOS: Scenario[] = [
  {
    id: "turno",
    label: "Relatório de turno",
    intro:
      "Um gestor da Empresa Exemplo S.A. (fictícia) pede o consolidado do turno da manhã. O agente executa em cinco etapas — e nada sai sem revisão humana.",
    steps: [
      {
        title: "Chega o pedido",
        lines: [
          { k: "canal", v: "mensagem do gestor (simulada)" },
          { k: "pedido", v: "consolidado do turno da manhã" },
        ],
      },
      {
        title: "Fontes certas, com referência",
        lines: [
          { k: "fonte 1", v: "planilha de apontamentos (fictícia)" },
          { k: "fonte 2", v: "POP-031 · fechamento de turno (fictício)" },
        ],
      },
      {
        title: "Rascunho preparado",
        lines: [
          { k: "rascunho", v: "consolidado com 2 pendências sinalizadas" },
          { k: "cada número", v: "aponta a linha de origem" },
        ],
      },
      {
        title: "Aguardando aprovação humana",
        lines: [
          { k: "status", v: "preparado — esperando o aval" },
          { k: "aprovadora", v: "supervisora de operação (simulada)" },
        ],
      },
      {
        title: "Entregue e registrado",
        lines: [
          { k: "relatório", v: "enviado ao gestor (simulação)" },
          { k: "auditoria", v: "trilha completa: fontes, rascunho, aval" },
        ],
      },
    ],
  },
  {
    id: "contrato",
    label: "Follow-up de contrato",
    intro:
      "O reajuste do contrato CT-2026/019 (fictício) vence em breve. O agente prepara a notificação — e o jurídico aprova antes de qualquer envio.",
    steps: [
      {
        title: "Um prazo se aproxima",
        lines: [
          { k: "evento", v: "reajuste do CT-2026/019 em 15 dias" },
          { k: "origem", v: "base de contratos (simulada)" },
        ],
      },
      {
        title: "Contrato, aditivo e histórico",
        lines: [
          { k: "fontes", v: "contrato + aditivo 01 (fictícios)" },
          { k: "contexto", v: "histórico de tratativas (simulado)" },
        ],
      },
      {
        title: "Minuta com valores conferidos",
        lines: [
          { k: "minuta", v: "notificação de reajuste pronta" },
          { k: "conferência", v: "índice e datas citados da cláusula 4" },
        ],
      },
      {
        title: "Aguardando aprovação humana",
        lines: [
          { k: "status", v: "minuta preparada — esperando o aval" },
          { k: "aprovador", v: "responsável jurídico (simulado)" },
        ],
      },
      {
        title: "Enviado com registro completo",
        lines: [
          { k: "notificação", v: "enviada à contraparte (simulação)" },
          { k: "auditoria", v: "quem pediu, o que leu, quem aprovou" },
        ],
      },
    ],
  },
];

type Phase = "idle" | "run" | "review" | "done";

const STEP_MS = 2100;

const STATUS: Record<Phase, string> = {
  idle: "pronto para demonstrar",
  run: "executando…",
  review: "aguardando aprovação",
  done: "concluído com aval humano",
};

export function AgentConsole({ className = "" }: { className?: string }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  /* Timer pausado fora da tela — o avanço só é agendado com o console
     visível e a aba ativa; ao voltar, retoma de onde parou. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "run") return;
    const tick = () => {
      timerRef.current = setTimeout(() => {
        if (!visibleRef.current || document.hidden) {
          tick(); // ainda fora da tela — reagenda sem avançar
          return;
        }
        setStep((s) => {
          if (s >= 2) {
            setPhase("review");
            return 3;
          }
          return s + 1;
        });
      }, STEP_MS);
    };
    tick();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, step]);

  const start = useCallback(() => {
    setStep(0);
    setPhase("run");
  }, []);

  const approve = useCallback(() => {
    setStep(4);
    setPhase("done");
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setStep(0);
  }, []);

  const selectScenario = useCallback((idx: number) => {
    setScenarioIdx(idx);
    setPhase("idle");
    setStep(0);
  }, []);

  const active = scenario.steps[step];
  const doneUpTo = phase === "done" ? 5 : phase === "review" ? 3 : phase === "run" ? step : 0;

  return (
    <div
      ref={rootRef}
      className={`w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D11]/90 shadow-[0_32px_90px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      {/* ── retrato do agente — integrado, tamanho reconhecível ── */}
      <div className="relative h-36">
        <Image
          src="/images/premium/agent-portrait.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 28rem, 90vw"
          className="object-cover"
          style={{ objectPosition: "62% 10%" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/35 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute right-3.5 top-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">
          Demonstração · dados simulados
        </span>
        <div className="absolute bottom-2.5 left-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9FC6E2]">
            02 · Inteligência artificial
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-base font-semibold text-white">
            Agente Minefy
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[9px] font-normal uppercase tracking-wider text-white/70">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  phase === "review"
                    ? "bg-[#D4A847]"
                    : phase === "done"
                      ? "bg-emerald-400"
                      : "bg-[#7FB4D8]"
                } ${phase === "run" ? "node-pulse" : ""}`}
                aria-hidden="true"
              />
              {STATUS[phase]}
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* ── cenário selecionável ── */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Cenário da demonstração">
          <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
            Cenário
          </span>
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectScenario(i)}
              aria-pressed={i === scenarioIdx}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FB4D8] ${
                i === scenarioIdx
                  ? "bg-[#7FB4D8]/15 text-[#9FC6E2] ring-1 ring-inset ring-[#7FB4D8]/40"
                  : "text-white/55 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ── trilho de etapas ── */}
        <ol className="mt-4 flex gap-1.5" aria-label="Etapas da execução">
          {STEPS.map((s, i) => {
            const isDone = i < doneUpTo;
            const isActive = phase !== "idle" && i === step;
            return (
              <li key={s.id} className="min-w-0 flex-1">
                <span
                  className={`block h-[3px] rounded-full transition-colors duration-300 ${
                    isDone
                      ? "bg-[#D4A847]"
                      : isActive
                        ? phase === "review"
                          ? "bg-[#D4A847]/70"
                          : "bg-[#7FB4D8]"
                        : "bg-white/12"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`mt-1.5 block truncate font-mono text-[10px] uppercase tracking-wider ${
                    isActive ? "text-white/85" : isDone ? "text-[#E8C877]/80" : "text-white/55"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* ── painel do estado atual ── */}
        <div
          key={`${scenario.id}-${phase}-${step}`}
          className={`console-swap mt-4 min-h-[8.25rem] rounded-xl border p-4 ${
            phase === "review"
              ? "border-[#D4A847]/45 bg-[#D4A847]/[0.06]"
              : "border-white/10 bg-black/30"
          }`}
          aria-live="polite"
        >
          {phase === "idle" ? (
            <>
              <p className="text-[13px] leading-relaxed text-white/75">{scenario.intro}</p>
              <p className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40">
                Pedido → Fontes → Preparação → Revisão humana → Resultado
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                {phase === "review" && (
                  <UserCheck className="h-4 w-4 text-[#D4A847]" aria-hidden="true" />
                )}
                {phase === "done" && (
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                )}
                {active.title}
              </p>
              <dl className="mt-2.5 space-y-1.5">
                {active.lines.map((l) => (
                  <div key={l.k} className="flex gap-2 text-[12px] leading-snug">
                    <dt className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/40 pt-[1px]">
                      {l.k}
                    </dt>
                    <dd className="text-white/75">{l.v}</dd>
                  </div>
                ))}
              </dl>
              {phase === "review" && (
                <button
                  type="button"
                  onClick={approve}
                  className="btn-sheen mt-3 inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-4 py-2 text-[12.5px] font-semibold text-[#0A0A0A] transition-colors duration-200 hover:bg-[#C49B3F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]"
                >
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Aprovar e concluir
                </button>
              )}
            </>
          )}
        </div>

        {/* ── ações ── */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {phase === "idle" || phase === "run" ? (
            <button
              type="button"
              onClick={start}
              disabled={phase === "run"}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-[12.5px] font-medium text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/10 disabled:cursor-default disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FB4D8]"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              {phase === "run" ? "Executando…" : "Executar demonstração"}
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-[12.5px] font-medium text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FB4D8]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reiniciar
            </button>
          )}
          <a
            href="#ia"
            className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[#9FC6E2] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FB4D8]"
          >
            Explore a IA
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
