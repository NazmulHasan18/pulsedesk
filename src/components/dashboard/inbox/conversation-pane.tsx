"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Hand,
  RotateCcw,
  SendHorizontal,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { STATUS_TOKENS } from "@/components/dashboard/dashboard/status-tokens";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useConversationAction } from "@/hooks/use-inbox";
import type { InboxAction } from "@/services/conversation.service";
import type { ConversationDetail, PaneMessage } from "@/types/conversation";
import { AssignMenu } from "./assign-menu";
import { clockTime, customerName } from "./format";

interface Viewer {
  publicId: string | null;
  isAdmin: boolean;
}

const OPEN = ["WAITING", "ACTIVE", "AI_HANDLED"];

// What this viewer may do with the conversation. Mirrors the backend rules;
// the backend enforces them, this only decides which buttons to show.
function permissions(conversation: ConversationDetail, viewer: Viewer) {
  const isOpen = OPEN.includes(conversation.status);
  const isMine =
    !!conversation.assignedAgent &&
    conversation.assignedAgent.publicId === viewer.publicId;
  const owns = isMine || viewer.isAdmin;
  return {
    isMine,
    canClaim: conversation.status === "WAITING",
    canUnclaim: conversation.status === "ACTIVE" && owns,
    canResolve: isOpen && owns,
    canReopen: !isOpen && (owns || !conversation.assignedAgent),
    canReply: isOpen && owns,
    // Assign/transfer is admin-only and only for open conversations.
    canAssign: isOpen && viewer.isAdmin,
  };
}

export function ConversationPane({
  conversation,
  viewer,
  onClaimed,
}: {
  conversation: ConversationDetail;
  viewer: Viewer;
  onClaimed: () => void;
}) {
  const perms = permissions(conversation, viewer);
  const { run, isPending } = useConversationAction();
  const thread = useConversationMessages(conversation.publicId, {
    canMarkRead: perms.isMine,
  });
  const name = customerName(conversation.customer);
  const status = STATUS_TOKENS[conversation.status];

  const act = async (action: InboxAction) => {
    const ok = await run(conversation.publicId, action);
    if (ok && action === "claim") onClaimed();
  };

  return (
    <section
      className="flex h-full min-w-0 flex-1 flex-col"
      aria-label={`Conversation with ${name}`}
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-semibold text-ink">
            {name}
          </h2>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className={status.badgeClass}>
              {status.label}
            </Badge>
            {conversation.assignedAgent && (
              <span>
                {perms.isMine
                  ? "Assigned to you"
                  : `${conversation.assignedAgent.name} is handling this`}
              </span>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {perms.canAssign && <AssignMenu conversation={conversation} />}
          {perms.canClaim && (
            <Button size="sm" onClick={() => act("claim")} disabled={isPending}>
              <Hand className="h-4 w-4" /> Claim
            </Button>
          )}
          {perms.canUnclaim && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => act("unclaim")}
              disabled={isPending}
            >
              <Undo2 className="h-4 w-4" /> Release
            </Button>
          )}
          {perms.canResolve && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => act("resolve")}
              disabled={isPending}
            >
              <CheckCircle2 className="h-4 w-4" /> Resolve
            </Button>
          )}
          {perms.canReopen && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => act("reopen")}
              disabled={isPending}
            >
              <RotateCcw className="h-4 w-4" /> Reopen
            </Button>
          )}
        </div>
      </header>

      <MessageList thread={thread} customerName={name} />

      {perms.canReply ? (
        <Composer onSend={thread.send} onTyping={thread.notifyTyping} />
      ) : (
        <p className="border-t border-line px-5 py-4 text-center text-sm text-muted-foreground">
          {conversation.status === "WAITING"
            ? "Claim this conversation to reply."
            : OPEN.includes(conversation.status)
              ? `${conversation.assignedAgent?.name ?? "Another agent"} is handling this conversation.`
              : "This conversation is resolved. Reopen it to reply."}
        </p>
      )}
    </section>
  );
}

