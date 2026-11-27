import { baseApi, runRequest } from "../base-api";
import { ConversationService, type InboxAction } from "@/services/conversation.service";
import type { ConversationDetail, InboxCounts, InboxPage, InboxView } from "@/types/conversation";

type AuthArgs = { token?: string };

// Inbox lists and counts are refreshed by invalidating "Inbox" whenever a
// realtime event arrives (see RealtimeProvider). Message panes keep their
// own live state (useConversationMessages).
export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inbox: builder.query<InboxPage, AuthArgs & { view: InboxView }>({
      queryFn: ({ view, token }) => runRequest(ConversationService.inbox(view, token)),
      providesTags: ["Inbox"],
    }),
    inboxCounts: builder.query<InboxCounts, AuthArgs>({
      queryFn: ({ token }) => runRequest(ConversationService.counts(token)),
      providesTags: ["Inbox"],
    }),
    conversation: builder.query<ConversationDetail, AuthArgs & { publicId: string }>({
      queryFn: ({ publicId, token }) => runRequest(ConversationService.detail(publicId, token)),
      providesTags: (_result, _error, { publicId }) => [{ type: "Conversation", id: publicId }],
    }),
    conversationAction: builder.mutation<unknown, AuthArgs & { publicId: string; action: InboxAction }>({
      queryFn: ({ publicId, action, token }) => runRequest(ConversationService.action(publicId, action, token)),
      invalidatesTags: (_result, _error, { publicId }) => ["Inbox", { type: "Conversation", id: publicId }],
    }),
    assignConversation: builder.mutation<unknown, AuthArgs & { publicId: string; agentPublicId: string | null }>({
      queryFn: ({ publicId, agentPublicId, token }) =>
        runRequest(ConversationService.assign(publicId, agentPublicId, token)),
      invalidatesTags: (_result, _error, { publicId }) => ["Inbox", { type: "Conversation", id: publicId }],
    }),
  }),
});

export const {
  useInboxQuery,
  useInboxCountsQuery,
  useConversationQuery,
  useConversationActionMutation,
  useAssignConversationMutation,
} = conversationsApi;
