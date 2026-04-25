"use client";

import { format } from "date-fns";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { performSignOut } from "@/lib/auth-sign-out";
import { cn } from "@/lib/utils";

import { ChangePasswordForm } from "./change-password-form";

export type ProfileUserPayload = {
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  username: string | null;
  displayUsername: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "PPp");
  } catch {
    return iso;
  }
}

function row(label: string, value: string) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="min-w-0 wrap-break-word text-right text-sm text-foreground sm:text-left">{value}</span>
    </div>
  );
}

export function ProfileView({ user }: { user: ProfileUserPayload }) {
  const displayName = user.name.trim() || user.email;
  const handle = user.username ? `@${user.username}` : "—";
  const displayHandle = user.displayUsername?.trim() ? user.displayUsername : "—";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account details and security.</p>
      </div>

      <Card className="border-border/80 bg-card/60 shadow-none">
        <CardHeader className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div
            className={cn(
              "flex size-24 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/50 text-muted-foreground",
            )}
            aria-hidden
          >
            {user.image ? (
              <img
                src={user.image}
                alt={`Avatar for ${displayName}`}
                className="size-24 rounded-2xl object-cover"
              />
            ) : (
              <UserRound className="size-12 opacity-80" strokeWidth={1.25} />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-xl leading-tight">{displayName}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">{user.email}</CardDescription>
            {user.username ? (
              <p className="text-sm text-muted-foreground">
                Username <span className="font-medium text-foreground">{handle}</span>
                {user.displayUsername && user.displayUsername !== user.username ? (
                  <span className="block text-xs">Display: {user.displayUsername}</span>
                ) : null}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {row("Name", user.name || "—")}
            <Separator />
            {row("Email", user.email)}
            <Separator />
            {row("Username", handle)}
            <Separator />
            {row("Display username", displayHandle)}
            <Separator />
            {row("Email verified", user.emailVerified ? "Yes" : "No")}
            <Separator />
            {row("Created", formatDate(user.createdAt))}
            <Separator />
            {row("Last updated", formatDate(user.updatedAt))}
          </div>
        </CardContent>
      </Card>

      <ChangePasswordForm />

      <Button
        type="button"
        variant="secondary"
        className="w-full cursor-pointer sm:w-auto"
        onClick={() => void performSignOut()}
      >
        Sign out
      </Button>
    </div>
  );
}
