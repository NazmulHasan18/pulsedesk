"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Building2, MessagesSquare, Users, UserCheck } from "lucide-react";
import { usePlatformOverview } from "@/hooks/use-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./stat-card";

const PLAN_TONE: Record<string, string> = {
  FREE: "border-transparent bg-muted text-muted-foreground",
  PRO: "border-transparent bg-indigo-tint text-indigo-dark",
  ENTERPRISE: "border-transparent bg-amber-tint text-amber-ink",
};

function PlanBadge({ plan }: { plan: string }) {
  const tone = PLAN_TONE[plan.toUpperCase()] ?? "border-transparent bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={tone}>
      {plan}
    </Badge>
  );
}

export function PlatformSection() {
  const { data: platformData, isLoading, isError } = usePlatformOverview();
  const data = platformData?.data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-26 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="border-danger/30 bg-danger-tint/40 text-danger">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Couldn&apos;t load platform data</AlertTitle>
        <AlertDescription>Try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Companies" value={data.totals.companies} icon={Building2} tone="indigo" />
        <StatCard label="Agents" value={data.totals.agents} icon={UserCheck} tone="signal" />
        <StatCard label="Customers" value={data.totals.customers} icon={Users} />
        <StatCard
          label="Conversations"
          value={data.totals.conversations.toLocaleString()}
          icon={MessagesSquare}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-panel-soft">
        {data.companies.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No companies onboarded yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Agents</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">Conversations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.companies.map((c, i) => (
                <motion.tr
                  key={c.companyId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-line transition-colors last:border-0 hover:bg-muted/50"
                >
                  <TableCell className="max-w-55 truncate text-sm font-medium text-ink">{c.name}</TableCell>
                  <TableCell>
                    <PlanBadge plan={c.plan} />
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-ink">{c.agents}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-ink">{c.customers}</TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums text-ink">
                    {c.conversations}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
