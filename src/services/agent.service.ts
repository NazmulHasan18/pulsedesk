import { fetcher } from "../lib/fetcher";
import type {
  Agent,
  AgentListParams,
  AgentListResponse,
  AgentStatus,
  CreateAgentPayload,
  InviteAgentPayload,
  UpdateAgentPayload,
} from "@/types/agent";

const BASE = "/agents";

function buildQueryString(params: AgentListParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const AgentService = {
  list: async (params: AgentListParams = {}, token?: string) => {
    return fetcher<AgentListResponse>(`${BASE}${buildQueryString(params)}`, { token });
  },
  getById: async (agentId: string, token?: string) => {
    return fetcher<Agent>(`${BASE}/${agentId}`, { token });
  },
  create: async (payload: CreateAgentPayload, token?: string) => {
    return fetcher<Agent>(BASE, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },
  invite: async (payload: InviteAgentPayload, token?: string) => {
    return fetcher<Agent>(`${BASE}/invite`, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },
  update: async (agentId: string, payload: UpdateAgentPayload, token?: string) => {
    return fetcher<Agent>(`${BASE}/${agentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    });
  },
  remove: async (agentId: string, token?: string) => {
    await fetcher<void>(`${BASE}/${agentId}`, {
      method: "DELETE",
      token,
    });
  },
  setStatus: async (agentId: string, status: AgentStatus, token?: string) => {
    return fetcher<Agent>(`${BASE}/${agentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: status === "ACTIVE" }),
      token,
    });
  },
  resetPassword: async (agentId: string, token?: string) => {
    return fetcher<{ message: string }>(`${BASE}/${agentId}/reset-password`, {
      method: "POST",
      token,
    });
  },
};
