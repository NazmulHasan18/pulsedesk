"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      // TODO: wire up to the real auth endpoint once it exists.
      // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(values) })
      await new Promise((resolve) => setTimeout(resolve, 900));
      console.log("login submit", values);
    } catch {
      setFormError("Couldn't sign you in. Check your details and try again.");
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to PulseDesk"
      subtitle="Jump back into your inbox and pick up where your agents or AI left off."
      footer={
        <>
          Don&apos;t have a workspace yet?{" "}
          <Link href="/signup" className="font-medium text-indigo hover:text-(--indigo-dark)">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            state={errors.email ? "error" : "default"}
            aria-invalid={!!errors.email}
            {...register("email", {
              required: "Enter your email address.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-xs font-medium text-indigo hover:text-(--indigo-dark)"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              state={errors.password ? "error" : "default"}
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register("password", {
                required: "Enter your password.",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FormError message={errors.password?.message} />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-(--line-strong) text-indigo focus-visible:ring-(--indigo-tint)"
            {...register("remember")}
          />
          Keep me signed in
        </label>

        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
