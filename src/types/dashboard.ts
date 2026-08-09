// Mirrors backend/src/modules/dashboard/dashboard.interface.ts
// Keep this in sync with the Prisma enums if they change.

export type ConversationStatus = "OPEN" | "PENDING" | "CLOSED";
export type ConversationSource = "AI" | "AGENT";
export type ConversationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface StatusCounts {
  OPEN: number;
  PENDING: number;
  CLOSED: number;
}

export interface SourceCounts {
  AI: number;
  AGENT: number;
}

export interface PriorityCounts {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}

export interface DashboardOverview {
  conversations: {
    total: number;
    byStatus: StatusCounts;
    bySource: SourceCounts;
    byPriority: PriorityCounts;
    unassignedOpen: number;
  };
  agents: {
    total: number;
    online: number;
  };
  customers: {
    total: number;
  };
}

export interface AgentWorkloadItem {
  agentId: string;
  publicId: string;
  name: string;
  email: string;
  isOnline: boolean;
  isActive: boolean;
  assigned: {
    total: number;
    byStatus: StatusCounts;
  };
}

export interface AnalyticsDayBucket {
  date: string; // yyyy-mm-dd
  count: number;
}

export interface AnalyticsResult {
  rangeDays: number;
  conversationsCreated: {
    total: number;
    byDay: AnalyticsDayBucket[];
  };
  byPriority: PriorityCounts;
  bySource: SourceCounts;
  byStatus: StatusCounts;
  topLabels: { label: string; count: number }[];
}

export interface PlatformCompanyBreakdown {
  companyId: string;
  publicId: string;
  name: string;
  plan: string;
  agents: number;
  customers: number;
  conversations: number;
}

export interface PlatformOverview {
  totals: {
    companies: number;
    agents: number;
    customers: number;
    conversations: number;
  };
  companies: PlatformCompanyBreakdown[];
}
