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
    <div className="flex min-h-screen bg-background text-foreground md:p-4">
      <aside className="hidden w-56 shrink-0 flex-col rounded-[length:var(--card-radius)] border border-border bg-white shadow-[var(--shadow-float)] md:m-0 md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Sparkles className="size-4 text-light-signal-orange" aria-hidden />
          <div className="flex flex-col leading-none">
            <Link
              href="/dashboard"
              className="text-lg font-normal tracking-[-0.02em] text-foreground"
            >
              Kielimuisti
            </Link>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-2">
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
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal tracking-[-0.02em] transition-colors",
                  active
                    ? "bg-[#141413] text-[#F3F0EE] shadow-[var(--shadow-float)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 opacity-80" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border p-2">
          <UserMenu user={user} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-6">
        <header className="sticky top-0 z-40 flex flex-col border-b border-border bg-[#FCFBFA]/95 shadow-[var(--shadow-float)] backdrop-blur-sm md:hidden">
          <div className="flex h-12 items-center justify-between gap-2 px-4">
            <span className="text-sm font-normal tracking-[-0.02em] text-foreground">Kielimuisti</span>
            <div className="min-w-0 shrink">
              <UserMenu user={user} />
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-3 pb-3">
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
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-normal tracking-[-0.02em] transition-colors",
                    active
                      ? "bg-[#141413] text-[#F3F0EE]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 opacity-80" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 px-4 py-6 md:px-2 md:py-8">{children}</main>
      </div>
    </div>
  );
}
