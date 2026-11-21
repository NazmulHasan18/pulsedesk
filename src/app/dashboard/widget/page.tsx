"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AllowedWebsitesCard } from "@/components/dashboard/widget/allowed-websites-card";
import { AppearanceCard } from "@/components/dashboard/widget/appearance-card";
import { InstallSnippetCard } from "@/components/dashboard/widget/install-snippet-card";
import { useMyCompany } from "@/hooks/useMyCompany";

export default function WidgetPage() {
  const { data, isLoading, isError } = useMyCompany();
  const company = data?.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Widget & Site</h1>
        <p className="text-sm text-muted-foreground">Add live chat to your website and choose how it looks.</p>
      </div>

      {isError ? (
        <p className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted-foreground">
          Couldn&apos;t load your workspace. Only company admins can manage the widget.
        </p>
      ) : isLoading || !company ? (
        <div className="grid gap-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <InstallSnippetCard siteId={company.siteId} />
          {/* key: re-seed the forms from the server after a save */}
          <AppearanceCard
            key={`appearance-${company.updatedAt}`}
            companyName={company.name}
            settings={company.settings ?? {}}
          />
          <AllowedWebsitesCard
            key={`origins-${company.updatedAt}`}
            initialOrigins={company.settings?.allowedOrigins ?? []}
          />
        </>
      )}
    </div>
  );
}
