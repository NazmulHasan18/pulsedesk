"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-indigo px-10 py-16 text-center text-white sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Your next visitor is about to
            <br className="hidden sm:block" /> ask a question you&apos;ve answered before.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Let PulseDesk answer it for you — and hand off cleanly the moment it can&apos;t.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="default" size="lg" className="bg-white text-indigo hover:bg-white/90">
              Get your site-id
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:border-white">
              See a live demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
