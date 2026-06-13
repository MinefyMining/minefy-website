"use client";

import { Component, type ReactNode } from "react";
import { Tablet } from "lucide-react";

/**
 * Static fallback shown when WebGL is unavailable, the 3D scene errors, or the
 * scene hasn't been requested yet (viewport-gated lazy load).
 */
export function TabletFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="gradient-border relative flex aspect-[3/4] w-40 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-b from-[#161310] to-[#0A0A0A]">
        <span
          className="absolute inset-0 rounded-2xl"
          style={{ background: "radial-gradient(circle at 50% 35%, rgba(212,168,71,0.18), transparent 65%)" }}
          aria-hidden="true"
        />
        <Tablet className="relative h-14 w-14 text-primary" />
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}
interface State {
  failed: boolean;
}

/** Error boundary around the WebGL scene — degrades gracefully to a static tile. */
export class Safe3D extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <TabletFallback />;
    return this.props.children;
  }
}
