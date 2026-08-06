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
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type LoginFormValues = {
  email: string;
  password: string;
  superadmin: boolean;
};

type DemoAccountOption = {
  label: string;
  email: string;
  password: string;
  superadmin: boolean;
};

const demoAccounts: DemoAccountOption[] = [
  {
    label: "Superadmin",
    email: "superadmin@pulsedesk.dev",
    password: "ChangeMe123!",
    superadmin: true,
  },
  {
    label: "Company Admin",
    email: "admin@khati-vai.com",
    password: "TemporaryPassword123!",
    superadmin: false,
  },
  {
    label: "Company Agent",
    email: "agent1@khativai.com",
    password: "PD-uFYTdlVPqIw_",
    superadmin: false,
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { status } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    defaultValues: { email: "", password: "", superadmin: false },
  });

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to PulseDesk"
        subtitle="Jump back into your inbox and pick up where your agents or AI left off."
        footer={<Skeleton className="h-4 w-full" />}
      >
        <div className="space-y-5">
          {/* Demo buttons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="grid gap-2 sm:grid-cols-3">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-36" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </AuthShell>
    );
  }
  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      // remember might be used in future
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        type: values.superadmin ? "admin" : "user",
        redirect: false,
      });
      console.log(response);
      if (response?.error) {
        toast.error("Invalid email or password.");
      } else {
        router.push(`/dashboard`);
        toast.success("User login success.", { position: "top-right" });
      }
      console.log("login submit", values);
    } catch {
      setFormError("Couldn't sign you in. Check your details and try again.");
    }
  };

  const handleQuickLogin = async (account: DemoAccountOption) => {
    setValue("email", account.email);
    setValue("password", account.password);
    setValue("superadmin", account.superadmin);

    await onSubmit({
      email: account.email,
      password: account.password,
      superadmin: account.superadmin,
    });
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to PulseDesk"
      subtitle="Jump back into your inbox and pick up where your agents or AI left off."
      footer={
        <>
          Don&apos;t have a workspace yet?{" "}
          <Link href="/signup" className="font-medium text-indigo underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <div className="mb-5 space-y-2">
        <p className="text-sm font-medium text-foreground">Quick demo login</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {demoAccounts.map((account) => (
            <Button
              key={account.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleQuickLogin(account)}
              className="w-full justify-center"
            >
              {account.label}
            </Button>
          ))}
        </div>
      </div>

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
              className="mb-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-indigo"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter you password"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FormError message={errors.password?.message} />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line-strong text-indigo focus-visible:ring-indigo-tint"
            {...register("superadmin")}
          />
          <span>Login as superadmin</span>
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
