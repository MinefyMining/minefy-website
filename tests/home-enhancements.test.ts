import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deferEnhancement } from "../public/enhancements.js";

class ElementStub extends EventTarget {
  dataset: Record<string, string> = {};
  children: ElementStub[] = [];
  isConnected = true;
  value = "";
  tagName: string;
  parent?: ElementStub;
  click = vi.fn();
  constructor(tag = "SECTION") { super(); this.tagName = tag; }
  setAttribute() {}
  append(child: ElementStub) { child.parent = this; this.children.push(child); }
  prepend(child: ElementStub) { child.parent = this; this.children.unshift(child); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
  contains(target: ElementStub) { return this.children.includes(target); }
  closest(selector: string) {
    if (selector === "[data-enhancement-retry]") return this.dataset.enhancementRetry ? this : null;
    return /^(BUTTON|INPUT|SELECT)$/.test(this.tagName) ? this : null;
  }
}

let section: ElementStub;
let intersect: (entries: { isIntersecting: boolean }[]) => void;
let disconnect = vi.fn<() => void>();
const settle = () => new Promise(resolve => setImmediate(resolve));

beforeEach(() => {
  section = new ElementStub(); disconnect = vi.fn();
  vi.stubGlobal("document", Object.assign(new EventTarget(), {
    querySelectorAll: () => [section],
    getElementById: (id: string) => id === "jornada" ? section : null,
    createElement: (tag: string) => new ElementStub(tag.toUpperCase()),
  }));
  vi.stubGlobal("window", Object.assign(new EventTarget(), { location: { hash: "" } }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof intersect) { intersect = callback; }
    observe() {}
    disconnect() { disconnect(); }
  });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe("progressive home loading", () => {
  it("does not request offscreen features, and deduplicates an entrance while downloading", async () => {
    let finish!: () => void;
    const load = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    const start = deferEnhancement("#jornada", load);
    expect(load).not.toHaveBeenCalled();
    intersect([{ isIntersecting: false }]);
    expect(load).not.toHaveBeenCalled();
    intersect([{ isIntersecting: true }]);
    const pending = start();
    await settle();
    expect(load).toHaveBeenCalledTimes(1);
    finish(); await pending;
    expect(section.dataset.enhancement).toBe("ready");
    expect(disconnect).toHaveBeenCalledOnce();
    await start();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("initializes a direct hash destination without waiting for scroll", async () => {
    window.location.hash = "#jornada";
    const load = vi.fn().mockResolvedValue(undefined);
    deferEnhancement("#jornada", load);
    await settle();
    expect(load).toHaveBeenCalledOnce();
    expect(section.dataset.enhancement).toBe("ready");
  });

  it("replays the first button tap after slow initialization", async () => {
    let finish!: () => void;
    const start = deferEnhancement("#jornada", () => new Promise<void>(resolve => { finish = resolve; }));
    const button = new ElementStub("BUTTON");
    const event = new Event("click", { cancelable: true });
    Object.defineProperty(event, "target", { value: button });
    section.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(button.click).not.toHaveBeenCalled();
    await settle(); finish(); await start(); await settle();
    expect(button.click).toHaveBeenCalledOnce();
  });

  it("preserves the latest input while its module initializes", async () => {
    let finish!: () => void;
    const start = deferEnhancement("#jornada", () => new Promise<void>(resolve => { finish = resolve; }));
    const select = new ElementStub("SELECT"); select.value = "EX-007";
    const changed = vi.fn(); select.addEventListener("change", changed);
    const event = new Event("change", { cancelable: true });
    Object.defineProperty(event, "target", { value: select });
    section.dispatchEvent(event);
    await settle(); select.value = "TR-001"; finish(); await start(); await settle();
    expect(select.value).toBe("EX-007");
    expect(changed).toHaveBeenCalledOnce();
  });

  it("allows retry after a rejected load, without an unhandled rejection", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    const start = deferEnhancement("#jornada", load);
    expect(await start()).toBe(false);
    expect(section.dataset.enhancement).toBe("error");
    expect(section.children).toHaveLength(1);
    expect(await start()).toBe(true);
    expect(section.children).toHaveLength(0);
    expect(section.dataset.enhancement).toBe("ready");
  });
});
