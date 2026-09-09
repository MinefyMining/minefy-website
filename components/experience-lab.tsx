"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Inbox,
  BookOpen,
  Bot,
  UserCheck,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  FileText,
  MessageSquare,
  Gauge,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   Demo data — ALL of it deliberately fictitious ("Empresa Exemplo",
   POP-017, ticket #4821…). The lab is a self-contained, client-side
   simulation: nothing here talks to an ERP/CRM, a production AI or any
   real system, and the UI says so persistently.
   ──────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: "entrada", label: "Entrada", icon: Inbox },
  { id: "conhecimento", label: "Conhecimento", icon: BookOpen },
  { id: "agente", label: "Agente", icon: Bot },
  { id: "aprovacao", label: "Aprovação", icon: UserCheck },
  { id: "resultado", label: "Resultado", icon: CheckCircle2 },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface StepContent {
  heading: string;
  text: string;
  /** Small key→value lines rendered as the step's "artifact" panel. */
  artifact: Array<{ k: string; v: string }>;
}

interface Scenario {
  id: string;
  label: string;
  icon: typeof Inbox;
  steps: Record<StepId, StepContent>;
  result: {
    docRef: string;
    decision: string;
    log: string[];
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "atendimento",
    label: "Atendimento",
    icon: MessageSquare,
    steps: {
      entrada: {
        heading: "Chega uma solicitação",
        text: "Um colaborador da Empresa Exemplo S.A. (fictícia) abre um chamado pedindo orientação sobre a troca de turno.",
        artifact: [
          { k: "canal", v: "chamado interno #4821" },
          { k: "de", v: "colaborador (simulado)" },
          { k: "assunto", v: "Dúvida sobre procedimento de troca de turno" },
        ],
      },
      conhecimento: {
        heading: "O agente busca nas fontes certas",
        text: "A pergunta é comparada com a base de conhecimento da empresa — políticas, procedimentos e comunicados — e as fontes relevantes são recuperadas com referência.",
        artifact: [
          { k: "fonte 1", v: "POP-017 · Procedimento de Troca de Turno (doc fictício)" },
          { k: "fonte 2", v: "Comunicado RH 2026-03 (doc fictício)" },
          { k: "similaridade", v: "0.91 · 0.84" },
        ],
      },
      agente: {
        heading: "A resposta é montada com citações",
        text: "O agente redige a resposta a partir das fontes recuperadas, cita cada trecho usado e classifica o chamado por tema e urgência.",
        artifact: [
          { k: "rascunho", v: "Resposta com 2 citações ao POP-017" },
          { k: "classificação", v: "RH · rotina · baixa urgência" },
          { k: "confiança", v: "alta (fontes diretas)" },
        ],
      },
      aprovacao: {
        heading: "Humano aprova antes de enviar",
        text: "Como o cliente definiu aprovação humana para respostas externas ao time, o agente prepara tudo e ESPERA. Nada sai sem o aval de quem aprova.",
        artifact: [
          { k: "status", v: "aguardando aprovação" },
          { k: "aprovador", v: "supervisor de RH (simulado)" },
          { k: "ação pendente", v: "enviar resposta ao chamado #4821" },
        ],
      },
      resultado: {
        heading: "Resposta enviada e registrada",
        text: "Com a aprovação, a resposta segue para o colaborador e todo o fluxo fica registrado — quem pediu, o que foi consultado, quem aprovou.",
        artifact: [
          { k: "chamado", v: "#4821 respondido (simulação)" },
          { k: "tempo do fluxo", v: "2 min (simulado)" },
          { k: "auditoria", v: "trilha completa disponível" },
        ],
      },
    },
    result: {
      docRef: "POP-017 · Procedimento de Troca de Turno — documento fictício",
      decision: "Envio da resposta: aprovado pelo supervisor (simulado)",
      log: [
        "09:14 · chamado #4821 recebido",
        "09:14 · 2 fontes recuperadas da base de conhecimento",
        "09:15 · rascunho gerado com citações",
        "09:15 · aprovação solicitada ao supervisor",
        "09:16 · aprovado · resposta enviada · trilha registrada",
      ],
    },
  },
  {
    id: "documentos",
    label: "Documentos",
    icon: FileText,
    steps: {
      entrada: {
        heading: "Chega um lote de documentos",
        text: "O financeiro da Empresa Exemplo S.A. (fictícia) recebe contratos e notas em PDF que precisam virar dados organizados.",
        artifact: [
          { k: "lote", v: "12 PDFs (simulados)" },
          { k: "tipos", v: "contratos · notas · aditivos" },
          { k: "origem", v: "pasta compartilhada (simulada)" },
        ],
      },
      conhecimento: {
        heading: "O agente entende cada documento",
        text: "Cada arquivo é lido e comparado com os modelos que a empresa usa — o agente sabe o que procurar em um contrato e o que procurar em uma nota.",
        artifact: [
          { k: "modelo", v: "Contrato de locação · padrão interno (fictício)" },
          { k: "campos-alvo", v: "partes · vigência · valor · reajuste" },
          { k: "referência", v: "CT-2026/044 (doc fictício)" },
        ],
      },
      agente: {
        heading: "Extração e organização",
        text: "O agente extrai os campos, cruza com o que já existe na planilha de controle e sinaliza divergências — como uma vigência que não bate com o aditivo.",
        artifact: [
          { k: "extraídos", v: "11 de 12 documentos" },
          { k: "divergência", v: "CT-2026/044: vigência ≠ aditivo" },
          { k: "planilha", v: "controle-contratos.xlsx (simulada)" },
        ],
      },
      aprovacao: {
        heading: "A divergência espera decisão humana",
        text: "Os 11 documentos consistentes seguem o fluxo; a divergência vira uma pendência clara para o gestor decidir. O agente não 'resolve' sozinho o que é ambíguo.",
        artifact: [
          { k: "status", v: "1 pendência aguardando gestor" },
          { k: "detalhe", v: "vigência 24m no contrato · 36m no aditivo" },
          { k: "opções", v: "usar aditivo · usar contrato · pedir revisão" },
        ],
      },
      resultado: {
        heading: "Base organizada, exceção decidida",
        text: "Com a decisão registrada, a base fica completa e auditável: cada dado aponta para o documento e a página de onde veio.",
        artifact: [
          { k: "registros", v: "12 de 12 na base (simulação)" },
          { k: "rastreio", v: "cada campo → documento de origem" },
          { k: "tempo do lote", v: "8 min (simulado)" },
        ],
      },
    },
    result: {
      docRef: "CT-2026/044 · Contrato de locação + Aditivo 01 — documentos fictícios",
      decision: "Divergência de vigência: gestor optou pelo aditivo (simulado)",
      log: [
        "14:02 · lote de 12 PDFs recebido",
        "14:03 · 11 documentos extraídos sem pendência",
        "14:03 · divergência detectada no CT-2026/044",
        "14:10 · gestor decidiu: prevalece o aditivo",
        "14:10 · base atualizada · trilha registrada",
      ],
    },
  },
  {
    id: "operacoes",
    label: "Operações",
    icon: Gauge,
    steps: {
      entrada: {
        heading: "Um indicador sai da faixa",
        text: "No painel da operação (simulado), o tempo de fila de uma etapa passa do limite combinado — o tipo de sinal que costuma se perder no meio do turno.",
        artifact: [
          { k: "evento", v: "fila da etapa B > 25 min" },
          { k: "fonte", v: "painel operacional (dados simulados)" },
          { k: "janela", v: "últimos 40 min" },
        ],
      },
      conhecimento: {
        heading: "Contexto antes de opinião",
        text: "O agente reúne o contexto: histórico recente da etapa, ocorrências registradas no turno e o procedimento operacional que trata desse desvio.",
        artifact: [
          { k: "histórico", v: "3 ocorrências similares no mês (simulado)" },
          { k: "turno", v: "registro de parada parcial às 10:20" },
          { k: "procedimento", v: "POP-031 · Desvio de fila (doc fictício)" },
        ],
      },
      agente: {
        heading: "Diagnóstico e proposta",
        text: "Cruzando os dados, o agente monta um resumo do provável gargalo e propõe a ação prevista no procedimento — com os números que justificam.",
        artifact: [
          { k: "hipótese", v: "gargalo pós-parada parcial das 10:20" },
          { k: "proposta", v: "redistribuir 2 recursos por 1h (POP-031)" },
          { k: "impacto estimado", v: "fila volta à faixa em ~30 min (simulação)" },
        ],
      },
      aprovacao: {
        heading: "O coordenador decide",
        text: "Mexer na alocação da operação é decisão humana: o agente entrega o diagnóstico pronto e aguarda o coordenador aprovar, ajustar ou recusar.",
        artifact: [
          { k: "status", v: "aguardando coordenador" },
          { k: "decisão pendente", v: "aplicar redistribuição proposta" },
          { k: "alternativa", v: "manter e reavaliar em 20 min" },
        ],
      },
      resultado: {
        heading: "Ação registrada, ciclo fechado",
        text: "Aprovada a ação, o agente registra o desfecho e acompanha o indicador — se a fila não voltar à faixa, o ciclo reabre com o novo contexto.",
        artifact: [
          { k: "ação", v: "redistribuição aplicada (simulação)" },
          { k: "acompanhamento", v: "indicador monitorado por 1h" },
          { k: "registro", v: "ocorrência + decisão + desfecho" },
        ],
      },
    },
    result: {
      docRef: "POP-031 · Tratamento de desvio de fila — documento fictício",
      decision: "Redistribuição de recursos: aprovada pelo coordenador (simulado)",
      log: [
        "10:47 · desvio detectado (fila > 25 min)",
        "10:47 · contexto reunido: histórico + turno + POP-031",
        "10:48 · diagnóstico e proposta apresentados",
        "10:52 · coordenador aprovou a redistribuição",
        "11:25 · fila de volta à faixa · ciclo fechado (simulação)",
      ],
    },
  },
];

