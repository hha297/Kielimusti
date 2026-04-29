"use client";

import type { ReactNode } from "react";

import { LanguageSelect } from "@/features/entries/language-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { SettingsSection } from "./settings-section";

type LearningPreferences = {
  defaultLanguageSpace: string;
  dailyReviewGoal: string;
  reviewSessionSize: string;
};

type LearningPreferencesCardProps = {
  value: LearningPreferences;
  onChange: (next: LearningPreferences) => void;
};

function Row({
  label,
  description,
  control,
}: {
  label: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="w-full sm:w-56">{control}</div>
    </div>
  );
}

export function LearningPreferencesCard({ value, onChange }: LearningPreferencesCardProps) {
  return (
    <SettingsSection
      title="Learning Preferences"
      description="Set your default language context and review pacing."
    >
      <Row
        label="Default language space"
        description="Applies when you create new entries and start sessions."
        control={
          <LanguageSelect
            value={value.defaultLanguageSpace}
            onValueChange={(next) => onChange({ ...value, defaultLanguageSpace: next })}
            hideHeader
            className="space-y-0"
          />
        }
      />
      <Separator />
      <Row
        label="Daily review goal"
        description="Target number of items to review per day."
        control={
          <Select
            value={value.dailyReviewGoal}
            onValueChange={(next) => onChange({ ...value, dailyReviewGoal: next ?? "5" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 items</SelectItem>
              <SelectItem value="10">10 items</SelectItem>
              <SelectItem value="20">20 items</SelectItem>
              <SelectItem value="30">30 items</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <Separator />
      <Row
        label="Review session size"
        description="How many items to include per review session."
        control={
          <Select
            value={value.reviewSessionSize}
            onValueChange={(next) => onChange({ ...value, reviewSessionSize: next ?? "5" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 items</SelectItem>
              <SelectItem value="10">10 items</SelectItem>
              <SelectItem value="20">20 items</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </SettingsSection>
  );
}
