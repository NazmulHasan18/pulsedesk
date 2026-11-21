"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_ALLOWED_ORIGINS } from "@/config/widget";
import { useUpdateMyCompanySettings } from "@/hooks/useMyCompany";

// Same normalisation as the backend: keep only scheme + host + port.
const toOrigin = (value: string): string | null => {
  const raw = value.trim();
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") || url.hostname === "localhost" ? url.origin : null;
  } catch {
    return null;
  }
};

export function AllowedWebsitesCard({ initialOrigins }: { initialOrigins: string[] }) {
  const { mutate: updateSettings, isPending } = useUpdateMyCompanySettings();
  const [origins, setOrigins] = useState(initialOrigins);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dirty = origins.join("\n") !== initialOrigins.join("\n");

  const add = () => {
    const origin = toOrigin(input);
    if (!origin) return setError("Enter a website address like https://shop.example.com");
    if (origins.includes(origin)) return setError("Already in the list");
    if (origins.length >= MAX_ALLOWED_ORIGINS) return setError(`Up to ${MAX_ALLOWED_ORIGINS} websites`);
    setOrigins([...origins, origin]);
    setInput("");
    setError(null);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Allowed websites</h2>
      <p className="text-sm text-muted-foreground">
        Only these websites can show your chat. Leave the list empty to allow any website.
      </p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input
          aria-label="Website address"
          placeholder="https://shop.example.com"
          value={input}
          state={error ? "error" : "default"}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
        />
        <Button type="submit" variant="outline" disabled={!input.trim()}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      {origins.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted-foreground">
          Any website can use your chat right now.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {origins.map((origin) => (
            <li key={origin} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="truncate font-mono text-sm text-ink">{origin}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${origin}`}
                onClick={() => setOrigins(origins.filter((o) => o !== origin))}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <Button onClick={() => updateSettings({ allowedOrigins: origins })} disabled={isPending || !dirty}>
          {isPending ? "Saving…" : "Save websites"}
        </Button>
      </div>
    </section>
  );
}
