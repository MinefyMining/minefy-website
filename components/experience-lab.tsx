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
import { useTranslations } from "next-intl";

/* ────────────────────────────────────────────────────────────────────────
   Demo data — ALL of it deliberately fictitious ("Empresa Exemplo",
   POP-017, ticket #4821…). The lab is a self-contained, client-side
   simulation: nothing here talks to an ERP/CRM, a production AI or any
   real system, and the UI says so persistently.
   SITE-I18N: todo o texto vem do namespace `chrome.experienceLab`
   (messages/*.json); este arquivo mantém apenas estrutura e ícones.
   ──────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: "entrada", icon: Inbox },
  { id: "conhecimento", icon: BookOpen },
  { id: "agente", icon: Bot },
  { id: "aprovacao", icon: UserCheck },
  { id: "resultado", icon: CheckCircle2 },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const SCENARIO_ICONS = {
  atendimento: MessageSquare,
  documentos: FileText,
  operacoes: Gauge,
} as const;

interface StepContent {
  heading: string;
  text: string;
  artifact: Array<{ k: string; v: string }>;
}

interface ScenarioData {
  id: keyof typeof SCENARIO_ICONS;
  label: string;
  steps: Record<StepId, StepContent>;
  result: {
    docRef: string;
    decision: string;
    log: string[];
  };
}

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
  const t = useTranslations("chrome.experienceLab");
  const scenarios = t.raw("scenarios") as ScenarioData[];
  const stepLabels = t.raw("steps") as Record<StepId, string>;
  const reduce = useReducedMotion();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  // Autoplay is a decorative convenience: off under reduced motion, and it
  // hands control to the visitor at the first manual interaction.
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = scenarios[scenarioIdx];
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
          {t("honestyLabel")}
        </p>
      </div>

      {/* ── No-JS / crawler fallback (critério 3.2): o conteúdo COMPLETO dos
          5 passos de cada cenário é server-rendered aqui dentro de
          <noscript> — sem JavaScript o visitante lê a jornada inteira; com
          JS o player interativo abaixo assume. ── */}
      <noscript>
        <div className="space-y-8 p-5 md:p-8">
          {scenarios.map((s) => (
            <section key={s.id}>
              <h3 className="text-lg font-bold text-foreground">{s.label}</h3>
              <ol className="mt-3 space-y-4">
                {STEPS.map((st, i) => {
                  const c = s.steps[st.id];
                  return (
                    <li key={st.id} className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("stepWord")} {i + 1} · {stepLabels[st.id]}
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
          aria-label={t("tablistAria")}
          className="flex flex-wrap gap-2"
        >
          {scenarios.map((s, i) => {
            const active = i === scenarioIdx;
            const Icon = SCENARIO_ICONS[s.id];
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
                    const n = (i + 1) % scenarios.length;
                    selectScenario(n);
                    document.getElementById(`lab-tab-${scenarios[n].id}`)?.focus();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const n = (i - 1 + scenarios.length) % scenarios.length;
                    selectScenario(n);
                    document.getElementById(`lab-tab-${scenarios[n].id}`)?.focus();
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
                          {t("stepWord")} {i + 1}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            active ? "text-[#D4A847]" : "text-foreground"
                          }`}
                        >
                          {stepLabels[s.id]}
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
                    : t("reducedMotionTitle")
                }
                className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
              >
                {playing && autoplayAllowed ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" /> {t("pause")}
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" /> {t("play")}
                  </>
                )}
              </button>
              <button
                onClick={restart}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t("restart")}
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
                  {scenario.label} · {t("stepWord")} {stepIdx + 1} {t("ofWord")} {STEPS.length}
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
                    {t("approve")}
                  </button>
                )}

                {/* Result step: fictitious doc reference, decision + action log */}
                {step.id === "resultado" && (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("docRefLabel")}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                        {scenario.result.docRef}
                      </p>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("decisionLabel")}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                        {scenario.result.decision}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("logLabel")}
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
