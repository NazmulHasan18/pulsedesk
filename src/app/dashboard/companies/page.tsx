"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyStatusBadge } from "@/components/dashboard/companies/CompanyStatusBadge";
import { CreateCompanyDialog } from "@/components/dashboard/companies/CreateCompanyDialog";
import { EditCompanySheet } from "@/components/dashboard/companies/EditCompanySheet";
import { DeleteCompanyDialog } from "@/components/dashboard/companies/DeleteCompanyDialog";
import { useCompanies } from "@/hooks/useCompanies";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);

  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);

  const { data, isLoading, isFetching } = useCompanies({
    page,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<Company>[] = [
    {
      key: "name",
      header: "Company",
      cell: (company) => (
        <Link
          href={`/dashboard/companies/${company.publicId}`}
          className="flex gap-2 items-center font-medium text-ink hover:underline"
        >
          <Building2 className="w-4 h-4"></Building2>
          {company.name}
          {/* <span className="ml-2 text-xs text-muted-foreground">{company.}</span> */}
        </Link>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      cell: (company) => (
        <span className="text-sm text-muted-foreground">
          {company.plan.charAt(0) + company.plan.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "agentCount",
      header: "Agents",
      cell: (company) => <span className="text-sm">{company.counts.agents}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (company) => <CompanyStatusBadge status={company?.status || "ACTIVE"} />,
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (company) => (
        <span className="text-sm text-muted-foreground">
          {new Date(company.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Every tenant workspace on PulseDesk, across all plans.
          </p>
        </div>
        <CreateCompanyDialog />
      </section>

      <section className="relative max-w-sm mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Search companies…"
          className="pl-9"
        />
      </section>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        getRowId={(company) => company.publicId}
        pagination={{
          page,
          totalPages: data?.meta.totalPages ?? 1,
          onPageChange: setPage,
        }}
        rowActions={(company) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  {...props}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-ink"
                  aria-label={`Actions for ${company.name}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              )}
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={(props) => (
                  <Link {...props} href={`/dashboard/companies/${company.publicId}`}>
                    View details
                  </Link>
                )}
              ></DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditTarget(company)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteTarget(company)}
                className="text-danger focus:text-danger"
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        emptyState={{
          title: "No companies yet",
          description: "Create the first tenant workspace to get started.",
        }}
      />

      <EditCompanySheet
        company={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />
      <DeleteCompanyDialog
        company={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
