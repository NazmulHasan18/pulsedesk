import { baseApi, runRequest } from "../base-api";
import { getAgentWorkload, getDashboardAnalytics, getDashboardOverview, getPlatformOverview } from "@/services/dashboard.service";
import type { ApiResponse } from "@/types/apiResponse";
import type { AgentWorkloadItem, AnalyticsResult, DashboardOverview, PlatformOverview } from "@/types/dashboard";

type AuthArgs = { token?: string };

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardOverview: builder.query<ApiResponse<DashboardOverview>, AuthArgs>({ queryFn: ({ token }) => runRequest(getDashboardOverview(token)), providesTags: ["Dashboard"] }),
    agentWorkload: builder.query<ApiResponse<AgentWorkloadItem[]>, AuthArgs>({ queryFn: ({ token }) => runRequest(getAgentWorkload(token)), providesTags: ["Dashboard"] }),
    dashboardAnalytics: builder.query<ApiResponse<AnalyticsResult>, AuthArgs & { days: number }>({ queryFn: ({ days, token }) => runRequest(getDashboardAnalytics(days, token)), providesTags: ["Dashboard"] }),
    platformOverview: builder.query<ApiResponse<PlatformOverview>, AuthArgs>({ queryFn: ({ token }) => runRequest(getPlatformOverview(token)), providesTags: ["Dashboard"] }),
  }),
});

export const { useDashboardOverviewQuery, useAgentWorkloadQuery, useDashboardAnalyticsQuery, usePlatformOverviewQuery } = dashboardApi;
