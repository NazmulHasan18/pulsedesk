import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CompanyStats } from "@/types/company";

interface CompanyStatsCardsProps {
  stats?: CompanyStats;
  isLoading: boolean;
}

interface StatConfig {
  label: string;
  value: (s: CompanyStats) => string;
  accent?: string;
}

const STAT_CONFIG: StatConfig[] = [
  { label: "Total agents", value: (s) => String(s.totalAgents) },
  { label: "Active agents", value: (s) => String(s.activeAgents), accent: "text-signal-ink" },
  { label: "Open conversations", value: (s) => String(s.openConversations), accent: "text-amber-ink" },
  { label: "Total conversations", value: (s) => String(s.totalConversations) },
  { label: "Avg first response", value: (s) => `${s.avgFirstResponseMins}m` },
  {
    label: "CSAT",
    value: (s) => (s?.csatScore === null ? "—" : `${s?.csatScore?.toFixed(1)}%`),
    accent: "text-indigo",
  },
];

export function CompanyStatsCards({ stats, isLoading }: CompanyStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-line bg-surface" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_CONFIG.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border border-line bg-surface p-4"
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className={cn("mt-1.5 font-display text-2xl font-semibold text-ink", stat.accent)}>
            {stat.value(stats)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
