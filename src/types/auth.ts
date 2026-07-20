// Mirrors the /auth/login response shapes for both user types.
// Agents and company ADMINs log in through the same endpoint and are
// distinguished by `agent.role`. Super admins hit a separate endpoint.

export type AgentRole = "AGENT" | "ADMIN";

export interface AgentUser {
  publicId: string;
  name: string;
  email: string;
  role: AgentRole;
}

export interface Company {
  publicId: string;
  name: string;
  siteId: string;
}

export interface SuperAdminUser {
  publicId: string;
  name: string;
  email: string;
}

export interface AgentSession {
  userType: "agent";
  agent: AgentUser;
  company: Company;
}

export interface SuperAdminSession {
  userType: "superadmin";
  superAdmin: SuperAdminUser;
}

// export type DashboardSession = AgentSession | SuperAdminSession;

// Convenience helpers for narrowing in components
export function isSuperAdminSession(session: DashboardSession): session is SuperAdminSession {
  return session.userType === "superadmin";
}

export function isCompanyAdmin(session: DashboardSession): boolean {
  return session.userType === "agent" && session.agent.role === "ADMIN";
}

export function isAgentOnly(session: DashboardSession): boolean {
  return session.userType === "agent" && session.agent.role === "AGENT";
}
export type UserRole = "AGENT" | "ADMIN";

export interface AgentInfo {
  publicId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  isOnline?: boolean;
}

export interface CompanyInfo {
  publicId: string;
  name: string;
  siteId: string;
  plan?: "free" | "pro" | "enterprise";
}

export interface SuperAdminInfo {
  publicId: string;
  name: string;
  email: string;
}

export type DashboardSession =
  | {
      userType: "agent";
      agent: AgentInfo;
      company: CompanyInfo;
    }
  | {
      userType: "superadmin";
      superAdmin: SuperAdminInfo;
    };

// Raw backend envelope shapes (kept separate from the UI-facing DashboardSession
// so a backend field rename doesn't ripple through every component)
export interface LoginResponseAgent {
  agent: AgentInfo;
  company: Omit<CompanyInfo, "plan">;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseSuperAdmin {
  superAdmin: SuperAdminInfo;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponseData = LoginResponseAgent | LoginResponseSuperAdmin;

export interface MeResponseAgent {
  userType: "agent";
  publicId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isOnline: boolean;
  company: CompanyInfo;
}

export interface MeResponseSuperAdmin {
  userType: "superadmin";
  publicId: string;
  name: string;
  email: string;
}

export type MeResponseData = MeResponseAgent | MeResponseSuperAdmin;

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
