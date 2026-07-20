"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/helpers/handelLogout";
import { useSession } from "next-auth/react";

// Built directly from the real /auth/login payloads so the preview matches
// production data shapes exactly.

export default function SidebarPreviewPage() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar session={session} onLogout={handleLogout} />

      <main className="flex-1 p-6 md:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Preview as:</span>
          <Button>{session?.user.userType}</Button>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {session?.user?.userType === "superadmin" ? "Platform overview" : "Dashboard"}
        </h1>
        {/* render ui based on user type  */}
        <p className="mt-1 text-sm text-muted-foreground">
          This is a placeholder content area — swap it for the real page for each route once the dashboard
          backend is wired up.
        </p>
      </main>
    </div>
  );
}
