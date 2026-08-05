"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Mail,
  Copy,
  Check,
  Pencil,
  MoreVertical,
  KeyRound,
  ShieldCheck,
  UserMinus,
  MessageSquare,
  Clock,
  CheckCircle2,
  Bot,
  Building2,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgentDetails } from "@/hooks/use-agents";

/* ------------------------------------------------------------------ */
/* Sample data — shape matches the Agent API response                 */
/* ------------------------------------------------------------------ */

const agent = {
  publicId: "cmrrycor50001fkltu291n7gw",
  name: "Agent Nazmul",
  email: "agent2@khativai.com",
  role: "AGENT",
  isActive: true,
  isOnline: false,
  createdAt: "2026-07-19T15:30:18.833Z",
  updatedAt: "2026-08-03T15:45:24.331Z",
};

const company = { name: "Khativai Store" };

const weeklyActivity = [
  { d: "Mon", v: 6 },
  { d: "Tue", v: 11 },
  { d: "Wed", v: 8 },
  { d: "Thu", v: 14 },
  { d: "Fri", v: 10 },
  { d: "Sat", v: 4 },
  { d: "Sun", v: 2 },
];

const recentConversations: {
  id: string;
  customer: string;
  subject: string;
  status: "OPEN" | "RESOLVED" | "PENDING";
  fromAi: boolean;
  updated: string;
}[] = [
  {
    id: "c1",
    customer: "Rifat Karim",
    subject: "Refund not received for order #KH-1182",
    status: "OPEN",
    fromAi: true,
    updated: "2026-08-05T09:12:00.000Z",
  },
  {
    id: "c2",
    customer: "Shirin Akter",
    subject: "Can't apply promo code at checkout",
    status: "PENDING",
    fromAi: true,
    updated: "2026-08-04T18:40:00.000Z",
  },
  {
    id: "c3",
    customer: "Tanvir Ahmed",
    subject: "Delivery address change request",
    status: "RESOLVED",
    fromAi: false,
    updated: "2026-08-04T11:02:00.000Z",
  },
  {
    id: "c4",
    customer: "Nusrat Jahan",
    subject: "Product arrived damaged — replacement",
    status: "RESOLVED",
    fromAi: true,
    updated: "2026-08-03T15:47:00.000Z",
  },
  {
    id: "c5",
    customer: "Imran Hossain",
    subject: "Question about warranty coverage",
    status: "OPEN",
    fromAi: false,
    updated: "2026-08-03T09:20:00.000Z",
  },
];

