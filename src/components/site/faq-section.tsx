import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is PulseDesk really free?",
    a: "Yes — the core platform is free. You bring your own FAQ content and we handle the widget, real-time chat, and AI matching.",
  },
  {
    q: "What happens if the AI doesn't know the answer?",
    a: "If nothing in your knowledge base is a close enough match, the visitor is told an agent will follow up, and the conversation is queued for the next agent who logs in.",
  },
  {
    q: "Can customers tell they're talking to AI?",
    a: "Every AI reply is labeled as such in the widget. Once an agent claims the conversation, replies come from them directly.",
  },
  {
    q: "How is my company's data kept separate from others?",
    a: "Every record — conversations, FAQs, agents — is scoped by your site-id down to the database row. Nothing is shared across companies.",
  },
  {
    q: "Do I need to install anything besides the script tag?",
    a: "No. The tag loads the widget, connects it over WebSockets, and ties it to your dashboard automatically.",
  },
];

export function FaqSection() {
  return (
    <section id="pricing" className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
      <div className="mb-10 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-indigo">
          Questions, answered
        </span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          The FAQ, appropriately enough
        </h2>
      </div>

      <Accordion type="single" collapsible className="rounded-2xl border border-line bg-surface px-6">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
