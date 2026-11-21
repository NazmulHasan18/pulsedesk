"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WIDGET_DEFAULTS } from "@/config/widget";
import { useUpdateMyCompanySettings } from "@/hooks/useMyCompany";
import type { CompanySettings } from "@/types/company";

const HEX = /^#[0-9a-f]{6}$/i;

interface AppearanceCardProps {
  companyName: string;
  settings: CompanySettings;
}

export function AppearanceCard({ companyName, settings }: AppearanceCardProps) {
  const { mutate: updateSettings, isPending } = useUpdateMyCompanySettings();

  const [displayName, setDisplayName] = useState(settings.displayName ?? companyName);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage ?? WIDGET_DEFAULTS.welcomeMessage);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor ?? WIDGET_DEFAULTS.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor ?? WIDGET_DEFAULTS.secondaryColor);
  const [widgetEnabled, setWidgetEnabled] = useState(settings.widgetEnabled ?? WIDGET_DEFAULTS.widgetEnabled);

  const errors = {
    displayName: displayName.trim().length === 0 ? "Required" : displayName.length > 60 ? "Max 60 characters" : null,
    welcomeMessage:
      welcomeMessage.trim().length === 0 ? "Required" : welcomeMessage.length > 500 ? "Max 500 characters" : null,
    primaryColor: HEX.test(primaryColor) ? null : "Use a hex colour like #4B4FE0",
    secondaryColor: HEX.test(secondaryColor) ? null : "Use a hex colour like #EEF0FF",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const save = () =>
    updateSettings({
      displayName: displayName.trim(),
      welcomeMessage: welcomeMessage.trim(),
      primaryColor,
      secondaryColor,
      widgetEnabled,
    });

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Appearance</h2>
      <p className="text-sm text-muted-foreground">What visitors see in the chat window.</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Chat widget enabled</p>
              <p className="text-xs text-muted-foreground">When off, the widget is hidden on your website.</p>
            </div>
            <Switch checked={widgetEnabled} onCheckedChange={setWidgetEnabled} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="widget-display-name">Display name</Label>
            <Input
              id="widget-display-name"
              value={displayName}
              maxLength={60}
              state={errors.displayName ? "error" : "default"}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {errors.displayName && <p className="text-xs text-danger">{errors.displayName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="widget-welcome">Welcome message</Label>
            <textarea
              id="widget-welcome"
              rows={3}
              maxLength={500}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus-visible:border-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-tint"
            />
            {errors.welcomeMessage && <p className="text-xs text-danger">{errors.welcomeMessage}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="widget-primary"
              label="Primary colour"
              hint="Launcher, your visitor's messages"
              value={primaryColor}
              error={errors.primaryColor}
              onChange={setPrimaryColor}
            />
            <ColorField
              id="widget-secondary"
              label="Secondary colour"
              hint="Light accent"
              value={secondaryColor}
              error={errors.secondaryColor}
              onChange={setSecondaryColor}
            />
          </div>
        </div>

        <WidgetPreview
          displayName={displayName || companyName}
          welcomeMessage={welcomeMessage}
          primaryColor={HEX.test(primaryColor) ? primaryColor : WIDGET_DEFAULTS.primaryColor}
          enabled={widgetEnabled}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={save} disabled={isPending || hasErrors}>
          {isPending ? "Saving…" : "Save appearance"}
        </Button>
      </div>
    </section>
  );
}

interface ColorFieldProps {
  id: string;
  label: string;
  hint: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}

function ColorField({ id, label, hint, value, error, onChange }: ColorFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={HEX.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-surface p-1"
        />
        <Input
          id={id}
          value={value}
          maxLength={7}
          state={error ? "error" : "default"}
          onChange={(e) => onChange(e.target.value.trim())}
          className="font-mono"
        />
      </div>
      <p className={error ? "text-xs text-danger" : "text-xs text-muted-foreground"}>{error ?? hint}</p>
    </div>
  );
}

interface WidgetPreviewProps {
  displayName: string;
  welcomeMessage: string;
  primaryColor: string;
  enabled: boolean;
}

function WidgetPreview({ displayName, welcomeMessage, primaryColor, enabled }: WidgetPreviewProps) {
  return (
    <div aria-hidden className={enabled ? "" : "opacity-50"}>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-surface px-4 py-3">
          <p className="truncate font-display text-sm font-semibold text-ink">{displayName}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-signal-tint px-2 py-0.5 text-[11px] font-semibold text-signal-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Agent online
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="max-w-[85%] self-start whitespace-pre-wrap break-words rounded-2xl rounded-bl-sm border border-line bg-surface px-3 py-2 text-[13px] text-ink">
            {welcomeMessage || "…"}
          </div>
          <div
            className="max-w-[85%] self-end rounded-2xl rounded-br-sm px-3 py-2 text-[13px] text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Hi! I have a question.
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <span className="h-12 w-12 rounded-full shadow-md" style={{ backgroundColor: primaryColor }} />
      </div>
      {!enabled && <p className="mt-2 text-xs text-muted-foreground">The widget is turned off.</p>}
    </div>
  );
}
