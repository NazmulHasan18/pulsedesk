"use client";

import { useEffect, useState } from "react";
import { KeyRound, MoreHorizontal, Pencil, Search, Settings, Trash2, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentStatusBadge } from "./agent-status-badge";
import { EditAgentSheet } from "./edit-agent-sheet";
import { InviteAgentDialog } from "./invite-agent-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAgents, useDeleteAgent, useResetAgentPassword, useSetAgentStatus } from "@/hooks/use-agents";
import type { Agent, AgentRole, AgentStatus } from "@/types/agent";

const STATUS_OPTIONS: { value: AgentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "AWAY", label: "Away" },
  { value: "OFFLINE", label: "Offline" },
  { value: "SUSPENDED", label: "Suspended" },
];

const ROLE_OPTIONS: { value: AgentRole | "ALL"; label: string }[] = [
  { value: "ALL", label: "All roles" },
  { value: "AGENT", label: "Agent" },
  { value: "ADMIN", label: "Admin" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatLastActive(value?: string | null) {
  if (!value) return "Never";
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(value).toLocaleDateString();
}

export function AgentsTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AgentStatus | "ALL">("ALL");
  const [role, setRole] = useState<AgentRole | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Agent | null>(null);
  const [pendingReset, setPendingReset] = useState<Agent | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useAgents({
    page,
    limit: 10,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
    role: role === "ALL" ? undefined : role,
  });

  const setAgentStatus = useSetAgentStatus();
  const deleteAgent = useDeleteAgent();
  const resetPassword = useResetAgentPassword();

  const agents = data?.data ?? [];
  const meta = data?.meta;

  // --- column definitions: this is the only part that's specific to Agents ---
  const columns: DataTableColumn<Agent>[] = [
    {
      key: "agent",
      header: "Agent",
      isPrimary: true,
      cell: (agent) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={agent.avatarUrl ?? undefined} alt={agent.name} />
            <AvatarFallback className="bg-indigo-tint text-xs text-indigo-dark">
              {initials(agent.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{agent.name}</p>
            <p className="truncate text-xs text-muted-foreground">{agent.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (agent) => (
        <span className={agent.role === "ADMIN" ? "text-danger" : "text-ink"}>
          {agent.role === "ADMIN" ? "Admin" : "Agent"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (agent) => <AgentStatusBadge isActive={agent.isActive} />,
    },
    {
      key: "lastActive",
      header: "Last active",
      className: "hidden lg:table-cell",
      cell: (agent) => <span className="text-muted-foreground">{formatLastActive(agent.lastActiveAt)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Agents</h1>
          <p className="text-sm text-muted-foreground">
            {meta
              ? `${meta.total} agent${meta.total === 1 ? "" : "s"} in your workspace`
              : "Manage who handles conversations"}
          </p>
        </div>
        <InviteAgentDialog />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </div>
        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v as typeof role);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as typeof status);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={agents}
        getRowId={(agent) => agent.publicId}
        isLoading={isLoading}
        emptyState={{
          icon: <UserCircle2 className="h-5 w-5" />,
          title: "No agents yet",
          description: "Invite someone to start handling conversations.",
        }}
        pagination={
          meta
            ? {
                page: meta.page,
                totalPages: meta.totalPages,
                total: meta.total,
                onPageChange: setPage,
                isFetching,
              }
            : undefined
        }
        rowActions={(agent) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button {...props} variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            />
            <DropdownMenuContent align="end" className="min-w-40 border-line bg-surface">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Manage</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit details
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Settings className="mr-2 h-4 w-4" /> Set status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="border-line bg-surface">
                    {(["ACTIVE", "SUSPENDED"] as AgentStatus[]).map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => setAgentStatus.mutate({ agentId: agent.publicId, status: s })}
                      >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => setPendingReset(agent)}>
                  <KeyRound className="mr-2 h-4 w-4" /> Reset password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger focus:text-danger"
                  onClick={() => setPendingDelete(agent)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove agent
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <EditAgentSheet agent={editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)} />

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="border-line bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They&apos;ll lose access immediately. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                if (pendingDelete) deleteAgent.mutate(pendingDelete.publicId);
                setPendingDelete(null);
              }}
            >
              Remove agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!pendingReset} onOpenChange={(open) => !open && setPendingReset(null)}>
        <AlertDialogContent className="border-line bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset {pendingReset?.name}&apos;s password?</AlertDialogTitle>
            <AlertDialogDescription>
              They&apos;ll be emailed a link to set a new password. Their current one stops working right
              away.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-indigo text-white hover:bg-indigo-dark"
              onClick={() => {
                if (pendingReset) resetPassword.mutate(pendingReset.publicId);
                setPendingReset(null);
              }}
            >
              Reset password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
