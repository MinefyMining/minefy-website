/**
 * media.js — política de carregamento das cenas (WEBSITE-QA-20261011).
 * Cobre comportamento, não strings: escolha de variante pela área real de
 * `cover` × densidade × zoom, deadline explícito com limpeza da própria
 * entrada (callback tardio nunca apaga tentativa nova), deduplicação em voo e
 * decodificação do elemento efetivamente exibido.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeImage {
  static instances: FakeImage[] = [];
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  src = ""; srcset = ""; sizes = ""; decoding = ""; fetchPriority = ""; currentSrc = "";
  naturalWidth = 0;
  constructor() { FakeImage.instances.push(this); }
  decode() { return Promise.resolve(); }
  load(width = 1672) { this.naturalWidth = width; this.currentSrc = this.src; this.onload?.(); }
  fail() { this.onerror?.(); }
}

class FakeElement extends EventTarget {
  src = ""; complete = false; naturalWidth: number | undefined = undefined;
  decodeImpl: (() => Promise<void>) | undefined;
  decode() { return this.decodeImpl ? this.decodeImpl() : Promise.resolve(); }
}

type Media = typeof import("../public/media.js");
let media: Media;
const flush = (ms = 0) => vi.advanceTimersByTimeAsync(ms);

beforeEach(async () => {
  vi.useFakeTimers();
  FakeImage.instances = [];
  vi.stubGlobal("Image", FakeImage);
  vi.stubGlobal("innerWidth", 1280);
  vi.stubGlobal("devicePixelRatio", 1);
  vi.stubGlobal("navigator", {});
  vi.stubGlobal("document", { hidden: false });
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.resetModules();
  media = await import("../public/media.js");
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

const spec = {
  src: "plant-1672.webp",
  srcset: "plant-900.webp 900w, plant-1672.webp 1672w",
  variants: [{ width: 1672, url: "plant-1672.webp", bytes: 1 }, { width: 900, url: "plant-900.webp", bytes: 1 }],
};

describe("selectVariant — resolução pela área real de cover", () => {
  it("390×844 em modo retrato exige a variante 1672 (a altura dita a largura do cover)", () => {
    // Quadro móvel: inset -1% -28% sobre 390×844 → ~608×861 px CSS.
    const chosen = media.selectVariant(spec, { width: 608, height: 861, aspect: 1672 / 941, dpr: 1, zoom: 1 });
    expect(chosen.width).toBe(1672);
    expect(chosen.required).toBeGreaterThan(1500);
  });

  it("um quadro pequeno recebe 900 e um DPR 2 promove para 1672 sem inventar detalhe além da fonte", () => {
    expect(media.selectVariant(spec, { width: 600, height: 300, dpr: 1 }).width).toBe(900);
    const dense = media.selectVariant(spec, { width: 600, height: 300, dpr: 2 });
    expect(dense.width).toBe(1672);
    const beyond = media.selectVariant(spec, { width: 1280, height: 720, dpr: 3, zoom: 1.3 });
    expect(beyond.width).toBe(1672); // maior fonte disponível; densidade limitada a 2×
    expect(beyond.detail).toBeLessThan(1); // sinaliza que a câmera deve conter a aproximação
  });

  it("o zoom máximo do capítulo entra no cálculo e `saveData` escolhe a menor variante", () => {
    expect(media.selectVariant(spec, { width: 800, height: 450, dpr: 1, zoom: 1 }).width).toBe(900);
    expect(media.selectVariant(spec, { width: 800, height: 450, dpr: 1, zoom: 1.3 }).width).toBe(1672);
    expect(media.selectVariant(spec, { width: 1280, height: 720, dpr: 2, economy: true }).width).toBe(900);
  });
});

describe("prepareImage — deadline, limpeza e deduplicação", () => {
  const key = "cinema/plant";
  const variant = { url: "assets/optimized/cinema-plant-900.18c2de5e07.webp", width: 900, required: 0, detail: 1 };

  it("rejeita com TimeoutError no prazo e libera a entrada: a nova tentativa cria um novo download", async () => {
    const first = media.prepareImage(key, { variant, timeout: media.sceneTimeout });
    const rejected = vi.fn();
    first.catch(rejected);
    await flush(media.sceneTimeout - 1);
    expect(rejected).not.toHaveBeenCalled();
    await flush(1);
    expect(rejected).toHaveBeenCalledOnce();
    expect(rejected.mock.calls[0][0].name).toBe("TimeoutError");
    expect(FakeImage.instances).toHaveLength(1);
    // O download travado é cancelado no prazo (sem src), para não segurar a conexão.
    expect(FakeImage.instances[0].src).toBe("");

    const second = media.prepareImage(key, { variant, timeout: media.sceneTimeout });
    expect(FakeImage.instances).toHaveLength(2);
    // A nova tentativa usa outra URL: o navegador não reaproveita a transferência que travou.
    expect(FakeImage.instances[1].src).toBe(`${variant.url}?retry=1`);
    // Callback tardio do primeiro download não resolve nem apaga a tentativa nova.
    FakeImage.instances[0].load();
    await flush(0);
    const settled = vi.fn();
    second.then(settled, settled);
    await flush(0);
    expect(settled).not.toHaveBeenCalled();
    FakeImage.instances[1].load();
    await flush(0);
    expect(settled).toHaveBeenCalledWith(`${variant.url}?retry=1`);
  });

  it("rejeita em erro de download e permite repetir; sucesso resolve com a URL decodificada", async () => {
    const failed = media.prepareImage(key, { variant });
    const onError = vi.fn();
    failed.catch(onError);
    FakeImage.instances[0].fail();
    await flush(0);
    expect(onError).toHaveBeenCalledOnce();
    const retry = media.prepareImage(key, { variant });
    expect(FakeImage.instances).toHaveLength(2);
    FakeImage.instances[1].load();
    await expect(retry).resolves.toBe(variant.url);
  });

  it("dois pedidos da mesma variante em voo compartilham um único download", async () => {
    const a = media.prepareImage(key, { variant });
    const b = media.prepareImage(key, { variant, priority: "high" });
    expect(FakeImage.instances).toHaveLength(1);
    expect(FakeImage.instances[0].fetchPriority).toBe("high");
    FakeImage.instances[0].load();
    await expect(Promise.all([a, b])).resolves.toEqual([variant.url, variant.url]);
    // Concluído, um novo pedido volta a baixar (o navegador serve do cache de bytes).
    media.prepareImage(key, { variant });
    expect(FakeImage.instances).toHaveLength(2);
  });

  it("uma imagem que carrega vazia é tratada como falha, não como cena pronta", async () => {
    const empty = media.prepareImage(key, { variant });
    const onError = vi.fn();
    empty.catch(onError);
    FakeImage.instances[0].load(0);
    await flush(0);
    expect(onError).toHaveBeenCalledOnce();
  });

  it("chave desconhecida rejeita sem criar download", async () => {
    await expect(media.prepareImage("cinema/nope", { variant })).rejects.toThrow(/Unknown media/);
    expect(FakeImage.instances).toHaveLength(0);
  });
});

describe("decodeElement — o elemento pintado é o que decide a prontidão", () => {
  it("resolve apenas quando o decode do elemento final termina", async () => {
    const img = new FakeElement();
    let finish!: () => void;
    img.decodeImpl = () => new Promise<void>((resolve) => { finish = resolve; });
    const ready = vi.fn();
    media.decodeElement(img as unknown as HTMLImageElement, 1000).then(ready);
    await flush(0);
    expect(ready).not.toHaveBeenCalled();
    finish();
    await flush(0);
    expect(ready).toHaveBeenCalledWith(img);
  });

  it("rejeita por deadline se o decode nunca termina, e por erro do elemento", async () => {
    const stuck = new FakeElement();
    stuck.decodeImpl = () => new Promise<void>(() => {});
    const timedOut = vi.fn();
    media.decodeElement(stuck as unknown as HTMLImageElement, 500).catch(timedOut);
    await flush(500);
    expect(timedOut).toHaveBeenCalledOnce();
    expect(timedOut.mock.calls[0][0].name).toBe("TimeoutError");

    const broken = new FakeElement();
    broken.decodeImpl = () => new Promise<void>(() => {});
    const errored = vi.fn();
    media.decodeElement(broken as unknown as HTMLImageElement, 5000).catch(errored);
    broken.dispatchEvent(new Event("error"));
    await flush(0);
    expect(errored).toHaveBeenCalledOnce();
  });

  it("um decode rejeitado por um elemento já completo e com pixels ainda conta como pronto", async () => {
    const img = new FakeElement();
    img.complete = true; img.naturalWidth = 1672;
    img.decodeImpl = () => Promise.reject(new Error("EncodingError"));
    await expect(media.decodeElement(img as unknown as HTMLImageElement, 1000)).resolves.toBe(img);
  });
});
