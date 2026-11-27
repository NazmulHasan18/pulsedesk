"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/lib/hooks";
import { realtime } from "@/lib/realtime";
import { refreshSession } from "@/lib/session-refresh";

// Events that change what the inbox lists and counts show.
const INBOX_EVENTS = [
  "message:created",
  "message:read",
  "conversation:created",
  "conversation:status_changed",
  "conversation:assigned",
  "conversation:unassigned",
];
// Events that change a single conversation's header/details.
const CONVERSATION_EVENTS = [
  "conversation:status_changed",
  "conversation:assigned",
  "conversation:unassigned",
];

// A burst of events (e.g. claim = assigned + status_changed) triggers one refetch.
const REFRESH_DEBOUNCE_MS = 300;

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const token = session?.accessToken;
  const isAgent = session?.user?.userType === "agent";
  const hasToken = Boolean(token);

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!isAgent || !hasToken) return;

    realtime.start({
      getToken: () => tokenRef.current,
      refreshToken: async () => {
        // update(), not getSession(): this tab's useSession must see the new token.
        tokenRef.current = (await refreshSession()) ?? tokenRef.current;
        return tokenRef.current;
      },
    });

    let timer: ReturnType<typeof setTimeout> | undefined;
    const refreshInbox = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => dispatch(api.util.invalidateTags(["Inbox"])),
        REFRESH_DEBOUNCE_MS,
      );
    };
    const refreshConversation = (payload: unknown) => {
      const id = (payload as { conversationId?: string })?.conversationId;
      if (id) dispatch(api.util.invalidateTags([{ type: "Conversation", id }]));
    };

    const offs = [
      ...INBOX_EVENTS.map((event) => realtime.on(event, refreshInbox)),
      ...CONVERSATION_EVENTS.map((event) =>
        realtime.on(event, refreshConversation),
      ),
    ];
    // Anything may have changed while disconnected.
    const offStatus = realtime.subscribe(() => {
      if (realtime.getSnapshot().status === "online") refreshInbox();
    });

    return () => {
      clearTimeout(timer);
      offs.forEach((off) => off());
      offStatus();
      realtime.stop();
    };
  }, [isAgent, hasToken, dispatch]);

  return children;
}
