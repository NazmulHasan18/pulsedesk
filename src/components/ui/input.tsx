import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink " +
    "placeholder:text-muted-foreground transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
    "focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "focus-visible:border-indigo focus-visible:ring-indigo-tint",
        error: "border-danger focus-visible:border-danger focus-visible:ring-danger-tint",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, state, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ state }), className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input, inputVariants };
