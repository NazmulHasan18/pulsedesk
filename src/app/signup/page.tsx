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
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SignupFormValues = {
  adminName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    mode: "onBlur",
    defaultValues: {
      adminName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  type ApiErrorResponse = {
    success: false;
    message: string;
    errorSources?: {
      path: string;
      message: string;
    }[];
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/register-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const apiError = data as ApiErrorResponse;

        if (apiError.errorSources?.length) {
          apiError.errorSources.forEach(({ path, message }) => {
            // Convert "body.adminName" to "adminName"
            const field = path.replace(/^body\./, "");

            const validFields: (keyof SignupFormValues)[] = [
              "adminName",
              "companyName",
              "email",
              "password",
              "confirmPassword",
              "terms",
            ];

            if (validFields.includes(field as keyof SignupFormValues)) {
              setError(field as keyof SignupFormValues, {
                type: "server",
                message,
              });
            }
          });
        } else {
          setError("root.serverError", {
            type: "server",
            message: apiError.message || "Something went wrong.",
          });
        }

        return;
      } else {
        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
          type: "user",
          redirect: false,
        });

        if (response?.error) {
          toast.error("Invalid email or password.");
        } else {
          router.push(`/dashboard`);
          toast.success("User login success.", { position: "top-right" });
        }
      }

      // Handle successful registration here
      console.log("Registration successful:", data);
    } catch {
      setError("root.serverError", {
        type: "server",
        message: "Unable to connect to the server. Please try again.",
      });
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your PulseDesk workspace"
      subtitle="Set up your team's live chat in minutes - the widget and AI fallback ship on your first FAQ import."
      footer={
        <>
          Already have a workspace?{" "}
          <Link href="/login" className="font-medium text-indigo underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <Label htmlFor="adminName">Full name</Label>
          <Input
            id="adminName"
            type="text"
            autoComplete="adminName"
            placeholder="Amara Chen"
            state={errors.adminName ? "error" : "default"}
            aria-invalid={!!errors.adminName}
            {...register("adminName", { required: "Enter your name." })}
          />
          <FormError message={errors.adminName?.message} />
        </div>

        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Inc."
            state={errors.companyName ? "error" : "default"}
            aria-invalid={!!errors.companyName}
            {...register("companyName", { required: "Enter your company name." })}
          />
          <FormError message={errors.companyName?.message} />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-line-strong text-indigo focus-visible:ring-indigo-tint"
              {...register("terms", {
                required: "You need to accept the terms to continue.",
              })}
            />
            <span>
              I agree to PulseDesk&apos;s{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline-offset-4 hover:text-indigo hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline-offset-4 hover:text-indigo hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FormError message={errors.terms?.message} />
        </div>

        {/* {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )} */}

        <Button type="submit" disabled={isSubmitting || !!errors.confirmPassword?.message} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create workspace
        </Button>
      </form>
    </AuthShell>
  );
}
