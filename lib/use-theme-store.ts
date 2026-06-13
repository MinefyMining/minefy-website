"use client";

import { useSyncExternalStore } from "react";

/**
 * Theme + mount hooks built on `useSyncExternalStore` — the hydration-safe way
 * to read browser-only state without a `setState`-in-effect mounted-gate.
 *
 * The active theme lives on `document.documentElement` as the `light` class
 * (toggled by the inline script in the root layout and by `ThemeToggle`). These
 * hooks subscribe to that single source of truth instead of duplicating a
 * `useState` + `MutationObserver`/effect per component.
 */

/** Subscribe to `class` changes on <html> via a single MutationObserver. */
function subscribeToHtmlClass(onChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/** Client snapshot: is the light theme currently active? */
function getIsLightSnapshot(): boolean {
  return document.documentElement.classList.contains("light");
}

/** Server snapshot: dark is the default, matching SSR/first paint. */
function getIsLightServerSnapshot(): boolean {
  return false;
}

/**
 * `true` when the `light` theme is active on <html>, kept in sync via a
 * MutationObserver. Hydration-safe: SSR and the first client render both
 * return `false` (dark), so there is no mismatch.
 */
export function useIsLight(): boolean {
  return useSyncExternalStore(
    subscribeToHtmlClass,
    getIsLightSnapshot,
    getIsLightServerSnapshot
  );
}

const noopSubscribe = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

/**
 * Hydration-safe mounted gate. Returns `false` during SSR and the first client
 * render, then `true` once mounted — without a `setState` inside an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    getMountedSnapshot,
    getMountedServerSnapshot
  );
}
