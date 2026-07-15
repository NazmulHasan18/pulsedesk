import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--line-strong)] text-[var(--ink)] bg-transparent",
        signal: "border-transparent bg-[var(--signal-tint)] text-[var(--signal-ink)]",
        amber: "border-transparent bg-[var(--amber-tint)] text-[var(--amber-ink)]",
        indigo: "border-transparent bg-[var(--indigo-tint)] text-[var(--indigo)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
