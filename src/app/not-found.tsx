import Link from "next/link";
import { Bot, Home, LifeBuoy } from "lucide-react";

/**
 * app/not-found.tsx
 *
 * Same "agent console" frame as loading.tsx and error.tsx, so the three
 * system pages read as one family. The 404 is written as a ticket the
 * agent couldn't locate, and navigation is offered as chat "quick
 * replies" rather than a generic button row.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface shadow-widget">
        <div className="flex items-center gap-3 bg-brand-panel px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo">
            <Bot className="h-4.5 w-4.5 text-paper" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">PulseDesk Agent</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <span className="text-xs text-paper/60">Online</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <span className="inline-block rounded-full bg-danger-tint px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-danger">
            Ticket #404
          </span>

          <div className="rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
            I searched the whole workspace and couldn&apos;t find this page. It may have moved, or the link
            might be off — either way, nothing on your end is broken.
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-indigo hover:bg-indigo-tint hover:text-indigo-dark"
            >
              <Home className="h-3.5 w-3.5" />
              Go home
            </Link>
            <a
              href="mailto:support@pulsedesk.app"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-indigo hover:bg-indigo-tint hover:text-indigo-dark"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Contact support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
