"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { SettingsSection } from "./settings-section";
import { ToggleSwitch } from "./toggle-switch";

type AppearancePreferences = {
  theme: "dark";
  compactLayout: boolean;
  reduceMotion: boolean;
};

type AppearanceSettingsCardProps = {
  value: AppearancePreferences;
  onChange: (next: AppearancePreferences) => void;
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

export function AppearanceSettingsCard({ value, onChange }: AppearanceSettingsCardProps) {
  return (
    <SettingsSection title="Appearance" description="Keep visuals focused and consistent across learning flows.">
      <Row
        label="Theme"
        description="Theme switching can be added later."
        control={
          <div className="w-full sm:w-56">
            <Select disabled value={value.theme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <Separator />
      <Row
        label="Compact layout"
        description="Reduce spacing density for tighter information display."
        control={
          <ToggleSwitch
            checked={value.compactLayout}
            onCheckedChange={(next) => onChange({ ...value, compactLayout: next })}
            ariaLabel="Compact layout"
          />
        }
      />
      <Separator />
      <Row
        label="Reduce motion"
        description="Use fewer UI animations across pages."
        control={
          <ToggleSwitch
            checked={value.reduceMotion}
            onCheckedChange={(next) => onChange({ ...value, reduceMotion: next })}
            ariaLabel="Reduce motion"
          />
        }
      />
    </SettingsSection>
  );
}
