import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/apiResponse";
import type {
  Company,
  CompanySettings,
  CompanyStats,
  UpdateCompanyPayload,
  UpdateCompanySettingsPayload,
} from "@/types/company";

// GET /me/profile (agent, agentAdmin)
const getMyCompany = async (token?: string): Promise<ApiResponse<Company>> => {
  return fetcher<ApiResponse<Company>>("/companies/me/profile", { token });
};

// PATCH /me/profile (agent, agentAdmin)
const updateMyCompany = async (payload: UpdateCompanyPayload, token?: string): Promise<Company> => {
  return fetcher<Company>("/companies/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
    token,
  });
};

// PATCH /me/settings (agent, agentAdmin)
const updateMyCompanySettings = async (
  payload: UpdateCompanySettingsPayload,
  token?: string,
): Promise<CompanySettings> => {
  return fetcher<CompanySettings>("/companies/me/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
    token,
  });
};

// GET /me/stats (agent, agentAdmin)
const getMyCompanyStats = async (token?: string): Promise<ApiResponse<CompanyStats>> => {
  return fetcher<ApiResponse<CompanyStats>>("/companies/me/stats", { token });
};

export const CompanyProfileService = {
  getMyCompany,
  updateMyCompany,
  updateMyCompanySettings,
  getMyCompanyStats,
};
