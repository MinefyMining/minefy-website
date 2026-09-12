"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Bot, ArrowRight, Play, Pause, RotateCcw, Check } from "lucide-react";

const agents = [
  { name: "Estratégia", role: "Define prioridades", x: 170, y: 80 },
  { name: "Comercial", role: "Qualifica oportunidades", x: 500, y: 80 },
  { name: "Financeiro", role: "Analisa a viabilidade", x: 830, y: 80 },
  { name: "Operações", role: "Planeja a execução", x: 170, y: 260 },
  { name: "Engenharia", role: "Desenha a solução", x: 500, y: 260 },
  { name: "Gestão", role: "Consolida e acompanha", x: 830, y: 260 },
];
const steps = [
  { from: 0, to: 1, message: "Prioridade compartilhada: estruturar uma nova oportunidade de negócio.", result: "Objetivo e critérios definidos." },
  { from: 1, to: 4, message: "Comercial envia requisitos do cliente para a Engenharia avaliar as integrações.", result: "Requisitos organizados e contexto transferido." },
  { from: 4, to: 2, message: "Engenharia compartilha o escopo técnico para análise de custos e viabilidade.", result: "Solução proposta e esforço estimado." },
  { from: 2, to: 3, message: "Financeiro encaminha as premissas para Operações planejar recursos e prazos.", result: "Premissas financeiras disponíveis para planejamento." },
  { from: 3, to: 4, message: "Operações alinha a sequência de implantação e as dependências com Engenharia.", result: "Plano de execução alinhado entre as áreas." },
  { from: 4, to: 5, message: "Engenharia envia a solução validada à Gestão, junto ao contexto das demais áreas.", result: "Proposta e plano reunidos para revisão humana." },
  { from: 5, to: 0, message: "Após revisão do responsável, Gestão devolve prioridades e próximos passos à Estratégia.", result: "Ciclo concluído. Decisão registrada e próximos passos definidos." },
];

export function MultiAgentFlow() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible || reduce || step === steps.length - 1) return;
    const timer = setInterval(() => setStep(current => {
      if (current === steps.length - 1) return current;
      return current + 1;
    }), 3800);
    return () => clearInterval(timer);
  }, [playing, visible, reduce, step]);
  const current = steps[step];
  const finished = step === steps.length - 1;
  const running = playing && !finished && !reduce;
  const source = agents[current.from];
  const target = agents[current.to];
  return (
    <section ref={root} id="agente-minefy" className="my-16 scroll-mt-24 overflow-hidden rounded-2xl border border-[#89bdd9]/25 bg-[#090f17] text-white">
      <div className="p-6 sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8d8f1]">Organização multiagente · Demonstração ilustrativa</p>
        <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Uma equipe de IA.<br /><span className="text-[#a8d8f1]">Várias especialidades. Um objetivo.</span></h3>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">Estruturamos agentes com funções, acessos e responsabilidades diferentes. Eles compartilham contexto, delegam tarefas e coordenam entregas entre departamentos, com revisão humana nos pontos definidos pela empresa.</p>
      </div>
      <div className="relative px-6 sm:px-10">
        <svg viewBox="0 0 1000 340" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden="true">
          {steps.map((s, i) => <path key={i} d={`M ${agents[s.from].x} ${agents[s.from].y} L ${agents[s.to].x} ${agents[s.to].y}`} stroke="#274054" strokeWidth="1" />)}
          <path d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`} stroke="#a8d8f1" strokeWidth="2" strokeDasharray="8 10" className={running && visible ? "multi-agent-signal" : ""} />
        </svg>
        <div className="relative grid grid-cols-2 gap-4 pb-6 md:grid-cols-3 md:gap-x-16 md:gap-y-16 md:pb-10">
          {agents.map((agent, index) => {
            const active = index === current.from || index === current.to;
            return <div key={agent.name} className={`rounded-xl border p-4 transition-colors duration-500 sm:p-6 ${active ? "border-[#a8d8f1]/70 bg-[#172a3b]" : "border-white/10 bg-[#0e1721]"}`}>
              <div className="flex items-center justify-between"><Bot className={`h-6 w-6 ${active ? "text-[#a8d8f1]" : "text-white/40"}`} aria-hidden="true" /><span className="font-mono text-[9px] text-white/40">0{index + 1}</span></div>
              <h4 className="mt-4 text-sm font-semibold sm:text-lg">{agent.name}</h4><p className="mt-1 text-xs leading-relaxed text-white/55">{agent.role}</p>
              <p className="mt-4 text-[10px] font-medium text-[#a8d8f1]">{index === current.from ? "Compartilha contexto" : index === current.to ? "Recebe e contribui" : "Especialista disponível"}</p>
            </div>;
          })}
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#101c28] p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="flex items-center gap-3 text-sm font-semibold text-[#a8d8f1]">{source.name}<ArrowRight className="h-4 w-4" aria-hidden="true" />{target.name}</p>
          <div className="flex flex-wrap gap-2">
            {!reduce && <button type="button" onClick={() => { if (finished) setStep(0); setPlaying(!running); }} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs hover:bg-white/10">{running ? <Pause size={14} /> : <Play size={14} />}{running ? "Pausar" : "Executar fluxo"}</button>}
            <button type="button" onClick={() => { setPlaying(false); setStep((step + 1) % steps.length); }} className="rounded-lg border border-white/20 px-4 py-2 text-xs hover:bg-white/10">Próxima etapa</button>
            <button type="button" aria-label="Reiniciar fluxo" onClick={() => { setStep(0); setPlaying(false); }} className="rounded-lg border border-white/20 p-2 hover:bg-white/10"><RotateCcw size={16} /></button>
          </div>
        </div>
        <div aria-live={running ? "off" : "polite"} className="mt-5 min-h-24">
          <p className="text-sm leading-relaxed text-white/80">{current.message}</p>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#a8d8f1]"><Check size={15} className="shrink-0" aria-hidden="true" />{current.result}</p>
        </div>
        <div className="mt-5 flex gap-2" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
          {steps.map((_, i) => <button key={i} type="button" aria-label={`Ver etapa ${i + 1}`} aria-current={i === step ? "step" : undefined} onClick={() => { setStep(i); setPlaying(false); }} className="flex h-8 flex-1 items-center"><span className={`h-1 w-full rounded-full ${i <= step ? "bg-[#a8d8f1]" : "bg-white/15"}`} /></button>)}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">Cenário demonstrativo, sem conexão com sistemas reais. Funções, integrações e níveis de autonomia são definidos para cada projeto.</p>
      </div>
    </section>
  );
}
