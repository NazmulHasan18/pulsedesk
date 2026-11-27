import { fetcher } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  ConversationDetail,
  ConversationMessage,
  InboxCounts,
  InboxPage,
  InboxView,
} from "@/types/conversation";

export type InboxAction = "claim" | "unclaim" | "resolve" | "reopen";

interface MessagesResponse {
  data: ConversationMessage[];
  meta?: { hasNextPage: boolean; nextCursor: string | null };
}

const path = (publicId: string) => `/conversations/${encodeURIComponent(publicId)}`;

const inbox = (view: InboxView, token?: string): Promise<InboxPage> =>
  fetcher<InboxPage>(`/conversations/inbox?view=${view}&limit=50`, { token });

const counts = async (token?: string): Promise<InboxCounts> =>
  (await fetcher<ApiResponse<InboxCounts>>("/conversations/inbox/counts", { token })).data;

const detail = async (publicId: string, token?: string): Promise<ConversationDetail> =>
  (await fetcher<ApiResponse<ConversationDetail>>(path(publicId), { token })).data;

const action = async (publicId: string, name: InboxAction, token?: string) =>
  (await fetcher<ApiResponse<unknown>>(`${path(publicId)}/${name}`, { method: "POST", token })).data;

// Admin only. null unassigns (the conversation goes back to waiting).
const assign = async (publicId: string, agentPublicId: string | null, token?: string) =>
  (
    await fetcher<ApiResponse<unknown>>(`${path(publicId)}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ agentPublicId }),
      token,
    })
  ).data;

// Latest page (no cursor), an older page (before), or everything after a message (after).
const messages = (publicId: string, query: { before?: string; after?: string }, token?: string) => {
  const params = new URLSearchParams({ limit: "40" });
  if (query.before) params.set("cursor", query.before);
  if (query.after) params.set("after", query.after);
  return fetcher<MessagesResponse>(`${path(publicId)}/messages?${params}`, { token });
};

const sendMessage = async (publicId: string, content: string, clientMessageId: string, token?: string) =>
  (
    await fetcher<ApiResponse<ConversationMessage>>(`${path(publicId)}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, clientMessageId }),
      token,
    })
  ).data;

const markRead = (publicId: string, token?: string) =>
  fetcher(`${path(publicId)}/messages/read`, { method: "PATCH", token });

export const ConversationService = { inbox, counts, detail, action, assign, messages, sendMessage, markRead };
