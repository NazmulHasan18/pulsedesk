import type { ReactNode } from "react";
import type { ConversationDetail } from "@/types/conversation";
import { customerName, initials, timeAgo } from "./format";

export function CustomerPanel({
  conversation,
}: {
  conversation: ConversationDetail;
}) {
  const { customer } = conversation;
  const name = customerName(customer);
  const pageUrl =
    typeof customer.metadata?.pageUrl === "string"
      ? customer.metadata.pageUrl
      : null;

  return (
    <aside
      className="hidden w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l border-line p-5 xl:flex"
      aria-label="Customer"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-ink">
          {initials(name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {customer.email ?? "No email shared"}
          </p>
        </div>
      </div>

      <dl className="grid gap-3 text-sm">
        <Row label="First seen">{timeAgo(customer.createdAt)}</Row>
        <Row label="Conversations">
          {conversation.customerConversationCount}
        </Row>
        <Row label="This chat started">{timeAgo(conversation.createdAt)}</Row>
        {pageUrl && (
          <Row label="Page">
            <span className="break-all">{pageUrl}</span>
          </Row>
        )}
        <Row label="Visitor ID">
          <span className="break-all font-mono text-xs">
            {customer.externalId}
          </span>
        </Row>
      </dl>

      {conversation.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {conversation.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-ink"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
