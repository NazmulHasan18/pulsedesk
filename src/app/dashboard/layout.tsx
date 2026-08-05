import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="mx-auto container px-4 py-8 sm:px-6">{children}</div>
    </main>
  );
};

export default DashboardLayout;
