"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUpdateCompany } from "@/hooks/useCompanies";
import type { Company, CompanyPlan, CompanyStatus } from "@/types/company";

const PLAN_OPTIONS: CompanyPlan[] = ["FREE", "STARTER", "GROWTH", "ENTERPRISE"];
const STATUS_OPTIONS: CompanyStatus[] = ["ACTIVE", "TRIAL", "SUSPENDED"];

interface EditCompanySheetProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditCompanyFormProps {
  company: Company;
  onOpenChange: (open: boolean) => void;
}

function EditCompanyForm({ company, onOpenChange }: EditCompanyFormProps) {
  const [name, setName] = useState(company.name);
  const [plan, setPlan] = useState<CompanyPlan>(company.plan);
  const [status, setStatus] = useState<CompanyStatus>(company?.status || "ACTIVE");

  const { mutate: updateCompany, isPending } = useUpdateCompany(company.id);

  const handleSubmit = () => {
    updateCompany({ name, plan, status }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <>
      <div className="grid gap-4 px-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="edit-name">Company name</Label>
          <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="edit-plan">Plan</Label>
          <Select value={plan} onValueChange={(value) => setPlan(value as CompanyPlan)}>
            <SelectTrigger id="edit-plan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as CompanyStatus)}>
            <SelectTrigger id="edit-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </SheetFooter>
    </>
  );
}

export function EditCompanySheet({ company, open, onOpenChange }: EditCompanySheetProps) {
  const formKey = company ? `${company.id}-${open ? "open" : "closed"}` : "empty";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent key={formKey} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit company</SheetTitle>
          {/* <SheetDescription>{company?.slug}</SheetDescription> */}
        </SheetHeader>

        {company ? <EditCompanyForm company={company} onOpenChange={onOpenChange} /> : null}
      </SheetContent>
    </Sheet>
  );
}
