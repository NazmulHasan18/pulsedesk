import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-11 w-full rounded-lg border bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)] " +
    "placeholder:text-[var(--muted)] transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
    "focus-visible:ring-offset-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default:
          "border-[var(--line)] focus-visible:border-[var(--indigo)] focus-visible:ring-[var(--indigo-tint)]",
        error:
          "border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger-tint)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ state }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
