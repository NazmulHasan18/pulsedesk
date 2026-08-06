import { Bot } from "lucide-react";

/**
 * app/loading.tsx
 *
 * Framed as PulseDesk's own widget "connecting" state rather than a bare
 * spinner — the product is AI-first support, so the loading state doubles
 * as a small demo of what a customer sees when a session opens.
 *
 * Pure CSS animation (pulse-ring, float-slow, animate-bounce), no client
 * JS needed — keeps this a server component and keeps it instant.
 */
export default function Loading() {
  const ticker = [
    "Opening a secure session",
    "Loading your workspace",
    "Syncing conversation history",
    "Almost there",
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 py-24">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface shadow-widget">
        {/* header — mirrors the real widget header */}
        <div className="flex items-center gap-3 bg-brand-panel px-5 py-4">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo animate-float-slow">
            <Bot className="h-4.5 w-4.5 text-paper" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">PulseDesk Agent</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="pulse-ring relative inline-flex h-1.5 w-1.5 rounded-full bg-amber"
                  style={{ color: "var(--amber)" }}
                />
              </span>
              <span className="text-xs text-paper/60">Connecting…</span>
            </div>
          </div>
        </div>

        {/* body — a single "typing" bubble */}
        <div className="space-y-3 p-6">
          <p className="font-display text-lg leading-snug text-ink">Setting up your workspace</p>

          <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>

        {/* status ticker */}
        <div className="overflow-hidden border-t border-line bg-paper/60 py-2.5">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-signal" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
