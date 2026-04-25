"use client";

import { LogOut, UserCircle2, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthSession } from "@/lib/auth";
import { performSignOut } from "@/lib/auth-sign-out";
import { cn } from "@/lib/utils";

type SessionUser = NonNullable<AuthSession>["user"];

export function UserMenu({ user }: { user: SessionUser }) {
  const label =
    (typeof user.name === "string" && user.name.trim()) ||
    (typeof user.username === "string" && user.username) ||
    user.email;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left text-xs text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <UserRound className="size-4 shrink-0 opacity-80" aria-hidden />
        <span className="truncate">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 cursor-pointer">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
            {"username" in user && typeof user.username === "string" && user.username ? (
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">@{user.username}</span>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 text-xs"
            onClick={() => {
              window.location.assign("/profile");
            }}
          >
            <UserCircle2 className="size-3.5 opacity-70" aria-hidden />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-xs"
            onClick={() => {
              void performSignOut();
            }}
          >
            <LogOut className="size-3.5 opacity-70" aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
