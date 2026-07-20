"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Signature element: a small ambient "resolution thread" that cross-fades
 * between the two status beats PulseDesk uses everywhere else in the
 * product (signal = human agent, amber = AI). On the marketing page this
 * status language shows up in the widget demo, feature icons, and the
 * resolution donut — reusing it here (instead of a generic testimonial
 * quote) ties the auth screen back to the actual product instead of
 * reading as a stock split-page template.
 */
const beats = [
  {
    key: "human",
    dotVar: "var(--signal)",
    tintVar: "var(--signal-tint)",
    inkVar: "var(--signal-ink)",
    label: "Amara · human agent",
    line: "\u201cHappy to take a look at your invoice \u2014 one sec.\u201d",
  },
  {
    key: "ai",
    dotVar: "var(--amber)",
    tintVar: "var(--amber-tint)",
    inkVar: "var(--amber-ink)",
    label: "PulseDesk AI · answered instantly",
    line: "\u201cYour invoice is available under Billing \u2192 History.\u201d",
  },
] as const;

function ResolutionThread() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % beats.length);
    }, 3200);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const beat = beats[prefersReducedMotion ? 0 : active];

  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-4 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={beat.key}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-start gap-3"
        >
          <span
            className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: beat.dotVar }}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide" style={{ color: beat.dotVar }}>
              {beat.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">{beat.line}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(75,79,224,0.12),transparent_35%),linear-gradient(180deg,var(--paper),var(--paper))] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Brand / signature panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,var(--brand-panel),var(--brand-panel-2))] px-10 py-10 text-white lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />

          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 font-display text-lg font-medium text-white"
          >
            <MessageCircle className="h-5 w-5" style={{ color: "var(--amber)" }} />
            PulseDesk
          </Link>

          <div className="relative z-10 max-w-sm">
            <p className="text-sm font-medium uppercase tracking-wider text-white/50">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-white">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{subtitle}</p>

            <div className="mt-8">
              <ResolutionThread />
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/35">
            One conversation. A human agent or an instant AI answer - your customer never has to know which.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-8 lg:py-8">
          <div className="relative w-full max-w-124 overflow-hidden rounded-[2rem] border border-line/70 bg-surface/95 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:px-8 sm:py-10">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--indigo),transparent)] opacity-60"
            />

            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 font-display text-lg font-medium text-foreground lg:hidden"
            >
              <MessageCircle className="h-5 w-5" style={{ color: "var(--amber)" }} />
              PulseDesk
            </Link>

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>

            <div className={cn("mt-8")}>{children}</div>

            <div className="mt-6 border-t border-line/70 pt-5 text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
