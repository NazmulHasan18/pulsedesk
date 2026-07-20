import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export async function handleLogout() {
  const session = await getSession();

  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!response.ok) {
    toast.error("Logout failed. Please try again.");
    return;
  }

  await signOut({
    callbackUrl: "/login",
  });
}
