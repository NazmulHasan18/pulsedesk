import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getAgentWorkload,
  getDashboardAnalytics,
  getDashboardOverview,
  getPlatformOverview,
} from "@/services/dashboard.service";

export const dashboardKeys = {
  overview: ["dashboard", "overview"] as const,
  agentWorkload: ["dashboard", "agent-workload"] as const,
  analytics: (days: number) => ["dashboard", "analytics", days] as const,
  platform: ["dashboard", "platform"] as const,
};

export function useDashboardOverview() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: () => getDashboardOverview(token),
    refetchInterval: 30_000,
    enabled: !!token,
  });
}

export function useAgentWorkload() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: dashboardKeys.agentWorkload,
    queryFn: () => getAgentWorkload(token),
    refetchInterval: 30_000,
    enabled: !!token,
  });
}

export function useDashboardAnalytics(days: number) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: dashboardKeys.analytics(days),
    queryFn: () => getDashboardAnalytics(days, token),
    placeholderData: (prev) => prev,
    enabled: !!token,
  });
}

export function usePlatformOverview() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: dashboardKeys.platform,
    queryFn: () => getPlatformOverview(token),
    refetchInterval: 60_000,
    enabled: !!token,
  });
}
