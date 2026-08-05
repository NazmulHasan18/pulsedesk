import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CompanyService } from "@/services/company.service";
import type { CreateCompanyPayload, ListCompaniesParams, UpdateCompanyPayload } from "@/types/company";
import { useSession } from "next-auth/react";

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (params: ListCompaniesParams) => [...companyKeys.lists(), params] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  stats: (id: string) => [...companyKeys.all, "stats", id] as const,
};

export const useCompanies = (params: ListCompaniesParams) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => CompanyService.listCompanies(params, token),
    placeholderData: (previous) => previous,
    enabled: !!token,
  });
};

export const useCompany = (companyId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: companyKeys.detail(companyId),
    queryFn: () => CompanyService.getCompany(companyId, token),
    enabled: !!companyId && !!token,
  });
};

export const useCompanyStats = (companyId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: companyKeys.stats(companyId),
    queryFn: () => CompanyService.getCompanyStats(companyId, token),
    enabled: !!companyId && !!token,
  });
};

export const useCreateCompany = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => CompanyService.createCompany(payload, token),
    onSuccess: () => {
      toast.success("Company created");
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to create company";
      toast.error(message);
    },
  });
};

export const useUpdateCompany = (companyId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => CompanyService.updateCompany(companyId, payload, token),
    onSuccess: () => {
      toast.success("Company updated");
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to update company";
      toast.error(message);
    },
  });
};

export const useDeleteCompany = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => CompanyService.deleteCompany(companyId, token),
    onSuccess: () => {
      toast.success("Company removed");
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to remove company";
      toast.error(message);
    },
  });
};
