import type { AgentInfo, CompanyInfo, SuperAdminInfo } from "@/types/auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: string;
    user: {
      userType: "agent" | "superadmin";
      agent?: AgentInfo;
      company?: CompanyInfo;
      superAdmin?: SuperAdminInfo;
    };
  }

  interface User {
    userType: "agent" | "superadmin";
    agent?: AgentInfo;
    company?: CompanyInfo;
    superAdmin?: SuperAdminInfo;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType: "agent" | "superadmin";
    agent?: AgentInfo;
    company?: CompanyInfo;
    superAdmin?: SuperAdminInfo;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
