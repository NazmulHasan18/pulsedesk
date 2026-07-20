import { getSession, signOut } from "next-auth/react";

export async function handleLogout() {
  const session = await getSession();

  await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  await signOut({
    callbackUrl: "/login",
  });
}
