import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/apiResponse";
import type {
  AnalyticsResult,
  AgentWorkloadItem,
  DashboardOverview,
  PlatformOverview,
} from "@/types/dashboard";

// Adjust the base path if your router is mounted somewhere other than /dashboard.
const BASE = "/dashboard";

export const getDashboardOverview = (token?: string) =>
  fetcher<ApiResponse<DashboardOverview>>(`${BASE}/overview`, { token });

export const getAgentWorkload = (token?: string) =>
  fetcher<ApiResponse<AgentWorkloadItem[]>>(`${BASE}/agent-workload`, { token });

export const getDashboardAnalytics = (days: number, token?: string) =>
  fetcher<ApiResponse<AnalyticsResult>>(`${BASE}/analytics?days=${days}`, { token });

export const getPlatformOverview = (token?: string) =>
  fetcher<ApiResponse<PlatformOverview>>(`${BASE}/platform`, { token });
