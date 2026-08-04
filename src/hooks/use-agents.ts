"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { AgentService } from "@/services/agent.service";
import type {
  AgentListParams,
  AgentStatus,
  CreateAgentPayload,
  InviteAgentPayload,
  UpdateAgentPayload,
} from "@/types/agent";
import { useSession } from "next-auth/react";

const AGENTS_KEY = ["agents"] as const;

export function useAgents(params: AgentListParams) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: [...AGENTS_KEY, params],
    queryFn: () => AgentService.list(params, token),
    placeholderData: (prev) => prev,
    enabled: !!token,
  });
}

export function useInviteAgent() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteAgentPayload) => AgentService.invite(payload, token),
    onSuccess: () => {
      toast.success("Invite sent");
      qc.invalidateQueries({ queryKey: AGENTS_KEY });
    },
    onError: () => toast.error("Couldn't send the invite"),
  });
}

export function useCreateAgent() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAgentPayload) => AgentService.create(payload, token),
    onSuccess: () => {
      toast.success("Agent added");
      qc.invalidateQueries({ queryKey: AGENTS_KEY });
    },
    onError: () => toast.error("Couldn't add the agent"),
  });
}

export function useUpdateAgent() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, payload }: { agentId: string; payload: UpdateAgentPayload }) =>
      AgentService.update(agentId, payload, token),
    onSuccess: () => {
      toast.success("Agent updated");
      qc.invalidateQueries({ queryKey: AGENTS_KEY });
    },
    onError: () => toast.error("Couldn't update the agent"),
  });
}

export function useSetAgentStatus() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, status }: { agentId: string; status: AgentStatus }) =>
      AgentService.setStatus(agentId, status, token),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: AGENTS_KEY });
    },
    onError: () => toast.error("Couldn't update status"),
  });
}

export function useDeleteAgent() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => AgentService.remove(agentId, token),
    onSuccess: () => {
      toast.success("Agent removed");
      qc.invalidateQueries({ queryKey: AGENTS_KEY });
    },
    onError: () => toast.error("Couldn't remove the agent"),
  });
}

export function useResetAgentPassword() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  return useMutation({
    mutationFn: (agentId: string) => AgentService.resetPassword(agentId, token),
    onSuccess: () => toast.success("Password reset — new credentials emailed"),
    onError: () => toast.error("Couldn't reset the password"),
  });
}
