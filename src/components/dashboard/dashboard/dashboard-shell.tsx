"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewSection } from "./overview-section";
import { AgentWorkloadTable } from "./agent-workload-table";
import { AnalyticsSection } from "./analytics-section";
import { PlatformSection } from "./platform-section";

type Role = "agent" | "superadmin";

interface DashboardShellProps {
  role: Role;
}

type TabKey = "overview" | "agents" | "analytics" | "platform";

const TABS: { key: TabKey; label: string; roles: Role[] }[] = [
  { key: "overview", label: "Overview", roles: ["agent"] },
  { key: "agents", label: "Agent workload", roles: ["agent"] },
  { key: "analytics", label: "Analytics", roles: ["agent"] },
  { key: "platform", label: "Platform", roles: ["superadmin"] },
];

export function DashboardShell({ role }: DashboardShellProps) {
  const visibleTabs = TABS.filter((t) => t.roles.includes(role));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {role === "superadmin"
            ? "Platform-wide activity across every workspace."
            : "Live activity for your workspace."}
        </p>
      </header>

      <Tabs defaultValue={visibleTabs[0]?.key ?? "overview"}>
        <TabsList className="mb-6 h-auto flex-wrap justify-start gap-1 rounded-xl border border-line bg-muted p-1">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-lg px-3.5 py-2 text-sm font-medium data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection />
        </TabsContent>
        <TabsContent value="agents">
          <AgentWorkloadTable />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsSection />
        </TabsContent>
        {role === "superadmin" && (
          <TabsContent value="platform">
            <PlatformSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
