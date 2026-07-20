import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Inbox,
  MessageSquareText,
  Users,
  Globe,
  BookOpenText,
  BarChart3,
  CreditCard,
  Settings,
  Building2,
  ShieldCheck,
  ServerCog,
  LifeBuoy,
  Flag,
} from "lucide-react";
import { Session } from "next-auth";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

// --- AGENT (chat-only) ---------------------------------------------------
export const agentNav: NavSection[] = [
  {
    items: [
      { title: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: 5 },
      {
        title: "My Conversations",
        href: "/dashboard/conversations",
        icon: MessageSquareText,
      },
    ],
  },
];

// --- Company ADMIN (manages one company) ---------------------------------
export const companyAdminNav: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: 12 },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Agents", href: "/dashboard/agents", icon: Users },
      { title: "Widget & Site", href: "/dashboard/widget", icon: Globe },
      {
        title: "Knowledge Base",
        href: "/dashboard/knowledge-base",
        icon: BookOpenText,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "Company",
    items: [{ title: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

// --- SUPERADMIN (platform-wide) -------------------------------------------
export const superAdminNav: NavSection[] = [
  {
    label: "Platform",
    items: [
      { title: "Overview", href: "/superadmin", icon: LayoutDashboard },
      { title: "Companies", href: "/superadmin/companies", icon: Building2 },
      { title: "Agents & Users", href: "/superadmin/users", icon: Users },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Escalations", href: "/superadmin/escalations", icon: LifeBuoy },
      { title: "Feature Flags", href: "/superadmin/flags", icon: Flag },
      { title: "System Health", href: "/superadmin/system", icon: ServerCog },
    ],
  },
  {
    label: "Business",
    items: [{ title: "Billing & Plans", href: "/superadmin/billing", icon: CreditCard }],
  },
  {
    label: "Access",
    items: [
      { title: "Admin Roles", href: "/superadmin/roles", icon: ShieldCheck },
      { title: "Settings", href: "/superadmin/settings", icon: Settings },
    ],
  },
];

/**
 * Returns the correct nav tree for whoever is logged in.
 * - superadmin -> platform nav
 * - agent.role === "ADMIN" -> full company nav
 * - agent.role === "AGENT" -> chat-only nav
 */
export function getNavSections(session: Session | null): NavSection[] {
  if (session?.user?.userType === "superadmin") return superAdminNav;
  return session?.user?.agent?.role === "ADMIN" ? companyAdminNav : agentNav;
}
