"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronsRight, LogOut, Menu, MoreHorizontal, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { getNavSections } from "@/config/dashboard-nav";
import { Session } from "next-auth";

interface DashboardSidebarProps {
  session: Session | null;
  onLogout?: () => void;
  className?: string;
}

const ROLE_STYLES: Record<string, string> = {
  AGENT: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  SUPERADMIN: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
};

function getInitials(name: string) {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  } else return null;
}

function getIdentity(session: Session | null) {
  if (session?.user.userType === "superadmin") {
    return {
      name: session?.user?.superAdmin?.name,
      email: session?.user?.superAdmin?.email,
      roleLabel: "SUPERADMIN" as const,
      subLabel: "Platform",
    };
  }
  return {
    name: session?.user?.agent?.name,
    email: session?.user?.agent?.email,
    roleLabel: session?.user?.agent?.role,
    subLabel: session?.user?.company?.name,
  };
}

export function DashboardSidebar({ session, onLogout, className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [status, setStatus] = React.useState<"online" | "away">("online");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const sections = getNavSections(session);
  const identity = getIdentity(session);
  const isAgentOnly = session?.user.userType === "agent" && session?.user?.agent?.role === "AGENT";

  const content = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn("flex items-center gap-2 px-4 py-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
          P
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="whitespace-nowrap text-sm font-semibold leading-none">PulseDesk</p>
              <p className="mt-0.5 whitespace-nowrap text-xs text-sidebar-foreground/60">
                {identity.subLabel}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, idx) => (
          <div key={section.label ?? idx} className="mb-4">
            {section.label && !collapsed && (
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/45">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");

                const link = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                    {!collapsed && item.badge != null && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-5 justify-center rounded-full px-1 text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );

                if (!collapsed) return link;

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Availability toggle — only matters for chat-only agents */}
      {isAgentOnly && !collapsed && (
        <button
          onClick={() => setStatus((s) => (s === "online" ? "away" : "online"))}
          className="mx-2 mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          <Circle
            className={cn(
              "h-2 w-2 fill-current",
              status === "online" ? "text-emerald-500" : "text-amber-500",
            )}
          />
          {status === "online" ? "Available for chats" : "Away"}
        </button>
      )}

      {/* User menu */}
      <div className={cn("p-2", collapsed && "flex justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent",
                  collapsed && "w-auto justify-center",
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs">{getInitials(identity?.name as string)}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-none">{identity.name}</p>
                    <p className="mt-1 truncate text-xs text-sidebar-foreground/55">{identity.email}</p>
                  </div>
                )}
                {!collapsed && <MoreHorizontal className="h-4 w-4 text-sidebar-foreground/50" />}
              </button>
            }
          />
          <DropdownMenuContent align="end" side="top" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{identity.name}</p>
              <p className="text-xs text-muted-foreground">{identity.email}</p>
              <Badge
                variant="outline"
                className={cn("mt-2 text-[10px]", ROLE_STYLES[identity.roleLabel as string])}
              >
                {identity.roleLabel}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={toggleCollapsed}
        className="hidden items-center justify-center gap-2 border-t border-sidebar-border py-2 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent md:flex"
      >
        {collapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronsLeft className="h-4 w-4" /> Collapse
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile: sheet triggered by a floating menu button */}
      <div className="fixed left-3 top-3 z-40 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                size="icon"
                variant="outline"
                className="bg-background"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            }
          />

          <SheetContent side="left" className="w-64 p-0">
            {content}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: persistent collapsible rail */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border md:flex",
          className,
        )}
      >
        {content}
      </motion.aside>
    </>
  );
}
