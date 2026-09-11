"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import { Dialog } from "radix-ui";

const views = [
  { label: "Equipamento", src: "/images/premium/scroller-isolated.png", alt: "Scroller inteira, isolada do fundo: cabine, plataforma e tambores helicoidais visíveis", caption: "Imagem ilustrativa do equipamento" },
  { label: "Projeto", src: "/images/premium/scroller-project.jpg", alt: "Visualização ilustrativa do projeto Scroller, em perspectiva, com os dois tambores e plataforma completos", caption: "Visualização ilustrativa do projeto" },
];

/** Vistas ilustrativas, nunca apresentadas como um modelo 3D ou giro 360°. */
export function ScrollerShowcase() {
  const [view, setView] = useState(0);
  const selected = views[view];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101216]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-4 sm:px-6">
        <div role="group" aria-label="Vista da Scroller" className="flex gap-2">
          {views.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={view === index} onClick={() => setView(index)} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A847] ${view === index ? "bg-[#D4A847] font-semibold text-[#101216]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <Dialog.Root>
          <Dialog.Trigger className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#D4A847]">
            <Expand className="h-4 w-4" aria-hidden="true" /> Ampliar imagem
          </Dialog.Trigger>
          <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border h-[85svh] w-[95vw] max-w-[1500px] border-white/15 bg-[#101216] p-6 text-white sm:max-w-[95vw]">
            <Dialog.Title className="text-base">Scroller · {selected.label}</Dialog.Title>
            <Dialog.Description className="sr-only">Imagem ampliada da Scroller. Pressione Escape ou Fechar visualização para voltar.</Dialog.Description>
            <div className="relative min-h-0 flex-1">
              <Image src={selected.src} alt={selected.alt} fill sizes="95vw" className="object-contain p-3" />
            </div>
            <p className="text-xs text-white/55">{selected.caption}</p>
          <Dialog.Close aria-label="Fechar visualização" className="absolute right-4 top-4 rounded-full border border-white/20 p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#D4A847]"><X className="h-4 w-4" aria-hidden="true" /></Dialog.Close>
          </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <figure>
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
          <Image src={selected.src} alt={selected.alt} fill sizes="(max-width: 1024px) 100vw, 75vw" className="object-contain p-5 sm:p-10" />
        </div>
        <figcaption className="border-t border-white/10 px-6 py-4 text-xs text-white/55">{selected.caption} · equipamento completo, sem recorte</figcaption>
      </figure>
    </div>
  );
}
