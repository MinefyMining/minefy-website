/**
 * command.js — dashboard demonstrativo (WEBSITE-QA-20261011).
 * Executa o módulo real sobre um DOM mínimo: dados renderizados uma vez,
 * apresentação de entrada sem reconstruir gráficos, replay que cancela
 * animações em curso (uma por elemento), pausa respeitada, nenhum listener
 * de rolagem, números estáveis nas seis seleções, zoom/reset e janelas.
 * Não mede FPS nem prova ausência de piscar: isso fica para o QA visual.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeAnimation {
  playState = "running";
  constructor(public element: El, public frames: Record<string, unknown>[], public options: Record<string, unknown>) {}
  cancel() { this.playState = "idle"; }
  finish() { this.playState = "finished"; }
}
class El extends EventTarget {
  tag: string; children: El[] = []; parent: El | null = null; attrs: Record<string, string> = {}; dataset: Record<string, string> = {};
  classes = new Set<string>(); hidden = false; disabled = false; value = ""; title = ""; alt = "";
  style: Record<string, string> & { setProperty(k: string, v: string): void };
  private _text = ""; private _html = ""; htmlWrites = 0; textWrites = 0;
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
    this.htmlWrites++; this._html = v; this.children = [];
    for (const m of v.matchAll(/<([a-z][\w-]*)([^>]*)>/gi)) {
      const child = new El(m[1]);
      for (const a of m[2].matchAll(/([\w-]+)="([^"]*)"/g)) child.setAttribute(a[1], a[2]);
      child.parent = this; this.children.push(child);
    }
  }
  setAttribute(k: string, v: string) { this.attrs[k] = String(v); if (k === "class") this.className = v; if (k.startsWith("data-")) this.dataset[k.slice(5)] = v; }
  getAttribute(k: string) { return this.attrs[k] ?? null; }
  removeAttribute(k: string) { delete this.attrs[k]; }
  append(...nodes: El[]) { for (const n of nodes) { n.parent?.removeChild(n); n.parent = this; this.children.push(n); } }
  removeChild(n: El) { this.children = this.children.filter((c) => c !== n); n.parent = null; }
  remove() { this.parent?.removeChild(this); }
  querySelector(s: string) { return select(this, s)[0] ?? null; }
  querySelectorAll(s: string) { return select(this, s); }
  getBoundingClientRect() { const top = offscreen ? 5000 : 100; return { top, bottom: top + 50, left: 0, right: 0, width: 0, height: 50 }; }
  animate(frames: Record<string, unknown>[], options: Record<string, unknown>) { const a = new FakeAnimation(this, frames, options); animations.push(a); return a; }
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

let doc: El, body: El, animations: FakeAnimation[] = [], offscreen = false;
let entrance: ((e: { isIntersecting: boolean }[]) => void) | null = null;
let windowListeners: string[] = [];
const flush = (ms = 0) => vi.advanceTimersByTimeAsync(ms);
function buildDocument() {
  doc = new El("#document"); body = new El("body"); doc.append(body);
  const kpis = h("div.command-kpis"); for (let i = 0; i < 4; i++) kpis.append(h("div"));
  const offers = h("div.offerings");
  for (let i = 0; i < 5; i++) offers.append(h("div.offering", h("h3", h("button", h("b"))), h("div.offering-detail")));
  body.append(
    h("div.command-frame", h("div.command-terrain"), h("div#command-markers"), h("div#command-map-world"), kpis,
      h("div#map-selection"), h("div.command-asset", h("div.asset-identity")), h("select#command-asset-select"),
      h("button", "data-window=30"), h("button", "data-window=120"), h("button#map-zoom-in"), h("button#map-zoom-out"), h("button#map-reset"), h("button#command-replay"),
      h("div.trend-card", h("div.chart-reading"), h("svg#temperature-chart")), h("div.pressure-card", h("svg#pressure-chart")), h("div.fuel-card", h("svg#fuel-chart")),
      h("svg#cycles-chart"), h("svg#speed-gauge"), h("svg#speed-spark"), h("div#fuel-meter")),
    offers, h("div.portfolio-visual", h("img#product-photo")));
  const document = Object.assign(doc, {
    documentElement: new El("html"), body, hidden: false,
    createElement: (tag: string) => new El(tag),
    querySelector: (s: string) => { let el = select(doc, s)[0]; if (!el && /^#[\w-]+$/.test(s)) { el = h(`div${s}`); body.append(el); } return el ?? null; },
  });
  return document;
}
beforeEach(async () => {
  vi.useFakeTimers();
  animations = []; offscreen = true; entrance = null; windowListeners = [];
  vi.stubGlobal("document", buildDocument());
  const win = new EventTarget(); const add = win.addEventListener.bind(win);
  win.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => { windowListeners.push(type); add(type, listener, options); };
  vi.stubGlobal("window", win);
  vi.stubGlobal("innerWidth", 1280); vi.stubGlobal("innerHeight", 720); vi.stubGlobal("devicePixelRatio", 1);
  vi.stubGlobal("navigator", {});
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {} }));
  vi.stubGlobal("Image", class { onload: null | (() => void) = null; onerror: null | (() => void) = null; src = ""; srcset = ""; decode() { return Promise.resolve(); } });
  vi.stubGlobal("IntersectionObserver", class { constructor(cb: (e: { isIntersecting: boolean }[]) => void) { entrance = cb; } observe() {} disconnect() {} });
  vi.resetModules();
  await import("../public/command.js");
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

const $ = (s: string) => doc.querySelector(s) as El;
const runningOn = (el: El) => animations.filter((a) => a.element === el && a.playState === "running");
async function enterViewport() { offscreen = false; entrance!([{ isIntersecting: true }]); await flush(0); }

describe("render de dados × apresentação", () => {
  it("inicializa dados uma vez; a entrada anima os nós existentes sem reconstruir os gráficos", async () => {
    const temperature = $("#temperature-chart"), cycles = $("#cycles-chart");
    expect(temperature.htmlWrites).toBe(1);
    expect(cycles.htmlWrites).toBe(1);
    expect($("#command-oil").innerHTML).toContain("108");
    expect(animations).toHaveLength(0); // fora da viewport nada anima
    await enterViewport();
    expect(temperature.htmlWrites).toBe(1);
    expect(cycles.htmlWrites).toBe(1);
    expect(runningOn(temperature.querySelector(".trend-line") as El)).toHaveLength(1);
    expect(runningOn($("#pressure-chart").querySelector(".trend-line") as El)).toHaveLength(1);
    expect(runningOn($("#fuel-chart").querySelector(".trend-line") as El)).toHaveLength(1);
    expect(cycles.querySelectorAll(".cycle-bar").every((bar) => runningOn(bar).length === 1)).toBe(true);
    expect(runningOn($(".command-frame"))).toHaveLength(1);
  });

  it("a apresentação revela números já visíveis sem partir de opacidade zero e preenche o atraso (fill backwards)", async () => {
    await enterViewport();
    const kpi = animations.find((a) => a.element === $(".command-kpis").children[0])!;
    expect(Number(kpi.frames[0].opacity)).toBeGreaterThanOrEqual(0.35);
    expect(kpi.options.fill).toBe("backwards");
    const selection = animations.find((a) => a.element === $("#map-selection"))!;
    expect(Number(selection.frames[0].opacity)).toBeGreaterThanOrEqual(0.35);
    expect(selection.options.fill).toBe("backwards");
  });

  it("não registra listener de rolagem/redimensionamento: a rolagem não recalcula telemetria", () => {
    expect(windowListeners).not.toContain("scroll");
    expect(windowListeners).not.toContain("resize");
  });
});

describe("replay, pausa e aba oculta", () => {
  it("replays repetidos cancelam as animações anteriores: no máximo uma em curso por elemento", async () => {
    await enterViewport();
    const replay = $("#command-replay");
    replay.dispatchEvent(new Event("click")); await flush(0);
    replay.dispatchEvent(new Event("click")); await flush(0);
    const perElement = new Map<El, number>();
    for (const a of animations) if (a.playState === "running") perElement.set(a.element, (perElement.get(a.element) ?? 0) + 1);
    expect([...perElement.values()].every((n) => n === 1)).toBe(true);
    expect(animations.filter((a) => a.playState === "idle").length).toBeGreaterThan(0);
    expect($("#temperature-chart").htmlWrites).toBe(1); // replay não refaz dados
  });

  it("pausar finaliza as animações em curso e novas apresentações não criam efeitos", async () => {
    await enterViewport();
    expect(animations.some((a) => a.playState === "running")).toBe(true);
    window.dispatchEvent(Object.assign(new Event("minefy-motion"), { detail: { paused: true } }));
    expect(animations.every((a) => a.playState !== "running")).toBe(true);
    const count = animations.length;
    $("#command-replay").dispatchEvent(new Event("click")); await flush(0);
    expect(animations).toHaveLength(count);
    window.dispatchEvent(Object.assign(new Event("minefy-motion"), { detail: { paused: false } }));
    $("#command-replay").dispatchEvent(new Event("click")); await flush(0);
    expect(animations.length).toBeGreaterThan(count);
  });

  it("com a aba oculta nenhuma animação é criada; os dados continuam íntegros", async () => {
    (doc as unknown as { hidden: boolean }).hidden = true;
    await enterViewport();
    expect(animations).toHaveLength(0);
    expect($("#command-oil").innerHTML).toContain("108");
  });
});

describe("interações do dashboard", () => {
  it("seis seleções atualizam valores e marcadores; os números não mudam sem interação", async () => {
    await enterViewport();
    const ids = ["TR-001", "TR-014", "EX-007", "DT-003", "LV-004", "SC-005"];
    const select = $("#command-asset-select");
    const seen: string[] = [];
    for (const id of ids) {
      select.value = id; select.dispatchEvent(new Event("change")); await flush(0);
      seen.push($("#command-oil").innerHTML);
      expect($("#asset-detail-heading").textContent).toBe(id);
      const marker = $("#command-markers").querySelectorAll(".equipment-marker").find((m) => m.dataset.asset === id)!;
      expect(marker.getAttribute("aria-pressed")).toBe("true");
    }
    expect(new Set(seen).size).toBeGreaterThan(1);
    const before = $("#command-oil").innerHTML;
    await flush(5000);
    expect($("#command-oil").innerHTML).toBe(before);
    const ex = $("#command-markers").querySelectorAll(".equipment-marker").find((m) => m.dataset.asset === "EX-007")!;
    ex.dispatchEvent(new Event("click")); await flush(0);
    expect($("#asset-detail-heading").textContent).toBe("EX-007");
  });

  it("zoom limita em 1,8, restaurar volta a 1,05 e TR-001; janela 2 h redesenha com 120 minutos", async () => {
    await enterViewport();
    for (let i = 0; i < 5; i++) $("#map-zoom-in").dispatchEvent(new Event("click"));
    expect($("#map-zoom-in").disabled).toBe(true);
    expect($("#command-map-world").style.transform).toContain("scale(1.8");
    $("#map-reset").dispatchEvent(new Event("click"));
    expect($("#command-map-world").style.transform).toContain("scale(1.05)");
    expect($("#asset-detail-heading").textContent).toBe("TR-001");
    doc.querySelectorAll("[data-window]").find((b) => b.dataset.window === "120")!.dispatchEvent(new Event("click"));
    expect($("#temperature-chart").getAttribute("aria-label")).toContain("janela de 120 minutos");
    expect($("#temperature-chart").htmlWrites).toBe(3); // seleção inicial, restaurar, janela — nunca por rolagem
  });
});
