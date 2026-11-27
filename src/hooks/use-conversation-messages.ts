"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { realtime } from "@/lib/realtime";
import { ConversationService } from "@/services/conversation.service";
import { useRealtimeEvent, useRealtimeStatus } from "@/hooks/use-realtime";
import type { ConversationMessage, PaneMessage } from "@/types/conversation";

const REMOTE_TYPING_TIMEOUT_MS = 6000;
const TYPING_REFRESH_MS = 2500;

const sent = (m: ConversationMessage): PaneMessage => ({
  ...m,
  delivery: "sent",
});

const byTime = (a: PaneMessage, b: PaneMessage) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
  a.id.localeCompare(b.id);

// Adds or replaces by id or clientMessageId (our own message comes back over
// the socket and as the POST response; whichever is first wins, no duplicate).
const upsert = (list: PaneMessage[], incoming: PaneMessage[]) => {
  const next = [...list];
  for (const msg of incoming) {
    const i = next.findIndex(
      (m) =>
        m.id === msg.id ||
        (msg.clientMessageId && m.clientMessageId === msg.clientMessageId),
    );
    if (i >= 0) next[i] = msg;
    else next.push(msg);
  }
  return next.sort(byTime);
};

/**
 * Live message state for one conversation. Mount it with `key={publicId}`
 * so switching conversations starts from a clean state.
 */
export function useConversationMessages(
  publicId: string,
  { canMarkRead }: { canMarkRead: boolean },
) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { connectionCount } = useRealtimeStatus();

  const [messages, setMessages] = useState<PaneMessage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [customerTyping, setCustomerTyping] = useState(false);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const loadedRef = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTypingSent = useRef({ isTyping: false, at: 0 });

  // First load: the latest page.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await ConversationService.messages(publicId, {}, token);
        if (cancelled) return;
        setMessages((current) => upsert(current, res.data.map(sent)));
        setOlderCursor(res.meta?.hasNextPage ? res.meta.nextCursor : null);
        setStatus("ready");
        loadedRef.current = true;
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicId, token]);

  // Join the conversation room on every (re)connect; after a reconnect,
  // fetch what arrived while we were away.
  useEffect(() => {
    if (connectionCount === 0) return;
    void realtime.emitWithAck("conversation:join", publicId);

    if (!loadedRef.current || !token) return;
    const lastSaved = [...messagesRef.current]
      .reverse()
      .find((m) => m.delivery === "sent");
    if (!lastSaved) return;
    ConversationService.messages(publicId, { after: lastSaved.id }, token)
      .then((res) =>
        setMessages((current) => upsert(current, res.data.map(sent))),
      )
      .catch(() => undefined);
  }, [connectionCount, publicId, token]);

  useEffect(
    () => () => realtime.emit("conversation:leave", publicId),
    [publicId],
  );

  useRealtimeEvent<{ conversationId: string; message: ConversationMessage }>(
    "message:created",
    (payload) => {
      if (payload.conversationId !== publicId) return;
      if (payload.message.senderType === "CUSTOMER") {
        clearTimeout(typingTimer.current);
        setCustomerTyping(false);
      }
      setMessages((current) => upsert(current, [sent(payload.message)]));
    },
  );

  useRealtimeEvent<{ conversationId: string; isTyping: boolean }>(
    "customer:typing",
    (payload) => {
      if (payload.conversationId !== publicId) return;
      clearTimeout(typingTimer.current);
      setCustomerTyping(payload.isTyping);
      if (payload.isTyping) {
        typingTimer.current = setTimeout(
          () => setCustomerTyping(false),
          REMOTE_TYPING_TIMEOUT_MS,
        );
      }
    },
  );

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  // Only the agent handling the chat marks it read, so an admin or a
  // colleague looking in doesn't clear the owner's unread count.
  const hasUnread = messages.some(
    (m) =>
      m.senderType === "CUSTOMER" && !m.readByAgentAt && m.delivery === "sent",
  );
  useEffect(() => {
    if (!canMarkRead || !hasUnread || !token) return;
    const readAt = new Date().toISOString();
    ConversationService.markRead(publicId, token)
      .then(() =>
        setMessages((current) =>
          current.map((m) =>
            m.senderType === "CUSTOMER" && !m.readByAgentAt
              ? { ...m, readByAgentAt: readAt }
              : m,
          ),
        ),
      )
      .catch(() => undefined);
  }, [canMarkRead, hasUnread, publicId, token]);

  const loadOlder = useCallback(async () => {
    if (!olderCursor || loadingOlder || !token) return;
    setLoadingOlder(true);
    try {
      const res = await ConversationService.messages(
        publicId,
        { before: olderCursor },
        token,
      );
      setMessages((current) => upsert(current, res.data.map(sent)));
      setOlderCursor(res.meta?.hasNextPage ? res.meta.nextCursor : null);
    } finally {
      setLoadingOlder(false);
    }
  }, [olderCursor, loadingOlder, publicId, token]);

  const deliver = useCallback(
    async (local: PaneMessage) => {
      try {
        const saved = await ConversationService.sendMessage(
          publicId,
          local.content,
          local.clientMessageId!,
          token,
        );
        setMessages((current) =>
          upsert(
            current.filter((m) => m.id !== local.id),
            [sent(saved)],
          ),
        );
        return null;
      } catch (err) {
        setMessages((current) =>
          current.map((m) =>
            m.id === local.id ? { ...m, delivery: "failed" } : m,
          ),
        );
        return err instanceof Error ? err.message : "Message not sent";
      }
    },
    [publicId, token],
  );

  // Returns an error message when sending failed, so the caller can show it.
  const send = useCallback(
    (content: string) => {
      const clientMessageId = crypto.randomUUID();
      const local: PaneMessage = {
        id: `local-${clientMessageId}`,
        clientMessageId,
        senderType: "AGENT",
        content,
        createdAt: new Date().toISOString(),
        delivery: "sending",
      };
      setMessages((current) => upsert(current, [local]));
      return deliver(local);
    },
    [deliver],
  );

  // Same clientMessageId: if the first attempt reached the server, the
  // server returns that message instead of saving a second copy.
  const retry = useCallback(
    (id: string) => {
      const message = messagesRef.current.find(
        (m) => m.id === id && m.delivery === "failed",
      );
      if (!message) return Promise.resolve(null);
      setMessages((current) =>
        current.map((m) => (m.id === id ? { ...m, delivery: "sending" } : m)),
      );
      return deliver({ ...message, delivery: "sending" });
    },
    [deliver],
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      const now = Date.now();
      const last = lastTypingSent.current;
      if (
        isTyping === last.isTyping &&
        (!isTyping || now - last.at < TYPING_REFRESH_MS)
      )
        return;
      lastTypingSent.current = { isTyping, at: now };
      realtime.emit("typing", { conversationId: publicId, isTyping });
    },
    [publicId],
  );

  return {
    messages,
    status,
    hasOlder: olderCursor !== null,
    loadingOlder,
    loadOlder,
    send,
    retry,
    notifyTyping,
    customerTyping,
  };
}