const stats = [
  { label: "Total conversations", value: "312", icon: MessageSquare, delta: "+18 this week" },
  { label: "Avg. response time", value: "4m 12s", icon: Clock, delta: "−38s vs last week" },
  { label: "Resolution rate", value: "94%", icon: CheckCircle2, delta: "+2.1%" },
  { label: "Handed off by AI", value: "68%", icon: Bot, delta: "of this agent's chats" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const statusStyles = {
  OPEN: "bg-teal-500/10 text-teal-400",
  PENDING: "bg-amber-500/10 text-amber-400",
  RESOLVED: "bg-slate-500/10 text-slate-400",
};

/* ------------------------------------------------------------------ */
/* Signature element: pulse/presence indicator, tied to online status  */
/* ------------------------------------------------------------------ */

function PresencePulse({ online }: { online: boolean }) {
  const path = online ? "M0 12 H10 L14 4 L20 20 L24 12 H34 L38 6 L42 18 L46 12 H60" : "M0 12 H60";
  return (
    <div className="flex items-center gap-2 mt-3">
      <svg viewBox="0 0 60 24" width="52" height="20" fill="none">
        <motion.path
          d={path}
          stroke={online ? "#2dd4bf" : "#475569"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <span
        className={`h-1.5 w-1.5 rounded-full -ml-1 ${online ? "bg-teal-400 animate-pulse" : "bg-slate-600"}`}
      />
      <span className={`text-xs ${online ? "text-teal-400" : "text-slate-500"}`}>
        {online ? "Online now" : "Offline"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page — Company Admin › Team › Agent                            */
/* ------------------------------------------------------------------ */

export default function AdminAgentDetailPage() {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, isFetching } = useAgentDetails({
    agentId: agent.publicId,
  });
  console.log(data);
  const handleCopy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const sortedConvos = useMemo(
    () =>
      [...recentConversations].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
    [],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
          <span>Company Admin</span>
          <ChevronRight size={12} />
          <span>Team</span>
          <ChevronRight size={12} />
          <span className="text-slate-300">{agent.name}</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6 flex items-start justify-between flex-wrap gap-5">
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 border border-slate-800">
                  <AvatarFallback className="bg-slate-800 text-teal-400 font-display text-lg">
                    {initials(agent.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-2xl">{agent.name}</h1>
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-slate-400 uppercase text-[10px] tracking-wide"
                    >
                      {agent.role}
                    </Badge>
                    <Badge
                      className={`text-[10px] uppercase tracking-wide border-0 ${
                        agent.isActive ? "bg-teal-500/10 text-teal-400" : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {agent.isActive ? "Active" : "Deactivated"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-2">
                    <Mail size={13} />
                    {agent.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building2 size={12} />
                    Member of {company.name} since {formatDate(agent.createdAt)}
                  </div>
                  <PresencePulse online={agent.isOnline} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800 hover:border-teal-500"
                >
                  <Pencil size={14} className="mr-1.5" />
                  Edit agent
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={(props) => (
                      <Button
                        {...props}
                        variant="outline"
                        size="icon"
                        className="border-slate-700 bg-slate-800"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    )}
                  ></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                    <DropdownMenuItem className="gap-2">
                      <ShieldCheck size={14} />
                      Promote to Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <KeyRound size={14} />
                      Reset password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem className="gap-2 text-rose-400 focus:text-rose-400">
                      <UserMinus size={14} />
                      Remove from company
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
            >
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <s.icon size={16} className="text-slate-500" />
                  <div className="font-mono-dm text-2xl mt-3">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                  <div className="text-[11px] text-teal-400 mt-2">{s.delta}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart + conversations / metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Conversation volume · 7 days
                </div>
                <div style={{ height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyActivity} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="pdArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <YAxis hide domain={[0, "dataMax + 4"]} />
                      <Tooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#2dd4bf"
                        strokeWidth={2}
                        fill="url(#pdArea)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <Separator className="my-4 bg-slate-800" />

                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Recent conversations
                </div>
                <div className="flex flex-col">
                  {sortedConvos.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.04 * i }}
                      className="grid grid-cols-[1.3fr_2fr_auto_auto] items-center gap-3 py-3 border-b border-slate-800/60 last:border-0"
                    >
                      <div className="text-sm">{c.customer}</div>
                      <div className="text-sm text-slate-400 truncate">{c.subject}</div>
                      {c.fromAi ? (
                        <Badge
                          variant="outline"
                          className="border-slate-700 text-slate-400 gap-1 text-[10px]"
                        >
                          <Bot size={11} />
                          AI handoff
                        </Badge>
                      ) : (
                        <span />
                      )}
                      <Badge className={`text-[10px] border-0 ${statusStyles[c.status]}`}>{c.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Agent details
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Agent ID</span>
                  <button
                    onClick={handleCopy}
                    className="font-mono-dm text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {agent.publicId.slice(0, 14)}…
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Company</span>
                  <span className="text-xs">{company.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Role</span>
                  <span className="text-xs">{agent.role}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Created</span>
                  <span className="text-xs">{formatDate(agent.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Last updated</span>
                  <span className="text-xs">{formatDate(agent.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-rose-900/40">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-rose-400">Danger zone</div>
                <p className="text-xs text-slate-500">
                  Removing this agent revokes their access immediately and reassigns open conversations.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rose-900/60 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 w-full"
                >
                  <UserMinus size={14} className="mr-1.5" />
                  Remove from company
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
