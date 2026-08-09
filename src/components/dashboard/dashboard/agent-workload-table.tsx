"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useAgentWorkload } from "@/hooks/use-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_ORDER, STATUS_TOKENS } from "./status-tokens";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function OnlineDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
      {isOnline && <span className="pulse-ring absolute inline-flex h-2.5 w-2.5 rounded-full text-signal" />}
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full ring-2 ring-surface",
          isOnline ? "bg-signal" : "bg-muted-foreground/50",
        )}
      />
    </span>
  );
}

function WorkloadSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-xl" />
      ))}
    </div>
  );
}

export function AgentWorkloadTable() {
  const { data: workloadData, isLoading, isError } = useAgentWorkload();
  const data = workloadData?.data || [];
  if (isLoading) return <WorkloadSkeleton />;

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="border-danger/30 bg-danger-tint/40 text-danger">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Couldn&apos;t load agent workload</AlertTitle>
        <AlertDescription>Try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-muted-foreground">
        No active agents yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-panel-soft">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Agent</TableHead>
            {STATUS_ORDER.map((status) => (
              <TableHead key={status} className="text-right">
                {STATUS_TOKENS[status].label}
              </TableHead>
            ))}
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((agent, i) => (
            <motion.tr
              key={agent.agentId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="border-b border-line transition-colors last:border-0 hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-tint text-xs font-medium text-indigo-dark">
                        {initials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <OnlineDot isOnline={agent.isOnline} />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{agent.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{agent.email}</p>
                  </div>
                </div>
              </TableCell>

              {STATUS_ORDER.map((status) => (
                <TableCell
                  key={status}
                  className={cn("text-right text-sm font-medium tabular-nums", STATUS_TOKENS[status].text)}
                >
                  {agent.assigned.byStatus[status]}
                </TableCell>
              ))}

              <TableCell className="text-right text-sm font-semibold tabular-nums text-ink">
                {agent.assigned.total}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
