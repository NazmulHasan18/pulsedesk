import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "indigo" | "signal" | "amber" | "danger";
  className?: string;
}

const TONE_ICON_WRAP: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted text-ink",
  indigo: "bg-indigo-tint text-indigo-dark",
  signal: "bg-signal-tint text-signal-ink",
  amber: "bg-amber-tint text-amber-ink",
  danger: "bg-danger-tint text-danger",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "default", className }: StatCardProps) {
  return (
    <Card
      className={cn("shadow-panel-soft transition-shadow duration-200 hover:shadow-card-hover", className)}
    >
      <CardContent className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tabular-nums text-ink">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div
          className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", TONE_ICON_WRAP[tone])}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </CardContent>
    </Card>
  );
}
