"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateAgent } from "@/hooks/use-agents";
import type { Agent } from "@/types/agent";

const editSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  role: z.enum(["AGENT", "ADMIN"]),
});

type EditFormValues = z.infer<typeof editSchema>;

export function EditAgentSheet({
  agent,
  onOpenChange,
}: {
  agent: Agent | null;
  onOpenChange: (open: boolean) => void;
}) {
  const updateAgent = useUpdateAgent();
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: agent?.name ?? "", role: agent?.role ?? "AGENT" },
  });

  const role = useWatch({
    control: form.control,
    name: "role",
  });
  useEffect(() => {
    if (agent) form.reset({ name: agent.name, role: agent.role });
  }, [agent, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!agent) return;
    await updateAgent.mutateAsync({ agentId: agent.publicId, payload: values });
    onOpenChange(false);
  });

  return (
    <Sheet open={!!agent} onOpenChange={onOpenChange}>
      <SheetContent className="border-line bg-surface sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-display text-ink">Edit agent</SheetTitle>
          <SheetDescription>{agent?.email}</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-danger">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => form.setValue("role", value as EditFormValues["role"])}
            >
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGENT">Agent</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              disabled={updateAgent.isPending}
              className="w-full bg-indigo text-white hover:bg-indigo-dark"
            >
              {updateAgent.isPending ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
