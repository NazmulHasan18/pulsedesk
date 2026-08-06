"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCompany } from "@/hooks/useCompanies";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateCompanyPayload } from "@/types/company";

const PLAN_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "STARTER", label: "Starter" },
  { value: "GROWTH", label: "Growth" },
  { value: "ENTERPRISE", label: "Enterprise" },
] as const;

// Password intentionally omitted — not required for this form

export function CreateCompanyDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createCompany, isPending } = useCreateCompany();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateCompanyPayload>({
    mode: "onChange",
    defaultValues: {
      companyName: "",
      adminName: "",
      email: "",
      plan: "FREE",
    },
  });

  const onSubmit = (values: CreateCompanyPayload) => {
    createCompany(
      {
        companyName: values.companyName,
        adminName: values.adminName,
        email: values.email,
        plan: values.plan,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={(props) => (
          <Button {...props} className="gap-2">
            <Plus className="size-4" />
            New company
          </Button>
        )}
      ></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a company</DialogTitle>
          <DialogDescription>
            Add a new tenant workspace. The owner gets an invite email to set their password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              placeholder="Acme Inc."
              {...register("companyName", {
                required: "Company name is required",
                minLength: { value: 2, message: "Too short" },
              })}
            />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-name">Admin name</Label>
            <Input
              id="admin-name"
              placeholder="Jane Doe"
              {...register("adminName", {
                required: "Admin name is required",
                minLength: { value: 2, message: "Too short" },
              })}
            />
            {errors.adminName && <p className="text-xs text-destructive">{errors.adminName.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="owner-email">Owner email</Label>
            <Input
              id="owner-email"
              type="email"
              placeholder="owner@acme.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="plan">Plan</Label>
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? "Creating…" : "Create company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