const AUTO_ADVANCE_MS = 5000;

/**
 * Laboratório interativo — a guided, 100% client-side simulation of how a
 * Minefy agent runs a flow: Entrada → Conhecimento → Agente → Aprovação →
 * Resultado, across three scenarios. Steps are real buttons (keyboard
 * operable, visible focus), the tour can be paused/resumed/restarted, and
 * auto-advance never starts for users who prefer reduced motion. A
 * persistent label marks everything as simulated data.
 */
export function ExperienceLab({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  // Autoplay is a decorative convenience: off under reduced motion, and it
  // hands control to the visitor at the first manual interaction.
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];
  const step = STEPS[stepIdx];
  const content = scenario.steps[step.id];
  const autoplayAllowed = reduce !== true;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    stopTimer();
    if (!playing || !autoplayAllowed) return;
    timerRef.current = setInterval(() => {
      setStepIdx((s) => {
        if (s >= STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, AUTO_ADVANCE_MS);
    return stopTimer;
  }, [playing, autoplayAllowed, scenarioIdx, stopTimer]);

  const selectScenario = (idx: number) => {
    setScenarioIdx(idx);
    setStepIdx(0);
  };

  const selectStep = (idx: number) => {
    setStepIdx(idx);
    setPlaying(false); // visitor took control
  };

  const restart = () => {
    setStepIdx(0);
    setPlaying(autoplayAllowed);
  };

  const onStepKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(idx + 1, STEPS.length - 1);
      selectStep(next);
      document.getElementById(`lab-step-${STEPS[next].id}`)?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(idx - 1, 0);
      selectStep(prev);
      document.getElementById(`lab-step-${STEPS[prev].id}`)?.focus();
    }
  };

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847]";

  return (
    <div className={`glass-card relative overflow-hidden rounded-2xl border border-border ${className}`}>
      {/* ── Persistent honesty label ── */}
      <div
        role="note"
        className="flex items-center justify-center gap-2 border-b border-border bg-[#D4A847]/[0.07] px-4 py-2"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4A847]" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A847]">
          Demonstração interativa · dados simulados
        </p>
      </div>

      {/* ── No-JS / crawler fallback (critério 3.2): o conteúdo COMPLETO dos
          5 passos de cada cenário é server-rendered aqui dentro de
          <noscript> — sem JavaScript o visitante lê a jornada inteira; com
          JS o player interativo abaixo assume. ── */}
      <noscript>
        <div className="space-y-8 p-5 md:p-8">
          {SCENARIOS.map((s) => (
            <section key={s.id}>
              <h3 className="text-lg font-bold text-foreground">{s.label}</h3>
              <ol className="mt-3 space-y-4">
                {STEPS.map((st, i) => {
                  const c = s.steps[st.id];
                  return (
                    <li key={st.id} className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        passo {i + 1} · {st.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{c.heading}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </noscript>

      <div className="p-5 md:p-8">
        {/* ── Scenario tabs ── */}
        <div
          role="tablist"
          aria-label="Cenário da demonstração"
          className="flex flex-wrap gap-2"
        >
          {SCENARIOS.map((s, i) => {
            const active = i === scenarioIdx;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                role="tab"
                id={`lab-tab-${s.id}`}
                aria-selected={active}
                aria-controls="lab-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => selectScenario(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    const n = (i + 1) % SCENARIOS.length;
                    selectScenario(n);
                    document.getElementById(`lab-tab-${SCENARIOS[n].id}`)?.focus();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const n = (i - 1 + SCENARIOS.length) % SCENARIOS.length;
                    selectScenario(n);
                    document.getElementById(`lab-tab-${SCENARIOS[n].id}`)?.focus();
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${focusRing} ${
                  active
                    ? "border-[#D4A847] bg-[#D4A847]/10 text-[#D4A847]"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div
          id="lab-panel"
          role="tabpanel"
          aria-labelledby={`lab-tab-${scenario.id}`}
          className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]"
        >
          {/* ── Step rail ── */}
          <div className="min-w-0">
            <ol className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === stepIdx;
                const done = i < stepIdx;
                return (
                  <li key={s.id} className="shrink-0 lg:shrink">
                    <button
                      id={`lab-step-${s.id}`}
                      onClick={() => selectStep(i)}
                      onKeyDown={(e) => onStepKeyDown(e, i)}
                      aria-current={active ? "step" : undefined}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-200 ${focusRing} ${
                        active
                          ? "border-[#D4A847]/60 bg-[#D4A847]/10"
                          : done
                            ? "border-border bg-card"
                            : "border-border bg-transparent hover:bg-card"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                          active
                            ? "bg-[#D4A847] text-[#0A0A0A]"
                            : done
                              ? "bg-[#D4A847]/20 text-[#D4A847]"
                              : "bg-secondary text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          passo {i + 1}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            active ? "text-[#D4A847]" : "text-foreground"
                          }`}
                        >
                          {s.label}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* ── Controls ── */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setPlaying((p) => !p && autoplayAllowed)}
                disabled={!autoplayAllowed}
                title={
                  autoplayAllowed
                    ? undefined
                    : "Avanço automático desativado (movimento reduzido) — navegue pelos passos"
                }
                className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
              >
                {playing && autoplayAllowed ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" /> Reproduzir
                  </>
                )}
              </button>
              <button
                onClick={restart}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar
              </button>
            </div>
          </div>

          {/* ── Detail panel ── */}
          <div className="relative min-w-0 min-h-[320px] rounded-xl border border-border bg-background/60 p-5 md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${scenario.id}-${step.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7FB4D8]">
                  {scenario.label} · passo {stepIdx + 1} de {STEPS.length}
                </p>
                <h3 className="mt-2 text-xl font-bold text-foreground">
                  {content.heading}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {content.text}
                </p>

                {/* Artifact panel */}
                <div className="mt-5 rounded-lg border border-border bg-card p-4">
                  <dl className="space-y-2">
                    {content.artifact.map((a) => (
                      <div key={a.k} className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <dt className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {a.k}
                        </dt>
                        <dd className="font-mono text-xs text-foreground/90">
                          {a.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Approval step: the demo decision is a real (clickable) button
                    that advances the flow — approval stays in human hands. */}
                {step.id === "aprovacao" && (
                  <button
                    onClick={() => selectStep(STEPS.length - 1)}
                    className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D4A847] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#C49B3F] ${focusRing}`}
                  >
                    <UserCheck className="h-4 w-4" aria-hidden="true" />
                    Aprovar (simulação)
                  </button>
                )}

                {/* Result step: fictitious doc reference, decision + action log */}
                {step.id === "resultado" && (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        documento referenciado
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                        {scenario.result.docRef}
                      </p>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        decisão
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                        {scenario.result.decision}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        log de ações (simulado)
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {scenario.result.log.map((line) => (
                          <li
                            key={line}
                            className="font-mono text-[11px] leading-relaxed text-foreground/80"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
