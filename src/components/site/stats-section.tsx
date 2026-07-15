"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, User } from "lucide-react";

const AI_SHARE = 68;

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const circumference = 2 * Math.PI * 70;
  const aiLength = (AI_SHARE / 100) * circumference;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid items-center gap-14 rounded-3xl border border-line bg-surface p-10 lg:grid-cols-2 lg:p-16">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-indigo">
            Super-admin panel
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            See who&apos;s actually answering
          </h2>
          <p className="mt-4 max-w-md text-muted leading-relaxed">
            Every company&apos;s AI-vs-agent resolution split, usage, and status lives in one panel — so you
            can spot a company that needs more FAQ coverage before they notice it themselves.
          </p>

          <div className="mt-8 flex gap-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--amber-tint) text-(--amber-ink)">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-lg font-medium">{AI_SHARE}%</div>
                <div className="text-xs text-muted">Resolved by AI</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--signal-tint) text-(--signal-ink)">
                <User className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-lg font-medium">{100 - AI_SHARE}%</div>
                <div className="text-xs text-muted">Resolved by agents</div>
              </div>
            </div>
          </div>
        </div>

        <div ref={ref} className="flex justify-center">
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--signal-tint)" strokeWidth="16" />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--amber)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset: inView ? circumference - aiLength : circumference,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold">{AI_SHARE}%</span>
              <span className="text-xs text-muted">AI resolution</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
