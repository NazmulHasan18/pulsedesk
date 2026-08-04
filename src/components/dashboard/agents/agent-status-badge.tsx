import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: { dot: "bg-signal", text: "text-signal-ink", bg: "bg-signal-tint", label: "Active" },
  inactive: { dot: "bg-line-strong", text: "text-muted-foreground", bg: "bg-muted", label: "Suspended" },
} as const;

export function AgentStatusBadge({ isActive }: { isActive: boolean }) {
  const s = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
