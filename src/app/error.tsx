"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, User, RotateCw, Home, Copy, Check } from "lucide-react";

/**
 * app/error.tsx
 *
 * Revision note: the previous draft labeled this "Connection lost," but
 * error.tsx catches any render/runtime crash — most of the time it has
 * nothing to do with the network (that case is handled by
 * OfflineScreen). Copy here is now accurate to what actually happened,
 * and the layout leans more editorial/premium than "chat bubble."
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  async function copyReference() {
    if (!error.digest) return;
    try {
      await navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-144 w-xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface shadow-panel-soft">
        {/* premium accent line */}
        <div
          aria-hidden
          className="h-0.75 w-full"
          style={{
            background: "linear-gradient(90deg, var(--danger) 0%, var(--amber) 60%, transparent 100%)",
          }}
        />

        {/* identity strip — small, not the whole story this time */}
        <div className="flex items-center gap-3 px-7 pt-6">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-tint">
              <Bot className="h-4 w-4 text-indigo" strokeWidth={2} />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface bg-amber">
              <User className="h-2 w-2 text-brand-panel" strokeWidth={3} />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-tint px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-wide text-amber-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            Escalated to a human
          </span>
        </div>

        {/* editorial body */}
        <div className="space-y-2.5 px-7 pb-2 pt-5">
          <h1 className="font-display text-[1.5rem] font-medium leading-tight text-ink">
            Something went wrong on our end
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This wasn&apos;t caused by anything you did. The error&apos;s already been logged, and a real
            person will take a look shortly.
          </p>
        </div>

        {error.digest && (
          <div className="mx-7 mt-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3.5 py-2.5">
            <div className="min-w-0">
              <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Reference</p>
              <p className="truncate font-mono text-xs text-ink">{error.digest}</p>
            </div>
            <button
              onClick={copyReference}
              aria-label="Copy error reference"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line-strong text-muted-foreground transition-colors hover:border-indigo hover:text-indigo"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-signal-ink" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 px-7 pb-7 pt-6">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-4 py-2.5 text-xs font-medium text-paper shadow-launcher transition-colors hover:bg-indigo-dark hover:shadow-launcher-hover"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-indigo hover:bg-indigo-tint hover:text-indigo-dark"
          >
            <Home className="h-3.5 w-3.5" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
