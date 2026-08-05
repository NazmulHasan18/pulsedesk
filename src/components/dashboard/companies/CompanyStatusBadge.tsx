import { cn } from "@/lib/utils";
import type { CompanyStatus } from "@/types/company";

const STATUS_STYLES: Record<CompanyStatus, string> = {
  ACTIVE: "bg-signal-tint text-signal-ink",
  TRIAL: "bg-amber-tint text-amber-ink",
  SUSPENDED: "bg-danger-tint text-danger",
};

const STATUS_LABELS: Record<CompanyStatus, string> = {
  ACTIVE: "Active",
  TRIAL: "Trial",
  SUSPENDED: "Suspended",
};

interface CompanyStatusBadgeProps {
  status: CompanyStatus;
  className?: string;
}

export function CompanyStatusBadge({ status, className }: CompanyStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "ACTIVE" && "bg-signal-ink",
          status === "TRIAL" && "bg-amber-ink",
          status === "SUSPENDED" && "bg-danger",
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
