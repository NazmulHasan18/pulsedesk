"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyStatusBadge } from "@/components/dashboard/companies/CompanyStatusBadge";
import { CompanyStatsCards } from "@/components/dashboard/companies/CompanyStatsCards";
import { EditCompanySheet } from "@/components/dashboard/companies/EditCompanySheet";
import { DeleteCompanyDialog } from "@/components/dashboard/companies/DeleteCompanyDialog";
import { useCompany, useCompanyStats } from "@/hooks/useCompanies";

interface CompanyDetailPageProps {
  params: Promise<{ companyId: string }>;
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { companyId } = use(params);
  const { data: companyData, isLoading } = useCompany(companyId);
  const { data: stats, isLoading: statsLoading } = useCompanyStats(companyId);
  const company = companyData?.data;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink">Company not found</p>
        <p className="text-sm text-muted-foreground">It may have been removed already.</p>
        <Link href="/dashboard/companies" className="mt-2 text-sm text-indigo hover:underline">
          Back to companies
        </Link>
      </div>
    );
  }
  console.log(company);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard/companies"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Companies
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold text-ink">{company.name}</h1>
              <CompanyStatusBadge status={company.status || "ACTIVE"} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {company.name} · {company.siteId} ·{" "}
              {company?.plan?.charAt(0) + company?.plan?.slice(1).toLowerCase()} plan
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-danger hover:bg-danger-tint hover:text-danger"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>

      <CompanyStatsCards stats={stats?.data} isLoading={statsLoading} />

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-base font-semibold text-ink">Widget key</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Used to authenticate the embeddable widget for this tenant.
        </p>
        <code className="mt-3 block w-fit rounded-lg bg-muted px-3 py-2 font-mono text-xs text-ink">
          {"abcd"}
        </code>
      </div>

      <EditCompanySheet company={company} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteCompanyDialog company={company} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
}
