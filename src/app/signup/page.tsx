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

type SignupFormValues = {
  name: string;
  company: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    try {
      // TODO: wire up to the real auth endpoint once it exists.
      // await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(values) })
      await new Promise((resolve) => setTimeout(resolve, 900));
      console.log("signup submit", values);
    } catch {
      setFormError("Couldn't create your workspace. Please try again.");
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your PulseDesk workspace"
      subtitle="Set up your team's live chat in minutes — the widget and AI fallback ship on your first FAQ import."
      footer={
        <>
          Already have a workspace?{" "}
          <Link href="/login" className="font-medium text-indigo hover:text-(--indigo-dark)">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Amara Chen"
            state={errors.name ? "error" : "default"}
            aria-invalid={!!errors.name}
            {...register("name", { required: "Enter your name." })}
          />
          <FormError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder="Acme Inc."
            state={errors.company ? "error" : "default"}
            aria-invalid={!!errors.company}
            {...register("company", { required: "Enter your company name." })}
          />
          <FormError message={errors.company?.message} />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              state={errors.password ? "error" : "default"}
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register("password", {
                required: "Choose a password.",
                minLength: {
                  value: 8,
                  message: "Use at least 8 characters.",
                },
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

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            state={errors.confirmPassword ? "error" : "default"}
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Confirm your password.",
              validate: (value) => value === getValues("password") || "Passwords don't match.",
            })}
          />
          <FormError message={errors.confirmPassword?.message} />
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-(--line-strong) text-indigo focus-visible:ring-(--indigo-tint)"
              {...register("terms", {
                required: "You need to accept the terms to continue.",
              })}
            />
            <span>
              I agree to PulseDesk&apos;s{" "}
              <Link href="/terms" className="font-medium text-ink underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-ink underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FormError message={errors.terms?.message} />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting || !!errors.confirmPassword?.message} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create workspace
        </Button>
      </form>
    </AuthShell>
  );
}
