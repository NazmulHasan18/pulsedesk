"use client";

import { Check, UserMinus, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgents } from "@/hooks/use-agents";
import { useAssignConversation } from "@/hooks/use-inbox";
import type { ConversationDetail } from "@/types/conversation";

// Admin-only: assign, transfer or unassign a conversation. Only rendered for
// admins, so regular agents never request the agent list (it's admin-only).
export function AssignMenu({
  conversation,
}: {
  conversation: ConversationDetail;
}) {
  const { data, isLoading } = useAgents({ limit: 100 });
  const { assign, isPending } = useAssignConversation();
  const current = conversation.assignedAgent?.publicId ?? null;
  // Deactivated agents can't take chats (the backend rejects them too).
  const agents = (data?.data ?? []).filter((agent) => agent.isActive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button {...props} size="sm" variant="outline" disabled={isPending}>
            <UserRoundCog className="h-4 w-4" />
            {current ? "Transfer" : "Assign"}
          </Button>
        )}
      />
      <DropdownMenuContent
        align="end"
        className="max-h-80 min-w-52 overflow-y-auto border-line bg-surface"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Assign to</DropdownMenuLabel>
          {isLoading && (
            <DropdownMenuItem disabled>Loading agents…</DropdownMenuItem>
          )}
          {!isLoading && agents.length === 0 && (
            <DropdownMenuItem disabled>No active agents</DropdownMenuItem>
          )}
          {agents.map((agent) => {
            const isCurrent = agent.publicId === current;
            return (
              <DropdownMenuItem
                key={agent.publicId}
                disabled={isCurrent}
                onClick={() => assign(conversation.publicId, agent)}
              >
                <span
                  aria-hidden
                  className={
                    agent.isOnline
                      ? "h-2 w-2 shrink-0 rounded-full bg-signal"
                      : "h-2 w-2 shrink-0 rounded-full bg-muted-foreground/50"
                  }
                />
                <span className="min-w-0 flex-1 truncate">
                  {agent.name}
                  {agent.role === "ADMIN" && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (admin)
                    </span>
                  )}
                </span>
                {isCurrent && <Check className="h-4 w-4" aria-label="Current" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {current && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-danger focus:text-danger"
              onClick={() => assign(conversation.publicId, null)}
            >
              <UserMinus className="h-4 w-4" /> Unassign
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
