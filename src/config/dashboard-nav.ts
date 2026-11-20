import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Inbox, MessageSquareText, Users, Globe, Settings, Building2 } from "lucide-react";
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

// Pages that are still placeholders (analytics, billing, knowledge base, users,
// escalations, flags, system, roles) stay out of the nav until they are built.

// --- AGENT (chat-only) ---------------------------------------------------
export const agentNav: NavSection[] = [
  {
    items: [
      { title: "Inbox", href: "/dashboard/inbox", icon: Inbox },
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
      { title: "Inbox", href: "/dashboard/inbox", icon: Inbox },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Agents", href: "/dashboard/agents", icon: Users },
      { title: "Widget & Site", href: "/dashboard/widget", icon: Globe },
    ],
  },
  {
    label: "Company",
    items: [{ title: "Settings", href: "/dashboard/settings/company", icon: Settings }],
  },
];

// --- SUPERADMIN (platform-wide) -------------------------------------------
export const superAdminNav: NavSection[] = [
  {
    label: "Platform",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Companies", href: "/dashboard/companies", icon: Building2 },
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
