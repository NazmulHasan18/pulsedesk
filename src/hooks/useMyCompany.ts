import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useMyCompanyQuery, useMyCompanyStatsQuery, useUpdateMyCompanyMutation, useUpdateMyCompanySettingsMutation } from "@/lib/api";
import type { UpdateCompanyPayload, UpdateCompanySettingsPayload } from "@/types/company";

export const useMyCompany = () => { const { data: s } = useSession(); return useMyCompanyQuery({ token: s?.accessToken }, { skip: !s?.accessToken }); };
export const useMyCompanyStats = () => { const { data: s } = useSession(); return useMyCompanyStatsQuery({ token: s?.accessToken }, { skip: !s?.accessToken }); };
export const useUpdateMyCompany = () => { const { data: s } = useSession(); const [trigger, state] = useUpdateMyCompanyMutation(); return { ...state, isPending: state.isLoading, mutate: (payload: UpdateCompanyPayload) => trigger({ payload, token: s?.accessToken }).unwrap().then(() => toast.success("Profile updated")).catch((e) => toast.error(e.message || "Failed to update profile")) }; };
export const useUpdateMyCompanySettings = () => { const { data: s } = useSession(); const [trigger, state] = useUpdateMyCompanySettingsMutation(); return { ...state, isPending: state.isLoading, mutate: (payload: UpdateCompanySettingsPayload) => trigger({ payload, token: s?.accessToken }).unwrap().then(() => toast.success("Settings saved")).catch((e) => toast.error(e.message || "Failed to save settings")) }; };
