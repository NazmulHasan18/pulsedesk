import { useSession } from "next-auth/react";
import { useAgentWorkloadQuery, useDashboardAnalyticsQuery, useDashboardOverviewQuery, usePlatformOverviewQuery } from "@/lib/api";
export function useDashboardOverview() { const { data: s } = useSession(); return useDashboardOverviewQuery({ token: s?.accessToken }, { skip: !s?.accessToken, pollingInterval: 30_000 }); }
export function useAgentWorkload() { const { data: s } = useSession(); return useAgentWorkloadQuery({ token: s?.accessToken }, { skip: !s?.accessToken, pollingInterval: 30_000 }); }
export function useDashboardAnalytics(days: number) { const { data: s } = useSession(); return useDashboardAnalyticsQuery({ days, token: s?.accessToken }, { skip: !s?.accessToken }); }
export function usePlatformOverview() { const { data: s } = useSession(); return usePlatformOverviewQuery({ token: s?.accessToken }, { skip: !s?.accessToken, pollingInterval: 60_000 }); }
