"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, BookOpen, Inbox } from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-indigo">
            Company dashboard
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Everything your team needs, one hub
          </h2>
        </div>
      </div>

      <Tabs defaultValue="widget">
        <div className="w-full overflow-x-auto">
          <TabsList className="w-max min-w-fit whitespace-nowrap">
            <TabsTrigger value="widget">
              <Palette className="h-2.5 w-2.5" /> Widget
            </TabsTrigger>
            <TabsTrigger value="faq">
              <BookOpen className="h-3.5 w-3.5" /> Knowledge base
            </TabsTrigger>
            <TabsTrigger value="inbox">
              <Inbox className="h-3.5 w-3.5" /> Agent inbox
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="widget">
          <div className="grid gap-6 rounded-2xl border border-line bg-surface p-8 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-medium">Match the widget to your brand</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Set accent color, welcome message, and corner position — changes reflect on your live site
                instantly, no redeploy needed.
              </p>
              <div className="mt-6 space-y-4">
                <Field label="Accent color">
                  <div className="flex gap-2">
                    {["#4B4FE0", "#1F9D68", "#D98A1F", "#14171C"].map((c) => (
                      <span
                        key={c}
                        className="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-line"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Welcome message">
                  <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-muted">
                    Hi! Ask us anything about your order.
                  </div>
                </Field>
                <Field label="Position">
                  <div className="flex gap-2 text-xs">
                    <span className="rounded-full bg-ink px-3 py-1.5 text-paper">Bottom right</span>
                    <span className="rounded-full border border-(--line-strong) px-3 py-1.5">
                      Bottom left
                    </span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-xl bg-[#fbfaf7] p-6">
              <div className="w-full max-w-55 rounded-xl border border-line bg-white p-3 shadow-lg">
                <div className="mb-2 h-6 w-full rounded-md bg-indigo" />
                <div className="space-y-1.5">
                  <div className="h-2 w-3/4 rounded-full bg-line" />
                  <div className="h-2 w-1/2 rounded-full bg-line" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h3 className="font-display text-xl font-medium">Your knowledge base, searchable by meaning</h3>
            <p className="mt-2 max-w-lg text-sm text-muted leading-relaxed">
              Add a doc, and it&apos;s embedded automatically. The AI matches on intent, not keywords —
              &quot;where&apos;s my package&quot; finds your shipping FAQ even without those words.
            </p>
            <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-white">
              {[
                { q: "What's your return policy?", tag: "Returns", matches: 128 },
                { q: "How long does shipping take?", tag: "Shipping", matches: 96 },
                { q: "Do you offer gift wrapping?", tag: "Orders", matches: 41 },
              ].map((row) => (
                <div key={row.q} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                  <span className="font-medium">{row.q}</span>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="rounded-full bg-(--indigo-tint) px-2.5 py-1 text-indigo">{row.tag}</span>
                    <span>{row.matches} matches this month</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inbox">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h3 className="font-display text-xl font-medium">Claim, don&apos;t get assigned</h3>
            <p className="mt-2 max-w-lg text-sm text-muted leading-relaxed">
              Every open conversation sits in a shared queue with an AI-drafted reply attached. Agents claim
              what they can take on.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { name: "Priya — refund question", wait: "2m wait", draft: true },
                { name: "Unassigned — sizing help", wait: "40s wait", draft: true },
                { name: "Sam — shipping delay", wait: "5m wait", draft: false },
              ].map((row) => (
                <div key={row.name} className="rounded-xl border border-line bg-white p-4">
                  <div className="text-sm font-medium">{row.name}</div>
                  <div className="mt-1 text-xs text-muted">{row.wait}</div>
                  {row.draft && (
                    <div className="mt-3 rounded-lg bg-(--amber-tint) px-2.5 py-1.5 text-[11px] text-(--amber-ink)">
                      AI draft ready
                    </div>
                  )}
                  <button className="mt-3 w-full rounded-full bg-ink py-1.5 text-xs font-medium text-paper">
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted">{label}</div>
      {children}
    </div>
  );
}
