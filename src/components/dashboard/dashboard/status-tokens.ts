import type { ConversationPriority, ConversationSource, ConversationStatus } from "@/types/dashboard";

// Every className here resolves to a token in globals.css — no raw hex anywhere downstream.
// `badgeClass` is meant to be passed as `className` on the shadcn <Badge variant="outline" />.

interface Token {
  label: string;
  dot: string;
  text: string;
  badgeClass: string;
}

export const STATUS_TOKENS: Record<ConversationStatus, Token> = {
  OPEN: {
    label: "Open",
    dot: "bg-signal",
    text: "text-signal-ink",
    badgeClass: "border-transparent bg-signal-tint text-signal-ink",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-amber",
    text: "text-amber-ink",
    badgeClass: "border-transparent bg-amber-tint text-amber-ink",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    badgeClass: "border-transparent bg-muted text-muted-foreground",
  },
};

export const PRIORITY_TOKENS: Record<ConversationPriority, Token> = {
  LOW: {
    label: "Low",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    badgeClass: "border-transparent bg-muted text-muted-foreground",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-indigo",
    text: "text-indigo-dark",
    badgeClass: "border-transparent bg-indigo-tint text-indigo-dark",
  },
  HIGH: {
    label: "High",
    dot: "bg-amber",
    text: "text-amber-ink",
    badgeClass: "border-transparent bg-amber-tint text-amber-ink",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-danger",
    text: "text-danger",
    badgeClass: "border-transparent bg-danger-tint text-danger",
  },
};

export const SOURCE_TOKENS: Record<ConversationSource, Token> = {
  AI: {
    label: "AI",
    dot: "bg-indigo",
    text: "text-indigo-dark",
    badgeClass: "border-transparent bg-indigo-tint text-indigo-dark",
  },
  AGENT: {
    label: "Agent",
    dot: "bg-ink",
    text: "text-ink",
    badgeClass: "border-line bg-muted text-ink",
  },
};

export const STATUS_ORDER: ConversationStatus[] = ["OPEN", "PENDING", "CLOSED"];
export const PRIORITY_ORDER: ConversationPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const SOURCE_ORDER: ConversationSource[] = ["AI", "AGENT"];
