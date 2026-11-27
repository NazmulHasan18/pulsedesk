"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { registerSessionRefresher } from "@/lib/session-refresh";

// Keeps the access token usable for code outside React (see session-refresh),
// and signs out when the refresh token itself has expired.
export function SessionKeeper() {
  const { data: session, update } = useSession();

  useEffect(() => {
    registerSessionRefresher(async () => (await update())?.accessToken);
    return () => registerSessionRefresher(null);
  }, [update]);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  return null;
}
