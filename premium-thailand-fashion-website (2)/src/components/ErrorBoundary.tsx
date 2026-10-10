import React, { Component, type ReactNode } from "react";

/* ============================================================
   ErrorBoundary — if any section throws during render, show a
   recoverable message instead of a blank page. This is what
   prevents the whole site from going white/black on one bug.
   ============================================================ */

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the real cause in the console for debugging.
    console.error("[TOMSTILL] render error:", error, info.componentStack);
  }

  private reload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        className="relative flex min-h-screen flex-col items-center justify-center gap-5 bg-void px-6 text-center text-paper noise"
        role="alert"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/12 blur-[130px]" />

        <div className="relative">
          <p className="label-caps text-clay">Something went wrong</p>
          <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
            TOMSTILL
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/60">
            A section failed to render. Reloading usually fixes it — if it
            persists, the error below points to the cause.
          </p>

          <pre className="mx-auto mt-6 max-w-lg overflow-auto rounded-2xl border border-paper/12 bg-cream/70 p-4 text-left text-[11px] leading-relaxed text-paper/60">
            {error.message || String(error)}
          </pre>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.reload}
              className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-clay-deep glow-soft"
            >
              Reload the site
            </button>
            <a
              href="#/"
              onClick={this.reload}
              className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-clay hover:text-clay"
            >
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
}
