import type { ConversationPriority, ConversationStatus } from "@/types/dashboard";

export type InboxView = "waiting" | "mine" | "all" | "resolved";

export type MessageSender = "CUSTOMER" | "AGENT" | "AI";

export interface ConversationMessage {
  id: string;
  senderType: MessageSender;
  content: string;
  createdAt: string;
  clientMessageId?: string | null;
  readByAgentAt?: string | null;
  readByCustomerAt?: string | null;
}

// A message shown in the pane: saved, or still on its way / failed.
export interface PaneMessage extends ConversationMessage {
  delivery: "sent" | "sending" | "failed";
}

export interface InboxCustomer {
  publicId: string;
  name: string | null;
  email: string | null;
  externalId: string;
}

// One row of GET /conversations/inbox.
export interface InboxConversation {
  publicId: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  labels: string[];
  createdAt: string;
  lastActivityAt: string;
  customer: InboxCustomer;
  assignedAgent: { publicId: string; name: string } | null;
  lastMessage: Pick<ConversationMessage, "id" | "senderType" | "content" | "createdAt"> | null;
  unreadCount: number;
}

export interface InboxCounts {
  waiting: number;
  mine: number;
  all: number;
}

export interface InboxPage {
  data: InboxConversation[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

// GET /conversations/:publicId
export interface ConversationDetail {
  publicId: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  customer: InboxCustomer & { createdAt: string; metadata?: Record<string, unknown> | null };
  assignedAgent: { publicId: string; name: string; email: string } | null;
  customerConversationCount: number;
}
