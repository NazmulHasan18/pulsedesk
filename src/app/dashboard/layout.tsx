import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RealtimeProvider } from "@/Providers/RealtimeProvider";

import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RealtimeProvider>
      <main className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="mx-auto container px-4 py-8 sm:px-6">{children}</div>
      </main>
    </RealtimeProvider>
  );
};

export default DashboardLayout;
