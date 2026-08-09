"use client";

import { AlertTriangle, MessagesSquare, Users, UserCheck } from "lucide-react";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "./stat-card";
import { DistributionBar } from "./distribution-bar";
import {
  PRIORITY_ORDER,
  PRIORITY_TOKENS,
  SOURCE_ORDER,
  SOURCE_TOKENS,
  STATUS_ORDER,
  STATUS_TOKENS,
} from "./status-tokens";

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-26 rounded-2xl" />
      ))}
    </div>
  );
}

export function OverviewSection() {
  const { data: overviewData, isLoading, isError } = useDashboardOverview();
  const data = overviewData?.data;

  if (isLoading) return <OverviewSkeleton />;

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="border-danger/30 bg-danger-tint/40 text-danger">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Couldn&apos;t load the overview</AlertTitle>
        <AlertDescription>Try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  const { conversations, agents, customers } = data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Conversations"
          value={conversations.total.toLocaleString()}
          icon={MessagesSquare}
          tone="indigo"
        />
        <StatCard
          label="Unassigned & open"
          value={conversations.unassignedOpen.toLocaleString()}
          icon={AlertTriangle}
          tone={conversations.unassignedOpen > 0 ? "amber" : "default"}
          hint={conversations.unassignedOpen > 0 ? "Needs an owner" : "All caught up"}
        />
        <StatCard
          label="Agents online"
          value={`${agents.online} / ${agents.total}`}
          icon={UserCheck}
          tone="signal"
        />
        <StatCard label="Customers" value={customers.total.toLocaleString()} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DistributionBar
          title="By status"
          segments={STATUS_ORDER.map((key) => ({
            key,
            label: STATUS_TOKENS[key].label,
            value: conversations.byStatus[key],
            dotClass: STATUS_TOKENS[key].dot,
            badgeClass: STATUS_TOKENS[key].badgeClass,
          }))}
        />
        <DistributionBar
          title="By priority"
          segments={PRIORITY_ORDER.map((key) => ({
            key,
            label: PRIORITY_TOKENS[key].label,
            value: conversations.byPriority[key],
            dotClass: PRIORITY_TOKENS[key].dot,
            badgeClass: PRIORITY_TOKENS[key].badgeClass,
          }))}
        />
        <DistributionBar
          title="By source"
          segments={SOURCE_ORDER.map((key) => ({
            key,
            label: SOURCE_TOKENS[key].label,
            value: conversations.bySource[key],
            dotClass: SOURCE_TOKENS[key].dot,
            badgeClass: SOURCE_TOKENS[key].badgeClass,
          }))}
        />
      </div>
    </div>
  );
}
