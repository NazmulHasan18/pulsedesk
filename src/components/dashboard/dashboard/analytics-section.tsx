"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { AlertTriangle, Tag } from "lucide-react";
import { useDashboardAnalytics } from "@/hooks/use-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DistributionBar } from "./distribution-bar";
import {
  PRIORITY_ORDER,
  PRIORITY_TOKENS,
  SOURCE_ORDER,
  SOURCE_TOKENS,
  STATUS_ORDER,
  STATUS_TOKENS,
} from "./status-tokens";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const chartConfig = {
  count: {
    label: "Conversations",
    color: "var(--indigo)",
  },
} satisfies ChartConfig;

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function AnalyticsSection() {
  const [days, setDays] = useState(7);
  const { data: analyticsData, isLoading, isError, isFetching } = useDashboardAnalytics(days);
  const data = analyticsData?.data;

  return (
    <div className="space-y-4">
      <Card className={cn("shadow-panel-soft transition-opacity", isFetching && "opacity-60")}>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium text-ink">Conversation volume</CardTitle>
            <CardDescription>
              {data
                ? `${data.conversationsCreated.total.toLocaleString()} created in this range`
                : "Loading…"}
            </CardDescription>
          </div>
          <ToggleGroup
            value={[String(days)]}
            onValueChange={(v) => {
              if (v[0]) {
                setDays(Number(v[0]));
              }
            }}
            className="rounded-xl border border-line bg-muted p-1"
          >
            {RANGE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.days}
                value={String(opt.days)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium data-[state=on]:bg-surface data-[state=on]:text-ink data-[state=on]:shadow-sm"
              >
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardHeader>
        <CardContent>
          {isError ? (
            <Alert variant="destructive" className="border-danger/30 bg-danger-tint/40 text-danger">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Couldn&apos;t load analytics</AlertTitle>
              <AlertDescription>Try a different range or refresh.</AlertDescription>
            </Alert>
          ) : isLoading || !data ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart
                data={data.conversationsCreated.byDay}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="conversationsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-count)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDayLabel}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--line)" }}
                  tickLine={false}
                  interval={days > 14 ? Math.ceil(days / 8) : 0}
                />
                <ChartTooltip
                  content={<ChartTooltipContent labelFormatter={(v) => formatDayLabel(String(v))} />}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  fill="url(#conversationsFill)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DistributionBar
              title="By status"
              segments={STATUS_ORDER.map((key) => ({
                key,
                label: STATUS_TOKENS[key].label,
                value: data.byStatus[key],
                dotClass: STATUS_TOKENS[key].dot,
                badgeClass: STATUS_TOKENS[key].badgeClass,
              }))}
            />
            <DistributionBar
              title="By priority"
              segments={PRIORITY_ORDER.map((key) => ({
                key,
                label: PRIORITY_TOKENS[key].label,
                value: data.byPriority[key],
                dotClass: PRIORITY_TOKENS[key].dot,
                badgeClass: PRIORITY_TOKENS[key].badgeClass,
              }))}
            />
            <DistributionBar
              title="By source"
              segments={SOURCE_ORDER.map((key) => ({
                key,
                label: SOURCE_TOKENS[key].label,
                value: data.bySource[key],
                dotClass: SOURCE_TOKENS[key].dot,
                badgeClass: SOURCE_TOKENS[key].badgeClass,
              }))}
            />
          </div>

          <Card className="shadow-panel-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ink">Top labels</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topLabels.length === 0 ? (
                <p className="text-xs text-muted-foreground">No labels applied in this range.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.topLabels.map((l) => (
                    <Badge
                      key={l.label}
                      variant="outline"
                      className="border-transparent bg-indigo-tint text-indigo-dark"
                    >
                      <Tag className="mr-1.5 h-3 w-3" />
                      {l.label}
                      <span className="ml-1.5 tabular-nums opacity-70">{l.count}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
