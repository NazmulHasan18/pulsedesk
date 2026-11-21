"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildInstallSnippet } from "@/config/widget";

export function InstallSnippetCard({ siteId }: { siteId: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = buildInstallSnippet(siteId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Select the snippet and copy it manually.");
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Install the widget</h2>
          <p className="text-sm text-muted-foreground">
            Paste this just before <code className="font-mono text-xs">&lt;/body&gt;</code> on every page where
            the chat should appear.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-signal" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy snippet"}
        </Button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed text-ink">
        <code>{snippet}</code>
      </pre>

      <p className="mt-3 text-xs text-muted-foreground">
        Site ID: <span className="font-mono text-ink">{siteId}</span>. It is public and only identifies your
        workspace. Use allowed websites below to control where the chat can run.
      </p>
    </section>
  );
}