function MessageList({
  thread,
  customerName,
}: {
  thread: ReturnType<typeof useConversationMessages>;
  customerName: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const last = thread.messages.at(-1);

  // Follow new messages, unless the agent scrolled up to read history.
  useEffect(() => {
    const el = scroller.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [last?.id, last?.delivery, thread.customerTyping]);

  const onRetry = async (id: string) => {
    const error = await thread.retry(id);
    if (error) toast.error(error);
  };

  return (
    <div
      ref={scroller}
      onScroll={(e) => {
        const el = e.currentTarget;
        stickToBottom.current =
          el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto bg-paper px-5 py-4"
      aria-live="polite"
    >
      {thread.status === "loading" && (
        <div className="flex flex-col gap-3" aria-label="Loading messages">
          <Skeleton className="h-10 w-2/3 rounded-2xl" />
          <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
          <Skeleton className="h-10 w-3/5 rounded-2xl" />
        </div>
      )}
      {thread.status === "error" && (
        <p className="m-auto text-sm text-muted-foreground">
          Couldn&apos;t load messages. Refresh to try again.
        </p>
      )}
      {thread.status === "ready" && thread.hasOlder && (
        <Button
          variant="ghost"
          size="sm"
          className="self-center"
          onClick={thread.loadOlder}
          disabled={thread.loadingOlder}
        >
          {thread.loadingOlder ? "Loading…" : "Load earlier messages"}
        </Button>
      )}
      {thread.status === "ready" && thread.messages.length === 0 && (
        <p className="m-auto text-sm text-muted-foreground">No messages yet.</p>
      )}

      {thread.messages.map((m) => (
        <Bubble
          key={m.clientMessageId ?? m.id}
          message={m}
          customerName={customerName}
          onRetry={onRetry}
        />
      ))}

      {thread.customerTyping && (
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground"
          aria-label={`${customerName} is typing`}
        >
          <span className="flex gap-1 rounded-2xl border border-line bg-surface px-3 py-2.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
          </span>
          {customerName} is typing…
        </div>
      )}
    </div>
  );
}

function Bubble({
  message,
  customerName,
  onRetry,
}: {
  message: PaneMessage;
  customerName: string;
  onRetry: (id: string) => void;
}) {
  const fromCustomer = message.senderType === "CUSTOMER";
  const label = fromCustomer
    ? customerName
    : message.senderType === "AI"
      ? "AI assistant"
      : null;

  return (
    <div
      className={cn(
        "flex max-w-[75%] flex-col",
        fromCustomer ? "self-start items-start" : "self-end items-end",
      )}
    >
      {label && (
        <span className="mb-1 px-1 text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
      )}
      <div
        className={cn(
          "whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
          fromCustomer
            ? "rounded-bl-sm border border-line bg-surface text-ink"
            : "rounded-br-sm bg-indigo text-white",
          message.delivery === "sending" && "opacity-60",
        )}
      >
        {message.content}
      </div>
      <span className="mt-1 px-1 text-[11px] text-muted-foreground">
        {message.delivery === "sending" && "Sending…"}
        {message.delivery === "failed" && (
          <span className="text-danger">
            Not sent ·{" "}
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => onRetry(message.id)}
            >
              Retry
            </button>
          </span>
        )}
        {message.delivery === "sent" && clockTime(message.createdAt)}
      </span>
    </div>
  );
}

function Composer({
  onSend,
  onTyping,
}: {
  onSend: (content: string) => Promise<string | null>;
  onTyping: (isTyping: boolean) => void;
}) {
  const [text, setText] = useState("");

  const submit = async () => {
    const content = text.trim();
    if (!content) return;
    setText("");
    onTyping(false);
    const error = await onSend(content);
    if (error) toast.error(error);
  };

  return (
    <form
      className="flex items-end gap-2 border-t border-line bg-surface px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <textarea
        rows={1}
        value={text}
        maxLength={5000}
        aria-label="Reply"
        placeholder="Type a reply… (Enter to send, Shift+Enter for a new line)"
        onChange={(e) => {
          setText(e.target.value);
          onTyping(e.target.value.length > 0);
        }}
        onBlur={() => onTyping(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
        className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus-visible:border-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-tint"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Send"
        disabled={!text.trim()}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
