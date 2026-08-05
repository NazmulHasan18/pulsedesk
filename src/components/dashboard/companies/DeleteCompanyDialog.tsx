"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCompany } from "@/hooks/useCompanies";
import type { Company } from "@/types/company";

interface DeleteCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCompanyDialog({ company, open, onOpenChange }: DeleteCompanyDialogProps) {
  const { mutate: deleteCompany, isPending } = useDeleteCompany();

  const handleConfirm = () => {
    if (!company) return;
    deleteCompany(company.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {company?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This soft-deletes the company and revokes access for all of its agents. Conversation history is
            retained and can be restored later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-danger text-white hover:bg-danger/90"
          >
            {isPending ? "Removing…" : "Remove company"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
