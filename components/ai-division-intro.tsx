import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";

/** Shared visual entrance: both division anchors land on the image and headline. */
export function AiDivisionIntro() {
  return (
    <div className="relative isolate overflow-hidden bg-[#080c12] text-white">
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-[#89c7e8]/30" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="relative h-[350px] sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[65%]">
          <Image src="/images/premium/agent-portrait.jpg" alt="Robô Minefy em acabamento metálico, representação visual da divisão de inteligência artificial" fill sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover object-[70%_30%] lg:object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#080c12] via-transparent to-[#080c12]/20 lg:bg-gradient-to-r lg:from-[#080c12] lg:via-[#080c12]/20 lg:to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080c12] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-14 lg:py-28 xl:py-36">
          <ScrollReveal className="relative -mt-8 max-w-xl lg:mt-0">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8d8f1]"><span className="h-px w-10 bg-[#a8d8f1]" />Divisão 02 · IA & TI</p>
            <h2 className="mt-6 text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl xl:text-7xl">Uma nova<br />inteligência.<br /><span className="text-[#a8d8f1]">Para o seu negócio.</span></h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">Da engenharia que move a mineração à inteligência que transforma empresas. Criamos agentes de IA, conectamos sistemas e desenvolvemos a tecnologia que faz sua operação avançar.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/contato?servico=ia-corporativa" className="inline-flex items-center gap-3 rounded-lg bg-[#b5def2] px-5 py-3.5 text-sm font-semibold text-[#080c12] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Descubra o potencial da sua empresa<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              <Link href="/experiencias" className="inline-flex items-center gap-2 px-1 py-3 text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-8 hover:decoration-white">Veja a IA em ação<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <div className="relative border-y border-white/10 bg-[#0e1721]">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 md:grid-cols-3">
          {[
            ["01", "IA corporativa", "Seu conhecimento conectado às decisões.", "/solucoes/ia-corporativa"],
            ["02", "Agentes autônomos", "Processos executados com propósito e controle.", "/solucoes/agentes-autonomos"],
            ["03", "Tecnologia & integração", "Sistemas que trabalham juntos pela sua empresa.", "/solucoes/servicos-ti"],
          ].map(([number, title, text, href]) => (
            <Link key={number} href={href} className="group border-b border-white/10 py-7 transition-colors last:border-b-0 hover:bg-white/[0.03] md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
              <span className="font-mono text-[10px] tracking-widest text-[#a8d8f1]/70">{number} / MINEFY</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-xl font-semibold">{title}<ArrowRight aria-hidden="true" className="h-4 w-4 text-[#a8d8f1] transition-transform group-hover:translate-x-1" /></span>
              <p className="mt-2 text-sm text-white/55">{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
