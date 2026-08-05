import { fetcher } from "@/lib/fetcher";
import type {
  Company,
  CompanyStats,
  CreateCompanyPayload,
  ListCompaniesParams,
  ListCompaniesResponse,
  UpdateCompanyPayload,
} from "@/types/company";

const BASE = "/companies";

function buildQueryString(params: ListCompaniesParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// GET / (superadmin) — list companies
const listCompanies = async (
  params: ListCompaniesParams = {},
  token?: string,
): Promise<ListCompaniesResponse> => {
  return fetcher<ListCompaniesResponse>(`${BASE}${buildQueryString(params)}`, { token });
};

// GET /:companyId (superadmin)
const getCompany = async (companyId: string, token?: string): Promise<Company> => {
  return fetcher<Company>(`${BASE}/${companyId}`, { token });
};

// GET /:companyId/stats (superadmin)
const getCompanyStats = async (companyId: string, token?: string): Promise<CompanyStats> => {
  return fetcher<CompanyStats>(`${BASE}/${companyId}/stats`, { token });
};

// POST / (superadmin)
const createCompany = async (payload: CreateCompanyPayload, token?: string): Promise<Company> => {
  return fetcher<Company>(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
};

// PATCH /:companyId (superadmin)
const updateCompany = async (
  companyId: string,
  payload: UpdateCompanyPayload,
  token?: string,
): Promise<Company> => {
  return fetcher<Company>(`${BASE}/${companyId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    token,
  });
};

// DELETE /:companyId (superadmin)
const deleteCompany = async (companyId: string, token?: string): Promise<void> => {
  await fetcher<void>(`${BASE}/${companyId}`, {
    method: "DELETE",
    token,
  });
};

export const CompanyService = {
  listCompanies,
  getCompany,
  getCompanyStats,
  createCompany,
  updateCompany,
  deleteCompany,
};
