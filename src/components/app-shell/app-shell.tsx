"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Settings,
  Sparkles,
} from "lucide-react";

import type { AuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { UserMenu } from "./user-menu";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/entries", label: "Entries", icon: Library },
  { href: "/review", label: "Review", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

type SessionUser = NonNullable<AuthSession>["user"];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border/80 bg-card/40 backdrop-blur-sm md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-border/80 px-4">
          <Sparkles className="size-4 text-muted-foreground" aria-hidden />
          <div className="flex flex-col leading-none">
            <Link href="/dashboard" className="text-lg font-semibold tracking-tight">Kielimuisti</Link>

          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4 opacity-80" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border/80 p-2">
          <UserMenu user={user} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col border-b border-border/80 md:hidden">
          <div className="flex h-12 items-center justify-between gap-2 px-4">
            <span className="text-sm font-medium">Kielimuisti</span>
            <div className="min-w-0 shrink">
              <UserMenu user={user} />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 opacity-80" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
