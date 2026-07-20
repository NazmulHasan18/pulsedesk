"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Sender = "visitor" | "ai" | "agent";

type Beat =
  | { kind: "message"; from: Sender; text: string; meta?: string }
  | { kind: "typing"; from: Sender }
  | { kind: "status"; text: string };

type Script = {
  prompt: string;
  beats: Beat[];
};

const scripts: Script[] = [
  {
    prompt: "Do you ship to Canada?",
    beats: [
      { kind: "message", from: "visitor", text: "Hey — do you ship to Canada?" },
      { kind: "typing", from: "ai" },
      {
        kind: "message",
        from: "ai",
        text: "Yes! We ship to Canada in 4–6 business days. Orders over $60 CAD ship free.",
        meta: "Matched: Shipping & delivery FAQ",
      },
      { kind: "message", from: "visitor", text: "Perfect, and can I use two discount codes together?" },
      { kind: "status", text: "No close match found — routing to an agent" },
      { kind: "status", text: "Maya joined the conversation" },
      {
        kind: "message",
        from: "agent",
        text: "Hi, I'm Maya! Only one code per order, but I can stack your loyalty points on top for you 🙂",
      },
    ],
  },
  {
    prompt: "My order hasn't arrived yet",
    beats: [
      { kind: "message", from: "visitor", text: "My order #4021 hasn't arrived, it's been 9 days" },
      { kind: "typing", from: "ai" },
      {
        kind: "message",
        from: "ai",
        text: "Sorry about that! Orders past 7 days are flagged automatically — I've escalated #4021 to an agent.",
        meta: "No confident FAQ match — escalating",
      },
      { kind: "status", text: "Jordan joined the conversation" },
      {
        kind: "message",
        from: "agent",
        text: "Hi, I've got #4021 open here — looks like it's stuck at customs. Reshipping now, no charge.",
      },
    ],
  },
];

const TYPE_MS = 26;

function useTypewriter(text: string, active: boolean) {
  const [shown, setShown] = useState(() => (active ? "" : text));
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [text, active]);
  return shown;
}

function Avatar({ from }: { from: Sender }) {
  if (from === "visitor") {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
        <User className="h-3.5 w-3.5" />
      </div>
    );
  }
  if (from === "ai") {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--amber-tint) text-(--amber-ink)">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--signal-tint) text-(--signal-ink) text-[11px] font-semibold">
      M
    </div>
  );
}

function Bubble({ beat, isLatest }: { beat: Extract<Beat, { kind: "message" }>; isLatest: boolean }) {
  const typed = useTypewriter(beat.text, isLatest && beat.from !== "visitor");
  const text = beat.from === "visitor" || !isLatest ? beat.text : typed;
  const isVisitor = beat.from === "visitor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-end gap-2", isVisitor && "flex-row-reverse")}
    >
      <Avatar from={beat.from} />
      <div className={cn("max-w-[78%]", isVisitor && "flex flex-col items-end")}>
        {beat.meta && (
          <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-(--amber-ink)">
            <Sparkles className="h-2.5 w-2.5" /> {beat.meta}
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug shadow-sm",
            isVisitor
              ? "rounded-br-sm bg-indigo text-white"
              : "rounded-bl-sm bg-surface text-ink border border-line",
          )}
        >
          {text}
          {isLatest && text.length < beat.text.length && <span className="caret-blink">▍</span>}
        </div>
        {isVisitor && (
          <span className="mt-1 flex items-center gap-0.5 text-[10px] text-white/0">
            <CheckCheck className="h-3 w-3 text-(--indigo)/0" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function ChatWidgetDemo() {
  const [scriptIndex, setScriptIndex] = useState(0);
  const [beatCount, setBeatCount] = useState(1);
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const script = scripts[scriptIndex];

  useEffect(() => {
    if (beatCount >= script.beats.length) {
      const id = setTimeout(() => {
        setScriptIndex((s) => (s + 1) % scripts.length);
        setBeatCount(1);
      }, 3200);
      return () => clearTimeout(id);
    }
    const current = script.beats[beatCount - 1];
    const delay =
      current.kind === "typing"
        ? 1100
        : current.kind === "status"
          ? 900
          : current.from === "visitor"
            ? 900
            : Math.min(4200, 700 + current.text.length * TYPE_MS);
    const id = setTimeout(() => setBeatCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [beatCount, script]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [beatCount, scriptIndex]);

  const visible = script.beats.slice(0, beatCount);
  const lastMessageIdx = [...visible].reverse().findIndex((b) => b.kind === "message");
  const lastMessageAbsIdx = lastMessageIdx === -1 ? -1 : visible.length - 1 - lastMessageIdx;

  function replay(i: number) {
    setScriptIndex(i);
    setBeatCount(1);
  }

  return (
    <div className="relative">
      {/* mock browser chrome */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_-30px_rgba(20,23,28,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-paper px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6a355]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e4b94f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fb87a]" />
          <div className="ml-3 flex-1 truncate rounded-md bg-surface px-3 py-1 text-[11px] text-muted-foreground border border-line">
            khativai.com
          </div>
        </div>

        <div className="relative h-105 bg-linear-to-b from-paper to-surface">
          {/* faux page content behind widget */}
          <div className="space-y-3 p-6 opacity-70">
            <div className="h-3 w-32 rounded-full bg-line" />
            <div className="h-6 w-56 rounded-full bg-line" />
            <div className="h-3 w-full max-w-xs rounded-full bg-line" />
            <div className="h-3 w-40 rounded-full bg-line" />
          </div>

          {/* widget panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="absolute bottom-4 right-4 flex h-95 w-75 flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-xl"
              >
                <div className="flex items-center justify-between bg-ink px-4 py-3 text-paper">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                    </span>
                    <span className="text-[13px] font-medium">Aurora Support</span>
                  </div>
                  <span className="text-[10px] text-white/50">via PulseDesk</span>
                </div>

                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3 scrollbar-none">
                  {visible.map((beat, i) => {
                    if (beat.kind === "message") {
                      return <Bubble key={i} beat={beat} isLatest={i === lastMessageAbsIdx} />;
                    }
                    if (beat.kind === "typing") {
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Avatar from={beat.from} />
                          <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-3">
                            {[0, 1, 2].map((d) => (
                              <span
                                key={d}
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                                style={{ animationDelay: `${d * 0.12}s` }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center"
                      >
                        <span className="rounded-full bg-foreground/5 px-3 py-1 text-[10.5px] font-medium text-muted-foreground">
                          {beat.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 border-t border-line bg-surface px-3 py-2.5">
                  <div className="flex-1 truncate rounded-full bg-foreground/5 px-3 py-2 text-[12px] text-muted-foreground">
                    Write a message…
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo text-white shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* scenario switcher */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Try a scenario:</span>
        {scripts.map((s, i) => (
          <button
            key={s.prompt}
            onClick={() => replay(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              scriptIndex === i
                ? "border-ink bg-ink text-paper"
                : "border-(--line-strong) text-ink hover:border-ink",
            )}
          >
            {s.prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
