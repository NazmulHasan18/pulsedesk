"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidgetDemo } from "@/components/site/chat-widget-demo";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--line-strong) bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            Free while your team is in beta
          </div>

          <h1 className="font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Support chat that
            <br />
            <span className="relative inline-block">
              answers itself
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9.5C60 3 240 3 298 9.5"
                  stroke="var(--amber)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            when you can&apos;t.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            One script tag turns your site into a live support desk. Your AI answers from your own FAQs the
            second an agent isn&apos;t around — and drafts the reply when one is.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg">
              Add PulseDesk to your site
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch it answer a question
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 border-t border-line pt-6 text-sm text-muted-foreground">
            <div>
              <div className="font-display text-2xl font-semibold text-ink">1 line</div>
              <div>of code to install</div>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <div className="font-display text-2xl font-semibold text-ink">&lt;400ms</div>
              <div>AI response time</div>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <div className="font-display text-2xl font-semibold text-ink">$0</div>
              <div>to get started</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="animate-float-slow"
        >
          <ChatWidgetDemo />
        </motion.div>
      </div>
    </section>
  );
}
