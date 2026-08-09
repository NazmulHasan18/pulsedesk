import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard/dashboard-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  if (session?.user.userType === "agent" && session?.user.agent?.role === "AGENT") {
    redirect("/dashboard/inbox");
  }

  // Assumes your discriminated-union session type exposes `role`.
  const role = session.user.userType;

  return <DashboardShell role={role} />;
}
