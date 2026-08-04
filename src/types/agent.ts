export type AgentRole = "AGENT" | "ADMIN";
export type AgentStatus = "ACTIVE" | "AWAY" | "OFFLINE" | "SUSPENDED";

export interface Agent {
  id: string;
  publicId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: AgentRole;
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string | null;
}

export interface CreateAgentPayload {
  name: string;
  email: string;
  role: AgentRole;
  password: string;
}

export interface InviteAgentPayload {
  email: string;
  role: AgentRole;
}

export interface UpdateAgentPayload {
  name?: string;
  role?: AgentRole;
}

export interface AgentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AgentStatus;
  role?: AgentRole;
}

export interface AgentListResponse {
  data: Agent[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
