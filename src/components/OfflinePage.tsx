"use client";

import { useState } from "react";
import { Bot, WifiOff, RotateCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

/**
 * components/offline-screen.tsx
 *
 * Mount once in app/layout.tsx (inside <body>, after your normal
 * children): it renders nothing while online, and takes over the full
 * screen the moment the connection drops — same console-card language
 * as loading.tsx / not-found.tsx / error.tsx, so it reads as one
 * system rather than a generic "you're offline" browser dialog.
 *
 * Retry re-checks reachability manually (useful the instant someone
 * flips wifi back on, before the browser's own event fires).
 */
export function OfflineScreen() {
  const { isOnline, justReconnected } = useOnlineStatus();
  const [checking, setChecking] = useState(false);

  async function handleRetry() {
    setChecking(true);
    try {
      await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
      window.location.reload();
    } catch {
      setChecking(false);
    }
  }

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-paper/95 px-6 backdrop-blur-sm transition-opacity"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface shadow-widget">
        {justReconnected ? (
          <>
            <div className="flex items-center gap-3 bg-brand-panel px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-signal">
                <Bot className="h-4.5 w-4.5 text-paper" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-paper">PulseDesk Agent</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  <span className="text-xs text-paper/60">Back online</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
                Connection restored. Picking up right where we left off.
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-brand-panel px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-danger">
                <WifiOff className="h-4.5 w-4.5 text-paper" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-paper">PulseDesk Agent</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                  <span className="text-xs text-paper/60">Offline</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <span className="inline-block rounded-full bg-danger-tint px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-danger">
                No connection
              </span>

              <div className="rounded-2xl rounded-tl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
                Your connection dropped. I&apos;ll reconnect automatically — or you can try now.
              </div>

              <button
                onClick={handleRetry}
                disabled={checking}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-3.5 py-2 text-xs font-medium text-paper transition-colors hover:bg-indigo-dark disabled:opacity-60"
              >
                <RotateCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
                {checking ? "Checking…" : "Try again"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
