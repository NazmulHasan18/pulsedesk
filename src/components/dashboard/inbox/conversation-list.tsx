"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { STATUS_TOKENS } from "@/components/dashboard/dashboard/status-tokens";
import type { InboxConversation, InboxView } from "@/types/conversation";
import { customerName, initials, timeAgo } from "./format";

const EMPTY: Record<InboxView, { title: string; hint: string }> = {
  waiting: {
    title: "No one is waiting",
    hint: "New chats from your website show up here.",
  },
  mine: {
    title: "No open conversations",
    hint: "Claim a waiting chat to start helping.",
  },
  all: {
    title: "No open conversations",
    hint: "Open chats across the team show up here.",
  },
  resolved: {
    title: "Nothing resolved yet",
    hint: "Resolved chats are kept here.",
  },
};

interface ConversationListProps {
  view: InboxView;
  conversations: InboxConversation[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  selectedId: string | null;
  onSelect: (publicId: string) => void;
  viewerPublicId: string | null;
}

export function ConversationList({
  view,
  conversations,
  isLoading,
  isError,
  onRetry,
  selectedId,
  onSelect,
  viewerPublicId,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-2 p-3"
        aria-busy="true"
        aria-label="Loading conversations"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load conversations.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-medium text-ink">{EMPTY[view].title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{EMPTY[view].hint}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1 p-2">
      {conversations.map((c) => {
        const name = customerName(c.customer);
        const selected = c.publicId === selectedId;
        const status = STATUS_TOKENS[c.status];
        const handledByOther =
          c.assignedAgent && c.assignedAgent.publicId !== viewerPublicId;
        const preview = c.lastMessage
          ? `${{ CUSTOMER: "", AGENT: "Agent: ", AI: "AI: " }[c.lastMessage.senderType]}${c.lastMessage.content}`
          : "No messages yet";

        return (
          <li key={c.publicId}>
            <button
              type="button"
              onClick={() => onSelect(c.publicId)}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                selected ? "bg-indigo-tint" : "hover:bg-muted",
              )}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-ink">
                {initials(name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-sm text-ink",
                      c.unreadCount > 0 ? "font-semibold" : "font-medium",
                    )}
                  >
                    {name}
                  </span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                    {timeAgo(c.lastActivityAt)}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-xs",
                      c.unreadCount > 0 ? "text-ink" : "text-muted-foreground",
                    )}
                  >
                    {preview}
                  </span>
                  {c.unreadCount > 0 && (
                    <span
                      className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-amber px-1.5 text-[11px] font-semibold text-white"
                      aria-label={`${c.unreadCount} unread`}
                    >
                      {c.unreadCount > 99 ? "99+" : c.unreadCount}
                    </span>
                  )}
                </span>
                {(view === "all" || view === "resolved") && (
                  <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
                    />
                    {status.label}
                    {c.assignedAgent &&
                      ` · ${handledByOther ? c.assignedAgent.name : "You"}`}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
