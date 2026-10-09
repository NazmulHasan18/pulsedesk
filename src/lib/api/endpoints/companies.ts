import { baseApi, runRequest } from "../base-api";
import { CompanyProfileService } from "@/services/company-profile.service";
import { CompanyService } from "@/services/company.service";
import type { ApiResponse } from "@/types/apiResponse";
import type { Company, CompanySettings, CompanyStats, CreateCompanyPayload, ListCompaniesParams, ListCompaniesResponse, UpdateCompanyPayload, UpdateCompanySettingsPayload } from "@/types/company";

type AuthArgs = { token?: string };

export const companiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    companies: builder.query<ListCompaniesResponse, AuthArgs & { params: ListCompaniesParams }>({ queryFn: ({ params, token }) => runRequest(CompanyService.listCompanies(params, token)), providesTags: ["Companies"] }),
    company: builder.query<ApiResponse<Company>, AuthArgs & { companyId: string }>({ queryFn: ({ companyId, token }) => runRequest(CompanyService.getCompany(companyId, token)), providesTags: ["Companies"] }),
    companyStats: builder.query<ApiResponse<CompanyStats>, AuthArgs & { companyId: string }>({ queryFn: ({ companyId, token }) => runRequest(CompanyService.getCompanyStats(companyId, token)), providesTags: ["Companies"] }),
    createCompany: builder.mutation<Company, AuthArgs & { payload: CreateCompanyPayload }>({ queryFn: ({ payload, token }) => runRequest(CompanyService.createCompany(payload, token)), invalidatesTags: ["Companies"] }),
    updateCompany: builder.mutation<Company, AuthArgs & { companyId: string; payload: UpdateCompanyPayload }>({ queryFn: ({ companyId, payload, token }) => runRequest(CompanyService.updateCompany(companyId, payload, token)), invalidatesTags: ["Companies"] }),
    deleteCompany: builder.mutation<void, AuthArgs & { companyId: string }>({ queryFn: ({ companyId, token }) => runRequest(CompanyService.deleteCompany(companyId, token)), invalidatesTags: ["Companies"] }),
    myCompany: builder.query<ApiResponse<Company>, AuthArgs>({ queryFn: ({ token }) => runRequest(CompanyProfileService.getMyCompany(token)), providesTags: ["MyCompany"] }),
    myCompanyStats: builder.query<ApiResponse<CompanyStats>, AuthArgs>({ queryFn: ({ token }) => runRequest(CompanyProfileService.getMyCompanyStats(token)), providesTags: ["MyCompany"] }),
    updateMyCompany: builder.mutation<Company, AuthArgs & { payload: UpdateCompanyPayload }>({ queryFn: ({ payload, token }) => runRequest(CompanyProfileService.updateMyCompany(payload, token)), invalidatesTags: ["MyCompany"] }),
    updateMyCompanySettings: builder.mutation<CompanySettings, AuthArgs & { payload: UpdateCompanySettingsPayload }>({ queryFn: ({ payload, token }) => runRequest(CompanyProfileService.updateMyCompanySettings(payload, token)), invalidatesTags: ["MyCompany"] }),
  }),
});

export const { useCompaniesQuery, useCompanyQuery, useCompanyStatsQuery, useCreateCompanyMutation, useUpdateCompanyMutation, useDeleteCompanyMutation, useMyCompanyQuery, useMyCompanyStatsQuery, useUpdateMyCompanyMutation, useUpdateMyCompanySettingsMutation } = companiesApi;
