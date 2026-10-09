"use client";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  useAgentQuery,
  useAgentsQuery,
  useCreateAgentMutation,
  useDeleteAgentMutation,
  useInviteAgentMutation,
  useResetAgentPasswordMutation,
  useSetAgentStatusMutation,
  useUpdateAgentMutation,
} from "@/lib/api";
import type { AgentListParams, AgentStatus, CreateAgentPayload, InviteAgentPayload, UpdateAgentPayload } from "@/types/agent";

export function useAgents(params: AgentListParams) {
  const { data: session } = useSession();
  return useAgentsQuery({ params, token: session?.accessToken }, { skip: !session?.accessToken });
}
export function useAgentDetails({ agentId }: { agentId: string }) {
  const { data: session } = useSession();
  return useAgentQuery({ agentId, token: session?.accessToken }, { skip: !agentId || !session?.accessToken });
}
function mutation<T>(trigger: (value: T) => { unwrap: () => Promise<unknown> }, success: string, failure: string) {
  return (value: T) => trigger(value).unwrap().then(() => toast.success(success)).catch(() => toast.error(failure));
}
export function useInviteAgent() { const { data: s } = useSession(); const [trigger, state] = useInviteAgentMutation(); return { ...state, mutate: mutation((payload: InviteAgentPayload) => trigger({ payload, token: s?.accessToken }), "Invite sent", "Couldn't send the invite") }; }
export function useCreateAgent() { const { data: s } = useSession(); const [trigger, state] = useCreateAgentMutation(); return { ...state, mutate: mutation((payload: CreateAgentPayload) => trigger({ payload, token: s?.accessToken }), "Agent added", "Couldn't add the agent") }; }
export function useUpdateAgent() { const { data: s } = useSession(); const [trigger, state] = useUpdateAgentMutation(); return { ...state, mutate: mutation((value: { agentId: string; payload: UpdateAgentPayload }) => trigger({ ...value, token: s?.accessToken }), "Agent updated", "Couldn't update the agent") }; }
export function useSetAgentStatus() { const { data: s } = useSession(); const [trigger, state] = useSetAgentStatusMutation(); return { ...state, mutate: mutation((value: { agentId: string; status: AgentStatus }) => trigger({ ...value, token: s?.accessToken }), "Status updated", "Couldn't update status") }; }
export function useDeleteAgent() { const { data: s } = useSession(); const [trigger, state] = useDeleteAgentMutation(); return { ...state, mutate: mutation((agentId: string) => trigger({ agentId, token: s?.accessToken }), "Agent removed", "Couldn't remove the agent") }; }
export function useResetAgentPassword() { const { data: s } = useSession(); const [trigger, state] = useResetAgentPasswordMutation(); return { ...state, mutate: mutation((agentId: string) => trigger({ agentId, token: s?.accessToken }), "Password reset — new credentials emailed", "Couldn't reset the password") }; }
