import { baseApi, runRequest } from "../base-api";
import { AgentService } from "@/services/agent.service";
import type { Agent, AgentListParams, AgentListResponse, AgentStatus, CreateAgentPayload, InviteAgentPayload, UpdateAgentPayload } from "@/types/agent";

type AuthArgs = { token?: string };

export const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    agents: builder.query<AgentListResponse, AuthArgs & { params: AgentListParams }>({ queryFn: ({ params, token }) => runRequest(AgentService.list(params, token)), providesTags: ["Agents"] }),
    agent: builder.query<Agent, AuthArgs & { agentId: string }>({ queryFn: ({ agentId, token }) => runRequest(AgentService.getById(agentId, token)), providesTags: ["Agents"] }),
    inviteAgent: builder.mutation<Agent, AuthArgs & { payload: InviteAgentPayload }>({ queryFn: ({ payload, token }) => runRequest(AgentService.invite(payload, token)), invalidatesTags: ["Agents"] }),
    createAgent: builder.mutation<Agent, AuthArgs & { payload: CreateAgentPayload }>({ queryFn: ({ payload, token }) => runRequest(AgentService.create(payload, token)), invalidatesTags: ["Agents"] }),
    updateAgent: builder.mutation<Agent, AuthArgs & { agentId: string; payload: UpdateAgentPayload }>({ queryFn: ({ agentId, payload, token }) => runRequest(AgentService.update(agentId, payload, token)), invalidatesTags: ["Agents"] }),
    setAgentStatus: builder.mutation<Agent, AuthArgs & { agentId: string; status: AgentStatus }>({ queryFn: ({ agentId, status, token }) => runRequest(AgentService.setStatus(agentId, status, token)), invalidatesTags: ["Agents"] }),
    deleteAgent: builder.mutation<void, AuthArgs & { agentId: string }>({ queryFn: ({ agentId, token }) => runRequest(AgentService.remove(agentId, token)), invalidatesTags: ["Agents"] }),
    resetAgentPassword: builder.mutation<{ message: string }, AuthArgs & { agentId: string }>({ queryFn: ({ agentId, token }) => runRequest(AgentService.resetPassword(agentId, token)) }),
  }),
});

export const { useAgentsQuery, useAgentQuery, useInviteAgentMutation, useCreateAgentMutation, useUpdateAgentMutation, useSetAgentStatusMutation, useDeleteAgentMutation, useResetAgentPasswordMutation } = agentsApi;
