export type CompanyPlan = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";
export type CompanyStatus = "ACTIVE" | "TRIAL" | "SUSPENDED";

export interface Company {
  id: string;
  publicId: string;
  name: string;
  siteId: string;
  plan: CompanyPlan;
  status?: CompanyStatus;
  createdAt: string;
  updatedAt: string;
  counts: {
    agents: number;
    customers: number;
    conversations: number;
    faqDocs: number;
  };
}

export interface CompanySettings {
  brandColor: string;
  supportEmail: string;
  autoAssignAgents: boolean;
  aiFirstResponse: boolean;
  officeHoursTimezone: string;
}

export interface CompanyStats {
  company: Company;
  stats: {
    agents: {
      total: number;
      active: number;
      inactive: number;
    };
    customers: number;
    conversations: {
      total: number;
      open: number;
      pending: number;
      closed: number;
    };
    messages: number;
    faqDocs: number;
  };
}

export interface CreateCompanyPayload {
  companyName: string;
  adminName: string;
  email: string;
  plan?: CompanyPlan;
}

export interface UpdateCompanyPayload {
  name?: string;
  slug?: string;
  plan?: CompanyPlan;
  status?: CompanyStatus;
}

export interface UpdateCompanySettingsPayload {
  brandColor?: string;
  supportEmail?: string;
  autoAssignAgents?: boolean;
  aiFirstResponse?: boolean;
  officeHoursTimezone?: string;
}

export interface ListCompaniesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: CompanyStatus;
}

export interface ListCompaniesResponse {
  data: Company[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
