"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useConversationDetail,
  useInbox,
  useInboxCounts,
  useInboxViewer,
} from "@/hooks/use-inbox";
import { useRealtimeStatus } from "@/hooks/use-realtime";
import type { InboxView as View } from "@/types/conversation";
import { ConversationList } from "./conversation-list";
import { ConversationPane } from "./conversation-pane";
import { CustomerPanel } from "./customer-panel";

const LABELS: Record<View, string> = {
  waiting: "Waiting",
  mine: "Mine",
  all: "All",
  resolved: "Resolved",
};

interface InboxViewProps {
  title: string;
  description: string;
  views: View[];
}

// The selected tab and conversation live in the URL (?view=&c=), so a
// refresh or a shared link opens the same chat.
export function InboxView({ title, description, views }: InboxViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("view") as View | null;
  const view = requested && views.includes(requested) ? requested : views[0]!;
  const selectedId = params.get("c");

  const viewer = useInboxViewer();
  const { status: socketStatus } = useRealtimeStatus();
  const counts = useInboxCounts();
  const list = useInbox(view);
  const detail = useConversationDetail(selectedId);

  const navigate = (next: { view?: View; c?: string | null }) => {
    const search = new URLSearchParams(params);
    if (next.view) search.set("view", next.view);
    if (next.c === null) search.delete("c");
    else if (next.c) search.set("c", next.c);
    router.replace(`${pathname}?${search}`, { scroll: false });
  };

  const countFor = (v: View) =>
    v === "resolved" ? undefined : counts.data?.[v];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {socketStatus === "reconnecting" && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-full bg-amber-tint px-3 py-1 text-xs font-medium text-amber-ink"
          >
            <WifiOff className="h-3.5 w-3.5" /> Reconnecting… live updates are
            paused
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex w-80 shrink-0 flex-col border-r border-line">
          {views.length > 1 && (
            <div
              role="tablist"
              aria-label="Inbox views"
              className="flex gap-1 border-b border-line p-2"
            >
              {views.map((v) => (
                <button
                  key={v}
                  role="tab"
                  type="button"
                  aria-selected={v === view}
                  onClick={() => navigate({ view: v })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                    v === view
                      ? "bg-ink text-paper"
                      : "text-muted-foreground hover:bg-muted hover:text-ink",
                  )}
                >
                  {LABELS[v]}
                  {countFor(v) ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px]",
                        v === view ? "bg-paper/20" : "bg-muted",
                      )}
                    >
                      {countFor(v)}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ConversationList
              view={view}
              conversations={list.data?.data}
              isLoading={list.isLoading}
              isError={list.isError}
              onRetry={list.refetch}
              selectedId={selectedId}
              onSelect={(c) => navigate({ c })}
              viewerPublicId={viewer.publicId}
            />
          </div>
        </div>

        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <div>
              <p className="text-sm font-medium text-ink">
                Select a conversation
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pick a chat on the left to read and reply.
              </p>
            </div>
          </div>
        ) : detail.isLoading ? (
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Skeleton className="h-10 w-1/3 rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ) : detail.isError || !detail.data ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              This conversation couldn&apos;t be loaded.
            </p>
          </div>
        ) : (
          <>
            <ConversationPane
              key={detail.data.publicId}
              conversation={detail.data}
              viewer={viewer}
              onClaimed={() =>
                views.includes("mine") && navigate({ view: "mine" })
              }
            />
            <CustomerPanel conversation={detail.data} />
          </>
        )}
      </div>
    </div>
  );
}
