import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function handleLogout() {
  const session = await getSession();

  try {
    const response = await fetch(`${baseApiUrl}/auth/logout`, {
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
  } catch {
    toast.error("Logout failed. Please try again.");
    return;
  }
}
