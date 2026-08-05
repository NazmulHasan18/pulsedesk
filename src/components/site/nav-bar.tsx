"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { handleLogout } from "@/helpers/handelLogout";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#pricing", label: "Pricing" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data } = useSession();
  const user = data?.user?.userType === "agent" ? data.user.agent : data?.user?.superAdmin;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route/hash navigation
  const closeMobile = () => setMobileOpen(false);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="pulse-ring absolute inline-flex h-full w-full text-signal" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">PulseDesk</span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Desktop auth area */}
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(props) => (
                    <button
                      {...props}
                      className="flex items-center gap-2 rounded-full border border-line px-2 py-1.5 pr-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
                      title={user.name}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={"/"} alt={user.name ?? "User"} />
                        <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-30 truncate">{user.name ?? user.email}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                ></DropdownMenuTrigger>
                <DropdownMenuGroup>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="cursor-pointer flex gap-2 items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile" className="cursor-pointer flex gap-2 items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-danger focus:text-danger"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuGroup>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-ink hover:text-indigo">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="sm">
                    Start for free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 border-t border-line pt-3">
            {user ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={"/"} alt={user.name ?? "User"} />
                    <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium text-ink">{user.name ?? user.email}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-ink hover:bg-surface"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-ink hover:bg-surface"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    closeMobile();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-danger hover:bg-surface"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="rounded-md px-2 py-2 text-sm font-medium text-ink hover:bg-surface"
                >
                  Log in
                </Link>
                <Link href="/signup" onClick={closeMobile}>
                  <Button variant="outline" size="sm" className="w-full">
                    Start for free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
