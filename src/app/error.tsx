"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bot, User, RotateCw, Home } from "lucide-react";

/**
 * app/error.tsx
 *
 * Next requires this to be a client component. Written as the moment the
 * AI agent hits a wall and hands off to a human — on-brand for PulseDesk's
 * "AI-first, human handoff" story, and it reuses the same console frame
 * as loading.tsx / not-found.tsx.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface shadow-widget">
        <div className="flex items-center gap-3 bg-brand-panel px-5 py-4">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo">
              <Bot className="h-4.5 w-4.5 text-paper" strokeWidth={2} />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-panel bg-amber">
              <User className="h-2.5 w-2.5 text-brand-panel" strokeWidth={2.5} />
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">PulseDesk Agent</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              <span className="text-xs text-paper/60">Handing off…</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <span className="inline-block rounded-full bg-danger-tint px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-danger">
            Connection lost
          </span>

          <div className="space-y-2">
            <div className="rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
              Something interrupted the connection on our end. Nothing on your side caused this.
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
              I&apos;m looping in a human to take a closer look — meanwhile, you can try reconnecting.
            </div>
          </div>

          {error.digest && (
            <p className="font-mono text-[11px] text-muted-foreground">Reference: {error.digest}</p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-3.5 py-2 text-xs font-medium text-paper transition-colors hover:bg-indigo-dark"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-indigo hover:bg-indigo-tint hover:text-indigo-dark"
            >
              <Home className="h-3.5 w-3.5" />
              Go home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
