"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { SettingsSection } from "./settings-section";

type DangerZoneCardProps = {
  onExportData: () => void;
  onResetReviewProgress: () => void;
  onDeleteAccount: () => void;
};

function Row({
  label,
  description,
  action,
}: {
  label: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="sm:shrink-0">{action}</div>
    </div>
  );
}

export function DangerZoneCard({
  onExportData,
  onResetReviewProgress,
  onDeleteAccount,
}: DangerZoneCardProps) {
  return (
    <SettingsSection
      title="Danger Zone"
      description="Sensitive actions that affect your account data and progress."
      danger
    >
      <Row
        label="Export data"
        description="Download your entries and review history."
        action={
          <Button variant="secondary" onClick={onExportData}>
            Export data
          </Button>
        }
      />
      <Separator />
      <Row
        label="Reset review progress"
        description="Clear spaced repetition history and due states."
        action={
          <Button variant="outline" className="border-destructive/50 text-destructive" onClick={onResetReviewProgress}>
            Reset review progress
          </Button>
        }
      />
      <Separator />
      <Row
        label="Delete account"
        description="Permanently remove your account and all data."
        action={
          <Button variant="destructive" onClick={onDeleteAccount}>
            Delete account
          </Button>
        }
      />
    </SettingsSection>
  );
}
