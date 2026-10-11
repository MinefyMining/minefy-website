/**
 * story.js — transições de cena da jornada (WEBSITE-QA-20261011).
 * Executa o módulo real sobre um DOM mínimo (não há jsdom na cópia): cobre
 * chegada direta no capítulo 02 com download pendente, deadline com retry,
 * corrida entre capítulos (último pedido vence), decode do elemento final
 * antes do commit, promoção de variante no resize sem downgrade, histerese
 * de capítulo e HUD que só escreve quando muda. Não substitui QA visual.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* ───────── DOM mínimo ───────── */
class FakeAnimation { playState = "running"; cancel() { this.playState = "idle"; } finish() { this.playState = "finished"; } }
type Rect = { top: number; height: number };
class El extends EventTarget {
  tag: string; children: El[] = []; parent: El | null = null; attrs: Record<string, string> = {};
  dataset: Record<string, string> = {}; classes = new Set<string>(); hidden = false; disabled = false; value = ""; tabIndex = 0;
  style: Record<string, string> & { setProperty(k: string, v: string): void };
  textWrites = 0; private _text = ""; private _html = ""; rectFn: (() => Rect) | null = null;
  offsetWidth = 0; offsetHeight = 0; animations: FakeAnimation[] = [];
  src = ""; complete = false; naturalWidth: number | undefined = undefined; decodeImpl: (() => Promise<void>) | null = null;
  classList = {
    add: (...n: string[]) => n.forEach((c) => this.classes.add(c)),
    remove: (...n: string[]) => n.forEach((c) => this.classes.delete(c)),
    contains: (c: string) => this.classes.has(c),
    toggle: (c: string, force?: boolean) => { const on = force ?? !this.classes.has(c); if (on) this.classes.add(c); else this.classes.delete(c); return on; },
  };
  constructor(tag: string) {
    super(); this.tag = tag.toLowerCase();
    const style: Record<string, string> = {};
    this.style = Object.assign(style, { setProperty: (k: string, v: string) => { style[k] = String(v); } });
  }
  get className() { return [...this.classes].join(" "); } set className(v: string) { this.classes = new Set(v.split(/\s+/).filter(Boolean)); }
  get id() { return this.attrs.id ?? ""; } set id(v: string) { this.attrs.id = v; }
  get textContent() { return this._text; } set textContent(v: string) { this.textWrites++; this._text = String(v); }
  get innerHTML() { return this._html; }
  set innerHTML(v: string) {
    this._html = v; this.children = [];
    for (const m of v.matchAll(/<([a-z][\w-]*)([^>]*)>/gi)) {
      const child = new El(m[1]);
      for (const a of m[2].matchAll(/([\w-]+)="([^"]*)"/g)) child.setAttribute(a[1], a[2]);
      child.parent = this; this.children.push(child);
    }
  }
  setAttribute(k: string, v: string) { this.attrs[k] = String(v); if (k === "class") this.className = v; if (k.startsWith("data-")) this.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = v; }
  getAttribute(k: string) { return this.attrs[k] ?? null; }
  removeAttribute(k: string) { delete this.attrs[k]; }
  append(...nodes: El[]) { for (const n of nodes) { n.parent?.removeChild(n); n.parent = this; this.children.push(n); } }
  prepend(...nodes: El[]) { for (const n of nodes.reverse()) { n.parent?.removeChild(n); n.parent = this; this.children.unshift(n); } }
  replaceChildren(...nodes: El[]) { this.children.forEach((c) => { c.parent = null; }); this.children = []; this.append(...nodes); }
  removeChild(n: El) { this.children = this.children.filter((c) => c !== n); n.parent = null; }
  remove() { this.parent?.removeChild(this); }
  get isConnected(): boolean { return this.parent ? this.parent.isConnected : this === doc; }
  querySelector(s: string) { return select(this, s)[0] ?? null; }
  querySelectorAll(s: string) { return select(this, s); }
  getBoundingClientRect() { const r = this.rectFn?.() ?? { top: 0, height: 0 }; return { top: r.top, height: r.height, bottom: r.top + r.height, left: 0, right: 0, width: this.offsetWidth }; }
  animate() { const a = new FakeAnimation(); this.animations.push(a); return a; }
  decode() { return this.decodeImpl ? this.decodeImpl() : Promise.resolve(); }
  scrollIntoView() {} focus() {} blur() {} click() {}
}
function matches(el: El, compound: string) {
  const m = compound.match(/^([a-z][\w-]*)?(#[\w-]+)?((?:\.[\w-]+)*)((?:\[[^\]]+\])*)$/i); if (!m) return false;
  if (m[1] && el.tag !== m[1].toLowerCase()) return false;
  if (m[2] && el.id !== m[2].slice(1)) return false;
  for (const c of m[3].split(".").filter(Boolean)) if (!el.classes.has(c)) return false;
  for (const a of m[4].matchAll(/\[([\w-]+)(?:=([^\]]+))?\]/g)) {
    const v = el.attrs[a[1]] ?? (a[1].startsWith("data-") ? el.dataset[a[1].slice(5)] : undefined);
    if (v === undefined || (a[2] !== undefined && v !== a[2].replace(/^"|"$/g, ""))) return false;
  }
  return true;
}
function descendants(el: El, out: El[] = []) { for (const c of el.children) { out.push(c); descendants(c, out); } return out; }
function select(root: El, selector: string) {
  const result: El[] = [];
  for (const part of selector.split(",")) {
    const steps = part.trim().replace(/\s*>\s*/g, " >").split(/\s+/);
    let set = descendants(root).filter((e) => matches(e, steps[0]));
    for (let i = 1; i < steps.length; i++) {
      let step = steps[i], child = false; if (step.startsWith(">")) { child = true; step = step.slice(1); }
      const next: El[] = [];
      for (const anc of set) for (const e of child ? anc.children : descendants(anc)) if (matches(e, step) && !next.includes(e)) next.push(e);
      set = next;
    }
    for (const e of set) if (!result.includes(e)) result.push(e);
  }
  return result;
}
function h(spec: string, ...children: (El | string)[]) {
  const [, tag, id, cls] = spec.match(/^([a-z][a-z0-9]*)(?:#([\w-]+))?((?:\.[\w-]+)*)$/)!;
  const el = new El(tag); if (id) el.id = id; cls.split(".").filter(Boolean).forEach((c) => el.classes.add(c));
  for (const c of children) if (typeof c === "string") el.setAttribute(...(c.split("=") as [string, string])); else el.append(c);
  return el;
}

let doc: El, section: El, canvas: El, html: El, body: El;
let viewport: Rect; let frames: (() => void)[] = []; let observers: { cb: (e: { isIntersecting: boolean }[]) => void }[] = [];
let deferDecodes = false; let pendingDecodes: { resolve: () => void; reject: (e: Error) => void }[] = [];
class FakeImage {
  static instances: FakeImage[] = [];
  onload: null | (() => void) = null; onerror: null | (() => void) = null;
  src = ""; srcset = ""; sizes = ""; decoding = ""; fetchPriority = ""; currentSrc = ""; naturalWidth = 0;
  constructor() { FakeImage.instances.push(this); }
  decode() { return Promise.resolve(); }
  load(width = 1672) { this.naturalWidth = width; this.currentSrc = this.src; this.onload?.(); }
  fail() { this.onerror?.(); }
}
function buildDocument() {
  doc = new El("#document"); html = new El("html"); body = new El("body"); doc.append(html); html.append(body);
  const dots = h("div.story-dots"); for (let i = 0; i < 9; i++) dots.append(h("button", `data-story=${i}`));
  canvas = h("div#story-canvas");
  canvas.offsetWidth = 1331; canvas.offsetHeight = 749; // 1280×720 com inset -2 %
  section = h("section#jornada.story-scroll",
    h("div.story-sticky",
      h("div.story-top", h("span#story-heading.eyebrow"), h("span.story-chapter", h("b#story-step"), h("span#story-chapter-label"))),
      h("div.story-stage",
        h("div.story-copy", h("span#story-kicker"), h("h2#story-title"), h("p#story-description"), h("div#story-tags.story-tags"), h("div#story-fact.story-fact", h("i"), h("span"))),
        h("div.story-world", canvas, h("div.story-scene-caption", h("span#story-scene-label")),
          h("div#story-hud.story-hud", h("strong", h("span#story-temperature")), h("div.hud-bar", h("span")), h("p#story-signal-state")),
          h("div#story-alert.story-alert"))),
      h("div.story-navigation", h("button#story-prev"), dots, h("button#story-next")),
      h("div.story-timeline", h("span"))));
  section.rectFn = () => viewport;
  const lab = h("section#preditiva", h("input#oil-temp"), h("input#oil-pressure"), h("input#engine-vibration"),
    h("span#oil-temp-value"), h("span#oil-pressure-value"), h("span#engine-vibration-value"),
    h("div.parameter"), h("div.parameter"), h("div.parameter"), h("div.prediction-result"), h("path#risk-arc"), h("span#risk-icon"),
    h("span#risk-level"), h("span#risk-count"), h("h3#risk-title"), h("p#risk-description"), h("span#rule-status"),
    h("button#reset-scenario"), h("button#simulate-scenario"));
  (lab.querySelector("#oil-temp") as El).value = "82"; (lab.querySelector("#oil-pressure") as El).value = "4.2"; (lab.querySelector("#engine-vibration") as El).value = "2";
  body.append(section, lab);
  const document = Object.assign(doc, {
    documentElement: html, body, hidden: false,
    createElement: (tag: string) => { const el = new El(tag); if (tag === "img" && deferDecodes) el.decodeImpl = () => new Promise<void>((resolve, reject) => pendingDecodes.push({ resolve, reject })); return el; },
  });
  return document;
}
/** Posiciona a rolagem no capítulo `n` com fase `phase` (0..1). */
function scrollTo(n: number, phase = 0.3) { const range = viewport.height - 720; viewport.top = -((n + phase) / 9) * range; }
const flush = (ms = 0) => vi.advanceTimersByTimeAsync(ms);
async function sync() { window.dispatchEvent(new Event("scroll")); frames.splice(0).forEach((f) => f()); await flush(0); }
/** Entra no capítulo: sincroniza e deixa passar o atraso de seleção (80 ms). */
async function enter(n: number, phase = 0.3) { scrollTo(n, phase); await sync(); await flush(80); }
const frameOf = (n: number) => canvas.children.find((f) => f.dataset.scene === String(n));
const activeFrame = () => canvas.children.find((f) => f.classes.has("is-active"));
const lastImage = () => FakeImage.instances[FakeImage.instances.length - 1];
async function resolveLast(width = 1672) { lastImage().load(width); await flush(0); }
const title = () => (section.querySelector("#story-step") as El).textContent;
const busy = () => canvas.getAttribute("aria-busy");
const errorNote = () => section.querySelector(".story-media-error") as El;
const status = () => section.querySelector(".story-media-status") as El;

beforeEach(async () => {
  vi.useFakeTimers();
  FakeImage.instances = []; frames = []; observers = []; deferDecodes = false; pendingDecodes = [];
  viewport = { top: 5000, height: 7200 }; // fora da viewport ao iniciar
  const document = buildDocument();
  vi.stubGlobal("document", document);
  vi.stubGlobal("window", Object.assign(new EventTarget(), { scrollTo: vi.fn(), location: { hash: "" } }));
  vi.stubGlobal("Image", FakeImage);
  vi.stubGlobal("innerWidth", 1280); vi.stubGlobal("innerHeight", 720); vi.stubGlobal("devicePixelRatio", 1); vi.stubGlobal("scrollY", 0);
  vi.stubGlobal("navigator", {});
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {} }));
  vi.stubGlobal("requestAnimationFrame", (f: () => void) => { frames.push(f); return frames.length; });
  vi.stubGlobal("performance", { now: () => 0 });
  vi.stubGlobal("IntersectionObserver", class { cb: (e: { isIntersecting: boolean }[]) => void; constructor(cb: (e: { isIntersecting: boolean }[]) => void) { this.cb = cb; observers.push(this); } observe() {} disconnect() {} });
  vi.resetModules();
  await import("../public/story.js");
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("chegada direta e estado de carregamento", () => {
  it("abrir no capítulo 02 com download pendente não apresenta a prévia como cena pronta e mantém busy explícito", async () => {
    await enter(1);
    const frame = frameOf(1)!;
    expect(frame.classes.has("is-active")).toBe(true);
    expect(frame.classes.has("is-preview")).toBe(true);
    expect(frame.classes.has("is-ready")).toBe(false);
    expect(frame.querySelector("img")).toBeNull(); // nenhum elemento final até decodificar
    expect(busy()).toBe("true");
    expect(title()).toBe("02"); // a copy é legível de imediato
    expect(status().hidden).toBe(true);
    await flush(300);
    expect(status().hidden).toBe(false);
    expect((status().querySelector("b") as El).textContent).toContain("CENA 02");
    expect(lastImage().src).toContain("cinema-plant-1672"); // 1331×749 em cover exige a 1672
  });

  it("deadline: após 15 s a cena vira erro recuperável, sem busy preso; retry cria novo pedido e o callback antigo é ignorado", async () => {
    await enter(1);
    const first = lastImage();
    // Primeira chegada: seleção imediata (0 ms); o prazo de 15 s conta a partir do pedido.
    await flush(14900);
    expect(busy()).toBe("true");
    await flush(100);
    expect(busy()).toBe("false");
    expect(errorNote().hidden).toBe(false);
    expect(errorNote().querySelector("span")!.textContent).toMatch(/lenta/);
    expect(status().hidden).toBe(true);
    expect(frameOf(1)!.classes.has("is-ready")).toBe(false);
    (errorNote().querySelector("button") as El).dispatchEvent(new Event("click"));
    await flush(0);
    expect(FakeImage.instances).toHaveLength(2);
    expect(busy()).toBe("true");
    first.load(); await flush(0); // tardio
    expect(frameOf(1)!.classes.has("is-ready")).toBe(false);
    await resolveLast();
    expect(frameOf(1)!.classes.has("is-ready")).toBe(true);
    expect(frameOf(1)!.classes.has("is-preview")).toBe(false);
    expect(busy()).toBe("false");
    expect(errorNote().hidden).toBe(true);
  });

  it("falha de download mostra retry e preserva a última cena nítida; a copy segue o capítulo atual", async () => {
    await enter(0); await resolveLast();
    expect(frameOf(0)!.classes.has("is-ready")).toBe(true);
    await enter(1);
    lastImage().fail(); await flush(0);
    expect(activeFrame()).toBe(frameOf(0)); // cena anterior continua
    expect(errorNote().hidden).toBe(false);
    expect(busy()).toBe("false");
    expect(title()).toBe("02");
  });
});

describe("handoff e corridas", () => {
  it("decodifica o elemento final antes de trocar: a cena anterior permanece ativa até o decode concluir", async () => {
    await enter(0); await resolveLast();
    deferDecodes = true;
    await enter(1); await resolveLast();
    expect(pendingDecodes).toHaveLength(1);
    expect(activeFrame()).toBe(frameOf(0));
    expect(title()).toBe("01"); // copy, HUD e cena mudam juntos no commit
    const staging = frameOf(1)!.querySelector("img.is-staging") as El;
    expect(staging.src).toContain("cinema-plant-1672");
    pendingDecodes[0].resolve(); await flush(0);
    expect(activeFrame()).toBe(frameOf(1));
    expect(frameOf(1)!.querySelector("img.is-staging")).toBeNull();
    expect(title()).toBe("02");
    expect(busy()).toBe("false");
  });

  it("resposta fora de ordem: 1→2→8→2 rápido deixa o capítulo 02 em cena e descarta o 08 tardio", async () => {
    await enter(0); await resolveLast();
    await enter(1); const plant = lastImage();
    await enter(7); const mobile = lastImage();
    await enter(1); // volta ao 02: pedido em voo é reutilizado
    expect(FakeImage.instances).toHaveLength(3);
    mobile.load(); await flush(0);
    expect(activeFrame()).toBe(frameOf(0));
    expect(frameOf(7)?.classes.has("is-active") ?? false).toBe(false);
    plant.load(); await flush(0);
    expect(activeFrame()).toBe(frameOf(1));
    expect(title()).toBe("02");
    expect(busy()).toBe("false");
  });

  it("sair da viewport durante a carga não comete a cena; ao voltar, o capítulo é pedido de novo", async () => {
    await enter(1);
    viewport.top = 5000; await sync();
    expect(section.classes.has("story-visible")).toBe(false);
    await resolveLast();
    expect(frameOf(1)!.classes.has("is-ready")).toBe(false);
    await enter(1);
    expect(FakeImage.instances).toHaveLength(2);
    await resolveLast();
    expect(frameOf(1)!.classes.has("is-ready")).toBe(true);
  });

  it("navegar para trás durante a carga: só o capítulo desejado ao final fica pronto e busy fecha", async () => {
    await enter(0); await resolveLast();
    await enter(2); const tailings = lastImage();
    await enter(1); // voltou
    await resolveLast(); // plant
    expect(activeFrame()).toBe(frameOf(1));
    tailings.load(); await flush(0);
    expect(activeFrame()).toBe(frameOf(1));
    expect(busy()).toBe("false");
  });
});

describe("resolução e promoção", () => {
  it("um quadro pequeno recebe 900; aumentar viewport/DPR no mesmo capítulo promove para 1672 mantendo a cena durante a troca; reduzir não rebaixa", async () => {
    canvas.offsetWidth = 600; canvas.offsetHeight = 300;
    await enter(0); await resolveLast(900);
    const frame = frameOf(0)!;
    expect(lastImage().src).toContain("cinema-mining-900");
    expect(frame.dataset.width).toBe("900");
    frame.offsetWidth = 1331; frame.offsetHeight = 749; vi.stubGlobal("devicePixelRatio", 2);
    deferDecodes = true;
    window.dispatchEvent(new Event("resize")); frames.splice(0).forEach((f) => f());
    await flush(250);
    expect(FakeImage.instances).toHaveLength(2);
    expect(lastImage().src).toContain("cinema-mining-1672");
    await resolveLast();
    const imgs = frame.querySelectorAll("img");
    expect(imgs).toHaveLength(2); // a antiga segue pintada enquanto a nova decodifica
    expect(imgs[1].classes.has("is-staging")).toBe(true);
    pendingDecodes[0].resolve(); await flush(0);
    expect(frame.querySelectorAll("img")).toHaveLength(1);
    expect(frame.querySelector("img")!.src).toContain("cinema-mining-1672");
    expect(frame.dataset.width).toBe("1672");
    frame.offsetWidth = 600; frame.offsetHeight = 300; vi.stubGlobal("devicePixelRatio", 1);
    window.dispatchEvent(new Event("resize")); frames.splice(0).forEach((f) => f());
    await flush(250);
    expect(FakeImage.instances).toHaveLength(2); // nenhum download para rebaixar
  });

  it("a câmera contém a aproximação quando a fonte tem menos pixels do que a tela pede", async () => {
    vi.stubGlobal("devicePixelRatio", 3);
    await enter(3, 0.95); await resolveLast();
    const frame = frameOf(3)!;
    expect(Number(frame.dataset.detail)).toBeLessThan(1);
    const push = Number(frame.style["--push"]);
    expect(push).toBeGreaterThan(1.025);
    expect(push).toBeLessThan(1.025 + 0.27); // caminhão: 0,27 cheio só com detalhe suficiente
  });
});

describe("estabilidade de capítulo e HUD", () => {
  it("oscilar 1 % em torno da fronteira não alterna o capítulo (histerese de 3 %)", async () => {
    await enter(0, 0.5); await resolveLast();
    scrollTo(1, 0.01); await sync(); await flush(80);
    expect(FakeImage.instances).toHaveLength(1);
    expect(title()).toBe("01");
    scrollTo(1, 0.05); await sync(); await flush(80);
    expect(FakeImage.instances).toHaveLength(2);
    await resolveLast();
    expect(title()).toBe("02");
    scrollTo(0, 0.99); await sync(); await flush(80);
    expect(title()).toBe("02");
  });

  it("HUD: 60 sincronizações sem mudança não escrevem; o limiar de 100 °C não oscila por 1 °C", async () => {
    await enter(4, 0.5); await resolveLast();
    const temperature = section.querySelector("#story-temperature") as El, hud = section.querySelector("#story-hud") as El, state = section.querySelector("#story-signal-state") as El;
    const before = temperature.textWrites, stateBefore = state.textWrites;
    for (let i = 0; i < 60; i++) await sync();
    expect(temperature.textWrites).toBe(before);
    expect(state.textWrites).toBe(stateBefore);
    // 82 + 26·ease(clamp(phase·1,45)) atinge 100 °C perto de phase ≈ 0,47.
    let critical = -1;
    for (let p = 0.3; p <= 0.7; p += 0.005) { scrollTo(4, p); await sync(); if (Number(temperature.textContent) >= 100) { critical = p; break; } }
    expect(critical).toBeGreaterThan(0);
    expect(hud.classes.has("critical")).toBe(true);
    const writes = state.textWrites;
    scrollTo(4, critical - 0.012); await sync(); // ~1 °C abaixo
    expect(Number(temperature.textContent)).toBeLessThan(100);
    expect(hud.classes.has("critical")).toBe(true);
    expect(state.textWrites).toBe(writes);
    scrollTo(4, 0.3); await sync(); // 82 + 26·ease(0,435) ≈ 92 °C
    expect(hud.classes.has("critical")).toBe(false);
    expect(temperature.textContent).toBe("92");
    expect(state.textContent).toBe("LEITURA ILUSTRATIVA");
  });
});
