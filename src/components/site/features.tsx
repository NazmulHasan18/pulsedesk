import { Radio, BrainCircuit, Building2, MessagesSquare, ShieldCheck, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Radio,
    title: "Real presence, not polling",
    body: "Socket.io keeps agent status and message delivery instant — visitors see exactly when someone's actually there.",
    tint: "signal",
  },
  {
    icon: BrainCircuit,
    title: "RAG over your own FAQs",
    body: "Your knowledge base is embedded with pgvector, so answers are grounded in what your company actually says — not generic web knowledge.",
    tint: "amber",
  },
  {
    icon: Building2,
    title: "Multi-tenant by design",
    body: "Every conversation, FAQ, and agent is scoped by site-id → companyId. Hundreds of businesses, one platform, zero crossover.",
    tint: "indigo",
  },
  {
    icon: MessagesSquare,
    title: "Drafts, not replacements",
    body: "When an agent is online, the AI prepares a suggested reply from the knowledge base — the human still sends it.",
    tint: "signal",
  },
  {
    icon: Gauge,
    title: "A queue agents can actually clear",
    body: "Conversations are claimable, not assigned blindly — agents pick up what they can handle, and nothing sits untouched.",
    tint: "amber",
  },
  {
    icon: ShieldCheck,
    title: "One panel to oversee it all",
    body: "As the platform owner, monitor every company's usage and AI-vs-agent resolution split, and suspend accounts in one click.",
    tint: "indigo",
  },
];

const tintMap: Record<string, string> = {
  signal: "bg-[var(--signal-tint)] text-[var(--signal-ink)]",
  amber: "bg-[var(--amber-tint)] text-[var(--amber-ink)]",
  indigo: "bg-[var(--indigo-tint)] text-[var(--indigo)]",
};

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-14 max-w-xl">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-indigo">Under the hood</span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Built like the tools you already pay for
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything Intercom or Zendesk gives you for the live-chat piece — without the seat-based pricing.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card
            key={f.title}
            className="group p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(20,23,28,0.25)]"
          >
            <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${tintMap[f.tint]}`}>
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-medium">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
