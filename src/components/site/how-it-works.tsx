"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Search, Users2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    n: "01",
    title: "Embed",
    icon: Code2,
    summary: "Paste one script tag, scoped to your site-id.",
    detail:
      "Every business gets a unique site-id. Drop the embed script in your layout and the widget appears — fonts, colors, and position match your brand automatically.",
  },
  {
    n: "02",
    title: "Ask",
    icon: Search,
    summary: "A visitor messages. The AI searches your FAQs.",
    detail:
      "Each question is embedded and matched against your company's FAQ knowledge base with vector similarity — no agent needs to be watching for it to answer well.",
  },
  {
    n: "03",
    title: "Route",
    icon: Users2,
    summary: "Confident match → AI replies. No match → an agent claims it.",
    detail:
      "If an agent is online, the conversation lands in their queue with an AI-drafted reply ready to send or edit. If nobody's around, the AI answers directly or leaves a note for the morning.",
  },
  {
    n: "04",
    title: "Learn",
    icon: TrendingUp,
    summary: "Every resolved chat sharpens tomorrow's answers.",
    detail:
      "Agents can promote a great reply straight into the FAQ knowledge base, so the AI resolution rate climbs the more your team uses PulseDesk.",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-14 max-w-xl">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-indigo">The pipeline</span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          One message, four decisions
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is the actual path a message takes, from the moment it&apos;s typed to the moment your
          knowledge base gets a little smarter.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {steps.map((step, i) => (
            <button
              key={step.n}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                "flex min-w-55 items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all lg:min-w-0",
                active === i
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface hover:border-(--line-strong)",
              )}
            >
              <span className={cn("font-mono text-xs", active === i ? "text-white/50" : "text-muted-foreground")}>
                {step.n}
              </span>
              <div>
                <div className="font-display text-base font-medium">{step.title}</div>
                <div className={cn("mt-0.5 text-xs", active === i ? "text-white/70" : "text-muted-foreground")}>
                  {step.summary}
                </div>
              </div>
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col justify-center rounded-2xl border border-line bg-surface p-10"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-(--indigo-tint) text-indigo">
            {(() => {
              const Icon = steps[active].icon;
              return <Icon className="h-6 w-6" />;
            })()}
          </div>
          <h3 className="font-display text-2xl font-medium">
            {steps[active].n} — {steps[active].title}
          </h3>
          <p className="mt-3 max-w-lg text-muted-foreground leading-relaxed">{steps[active].detail}</p>
        </motion.div>
      </div>
    </section>
  );
}
