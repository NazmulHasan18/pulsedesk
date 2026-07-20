import { decodeJwtExp } from "@/lib/jwt";
import { ApiEnvelope, CompanyInfo, DashboardSession, LoginResponseData, SuperAdminInfo } from "@/types/auth";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const json = (await res.json()) as ApiEnvelope<{ accessToken: string }>;
  return json.data.accessToken;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const json = (await res.json()) as ApiEnvelope<LoginResponseData>;
        if (!json.success) return null;

        const data = json.data;
        const isSuperAdmin = "superAdmin" in data;

        // Shape returned here becomes `user` in the jwt callback below.
        return {
          id: isSuperAdmin ? data.superAdmin.publicId : data.agent.publicId,
          userType: isSuperAdmin ? "superadmin" : "agent",
          agent: isSuperAdmin ? undefined : data.agent,
          company: isSuperAdmin ? undefined : data.company,
          superAdmin: isSuperAdmin ? data.superAdmin : undefined,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: `user` is whatever authorize() returned above
      if (user) {
        token.userType = user.userType;
        token.agent = user.agent;
        token.company = user.company;
        token.superAdmin = user.superAdmin;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = decodeJwtExp(user.accessToken) ?? 0;
        return token;
      }

      // Subsequent requests: token still valid, pass it through
      if (Date.now() < (token.accessTokenExpires as number) - 10_000) {
        return token;
      }

      // Expired: refresh
      try {
        const newAccessToken = await refreshAccessToken(token.refreshToken as string);
        token.accessToken = newAccessToken;
        token.accessTokenExpires = decodeJwtExp(newAccessToken) ?? 0;
        token.error = undefined;
        return token;
      } catch {
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      session.user.userType = token.userType as "agent" | "superadmin";
      session.user.agent = token.agent as DashboardSession extends {
        agent: infer A;
      }
        ? A
        : never;
      session.user.company = token.company as CompanyInfo;
      session.user.superAdmin = token.superAdmin as SuperAdminInfo;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
