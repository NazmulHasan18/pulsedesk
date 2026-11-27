"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useAssignConversationMutation,
  useConversationActionMutation,
  useConversationQuery,
  useInboxCountsQuery,
  useInboxQuery,
} from "@/lib/api";
import type { InboxAction } from "@/services/conversation.service";
import type { InboxView } from "@/types/conversation";

export function useInbox(view: InboxView) {
  const { data: s } = useSession();
  return useInboxQuery(
    { view, token: s?.accessToken },
    { skip: !s?.accessToken },
  );
}

// Only agents have an inbox; super admins skip the request.
export function useInboxCounts() {
  const { data: s } = useSession();
  const isAgent = s?.user?.userType === "agent";
  return useInboxCountsQuery(
    { token: s?.accessToken },
    { skip: !s?.accessToken || !isAgent },
  );
}

export function useConversationDetail(publicId: string | null) {
  const { data: s } = useSession();
  return useConversationQuery(
    { publicId: publicId ?? "", token: s?.accessToken },
    { skip: !s?.accessToken || !publicId },
  );
}

const SUCCESS: Record<InboxAction, string> = {
  claim: "Conversation claimed",
  unclaim: "Released to the waiting queue",
  resolve: "Conversation resolved",
  reopen: "Conversation reopened",
};

// Resolves to true when the action succeeded. Server messages (e.g. "Karim
// already claimed this conversation") are shown as they are.
export function useConversationAction() {
  const { data: s } = useSession();
  const [trigger, state] = useConversationActionMutation();
  const run = async (publicId: string, action: InboxAction) => {
    try {
      await trigger({ publicId, action, token: s?.accessToken }).unwrap();
      toast.success(SUCCESS[action]);
      return true;
    } catch (err) {
      toast.error((err as Error)?.message || "Something went wrong");
      return false;
    }
  };
  return { run, isPending: state.isLoading };
}

// Admin assign / transfer / unassign. `agent` is null to unassign. The
// socket event that follows updates everyone else's inbox.
export function useAssignConversation() {
  const { data: s } = useSession();
  const [trigger, state] = useAssignConversationMutation();
  const assign = async (
    publicId: string,
    agent: { publicId: string; name: string } | null,
  ) => {
    try {
      await trigger({
        publicId,
        agentPublicId: agent?.publicId ?? null,
        token: s?.accessToken,
      }).unwrap();
      toast.success(
        agent ? `Assigned to ${agent.name}` : "Unassigned. Back in the waiting queue",
      );
      return true;
    } catch (err) {
      toast.error((err as Error)?.message || "Something went wrong");
      return false;
    }
  };
  return { assign, isPending: state.isLoading };
}

// Who is looking at the inbox.
export function useInboxViewer() {
  const { data: s } = useSession();
  return {
    publicId: s?.user?.agent?.publicId ?? null,
    isAdmin: s?.user?.agent?.role === "ADMIN",
  };
}
