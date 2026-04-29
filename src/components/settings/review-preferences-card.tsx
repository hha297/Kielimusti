"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { SettingsSection } from "./settings-section";
import { ToggleSwitch } from "./toggle-switch";

export type ReviewMode = "flashcard" | "multipleChoice" | "cloze" | "typedRecall";

type ReviewPreferences = {
  enableSpacedRepetition: boolean;
  includeWeakItemsInReview: boolean;
  typedAnswerStrictness: "lenient" | "normal" | "strict";
  reviewModes: Record<ReviewMode, boolean>;
};

type ReviewPreferencesCardProps = {
  value: ReviewPreferences;
  onChange: (next: ReviewPreferences) => void;
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
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}

const reviewModeLabels: Record<ReviewMode, string> = {
  flashcard: "Flashcard",
  multipleChoice: "Multiple choice",
  cloze: "Cloze",
  typedRecall: "Typed recall",
};

export function ReviewPreferencesCard({ value, onChange }: ReviewPreferencesCardProps) {
  const setMode = (mode: ReviewMode, checked: boolean) => {
    onChange({
      ...value,
      reviewModes: {
        ...value.reviewModes,
        [mode]: checked,
      },
    });
  };

  return (
    <SettingsSection title="Review Preferences" description="Tune how review sessions are generated and graded.">
      <Row
        label="Enable spaced repetition"
        description="Prioritize items by memory strength and due schedule."
        control={
          <ToggleSwitch
            checked={value.enableSpacedRepetition}
            onCheckedChange={(next) => onChange({ ...value, enableSpacedRepetition: next })}
            ariaLabel="Enable spaced repetition"
          />
        }
      />
      <Separator />
      <Row
        label="Include weak items in review"
        description="Include items you frequently miss in regular sessions."
        control={
          <ToggleSwitch
            checked={value.includeWeakItemsInReview}
            onCheckedChange={(next) => onChange({ ...value, includeWeakItemsInReview: next })}
            ariaLabel="Include weak items in review"
          />
        }
      />
      <Separator />
      <Row
        label="Typed answer strictness"
        description="Choose how strict typed recall evaluation should be."
        control={
          <div className="w-full sm:w-56">
            <Select
              value={value.typedAnswerStrictness}
              onValueChange={(next: "lenient" | "normal" | "strict") =>
                onChange({ ...value, typedAnswerStrictness: next })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lenient">Lenient</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="strict">Strict</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <Separator />
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Review modes</Label>
          <p className="text-xs text-muted-foreground">Choose which activity types are included in sessions.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(reviewModeLabels) as ReviewMode[]).map((mode) => (
            <label
              key={mode}
              className="flex items-center justify-between rounded-[1rem] border border-border bg-background px-3 py-2"
            >
              <span className="text-sm">{reviewModeLabels[mode]}</span>
              <input
                type="checkbox"
                checked={value.reviewModes[mode]}
                onChange={(event) => setMode(mode, event.target.checked)}
                className="size-4 rounded border-border accent-[#141413]"
              />
            </label>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}
