import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CompanyProfileService } from "@/services/company-profile.service";
import type { UpdateCompanyPayload, UpdateCompanySettingsPayload } from "@/types/company";
import { useSession } from "next-auth/react";

export const myCompanyKeys = {
  profile: ["my-company", "profile"] as const,
  stats: ["my-company", "stats"] as const,
};

export const useMyCompany = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: myCompanyKeys.profile,
    queryFn: () => CompanyProfileService.getMyCompany(token),
    enabled: !!token,
  });
};

export const useMyCompanyStats = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: myCompanyKeys.stats,
    queryFn: () => CompanyProfileService.getMyCompanyStats(token),
    enabled: !!token,
  });
};

export const useUpdateMyCompany = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => CompanyProfileService.updateMyCompany(payload, token),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: myCompanyKeys.profile });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    },
  });
};

export const useUpdateMyCompanySettings = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanySettingsPayload) =>
      CompanyProfileService.updateMyCompanySettings(payload, token),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: myCompanyKeys.profile });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to save settings";
      toast.error(message);
    },
  });
};
