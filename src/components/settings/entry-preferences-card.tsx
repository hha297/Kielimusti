"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { SettingsSection } from "./settings-section";
import { ToggleSwitch } from "./toggle-switch";

type EntryPreferences = {
  defaultEntryType: string;
  showExamplesByDefault: boolean;
  showSourceByDefault: boolean;
  preferRichTextForNotes: boolean;
};

type EntryPreferencesCardProps = {
  value: EntryPreferences;
  onChange: (next: EntryPreferences) => void;
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

export function EntryPreferencesCard({ value, onChange }: EntryPreferencesCardProps) {
  return (
    <SettingsSection title="Entry Preferences" description="Control defaults used when creating entries.">
      <Row
        label="Default entry type"
        description="Preselected type on the new entry form."
        control={
          <div className="w-full sm:w-56">
            <Select
              value={value.defaultEntryType}
              onValueChange={(next) => onChange({ ...value, defaultEntryType: next })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vocabulary">Vocabulary</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <Separator />
      <Row
        label="Show examples by default"
        description="Automatically display example fields in new entries."
        control={
          <ToggleSwitch
            checked={value.showExamplesByDefault}
            onCheckedChange={(next) => onChange({ ...value, showExamplesByDefault: next })}
            ariaLabel="Show examples by default"
          />
        }
      />
      <Separator />
      <Row
        label="Show source field by default"
        description="Keep source/reference input visible initially."
        control={
          <ToggleSwitch
            checked={value.showSourceByDefault}
            onCheckedChange={(next) => onChange({ ...value, showSourceByDefault: next })}
            ariaLabel="Show source field by default"
          />
        }
      />
      <Separator />
      <Row
        label="Prefer rich text for notes"
        description="Use rich text editing mode when creating note entries."
        control={
          <ToggleSwitch
            checked={value.preferRichTextForNotes}
            onCheckedChange={(next) => onChange({ ...value, preferRichTextForNotes: next })}
            ariaLabel="Prefer rich text for notes"
          />
        }
      />
    </SettingsSection>
  );
}
