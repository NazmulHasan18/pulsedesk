"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const snippet = `<script
  src="https://cdn.pulsedesk.dev/widget.js"
  data-site-id="aurora-skincare-7f2c"
  async
></script>`;

export function EmbedSection() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid items-center gap-12 rounded-3xl border border-line bg-ink p-10 text-paper lg:grid-cols-2 lg:p-16">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-amber">Setup</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            No SDK. No build step.
            <br />
            One tag.
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Your site-id scopes every conversation, FAQ, and agent to your company alone — so the platform
            stays shared, but your data never is.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0e12] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="font-mono text-xs text-white/40">index.html</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-signal" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/90">
            <code>
              <span className="text-white/40">&lt;script</span>
              {"\n"}
              {"  "}
              <span className="text-[#8fd3ff]">src</span>=
              <span className="text-[#b8f0c2]">&quot;https://cdn.pulsedesk.dev/widget.js&quot;</span>
              {"\n"}
              {"  "}
              <span className="text-[#8fd3ff]">data-site-id</span>=
              <span className="text-amber">&quot;aurora-skincare-7f2c&quot;</span>
              {"\n"}
              {"  "}
              <span className="text-[#8fd3ff]">async</span>
              {"\n"}
              <span className="text-white/40">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
