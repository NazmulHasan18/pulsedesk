"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyStatsCards } from "@/components/dashboard/companies/CompanyStatsCards";
import {
  useMyCompany,
  useMyCompanyStats,
  useUpdateMyCompany,
  useUpdateMyCompanySettings,
} from "@/hooks/useMyCompany";

export default function CompanySettingsPage() {
  const { data: company, isLoading } = useMyCompany();
  const { data: stats, isLoading: statsLoading } = useMyCompanyStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Company settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace profile and support preferences.
        </p>
      </div>

      <CompanyStatsCards stats={stats} isLoading={statsLoading} />

      {isLoading || !company ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Support preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <ProfileForm name={company.name} slug={company.name} />
          </TabsContent>

          <TabsContent value="preferences" className="mt-4">
            <SettingsForm />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ProfileForm({ name: initialName, slug }: { name: string; slug: string }) {
  const [name, setName] = useState(initialName);
  const { mutate: updateMyCompany, isPending } = useUpdateMyCompany();

  return (
    <div className="max-w-lg rounded-2xl border border-line bg-surface p-5">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Company name</Label>
          <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label>Slug</Label>
          <Input value={slug} disabled className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Contact a superadmin to change your workspace slug.</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={() => updateMyCompany({ name })} disabled={isPending || name.trim().length < 2}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function SettingsForm() {
  // const { data: company } = useMyCompany();
  const { mutate: updateSettings, isPending } = useUpdateMyCompanySettings();

  const [supportEmail, setSupportEmail] = useState("");
  const [autoAssignAgents, setAutoAssignAgents] = useState(false);
  const [aiFirstResponse, setAiFirstResponse] = useState(true);

  return (
    <div className="max-w-lg rounded-2xl border border-line bg-surface p-5">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="support-email">Support email</Label>
          <Input
            id="support-email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Auto-assign agents</p>
            <p className="text-xs text-muted-foreground">
              Route new conversations to available agents automatically.
            </p>
          </div>
          <Switch checked={autoAssignAgents} onCheckedChange={setAutoAssignAgents} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">AI-first response</p>
            <p className="text-xs text-muted-foreground">
              Let the AI reply first, with human handoff on request or low confidence.
            </p>
          </div>
          <Switch checked={aiFirstResponse} onCheckedChange={setAiFirstResponse} />
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={() => updateSettings({ supportEmail, autoAssignAgents, aiFirstResponse })}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
