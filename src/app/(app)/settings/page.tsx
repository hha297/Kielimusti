"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { AppearanceSettingsCard } from "@/components/settings/appearance-settings-card";
import { DangerZoneCard } from "@/components/settings/danger-zone-card";
import { EntryPreferencesCard } from "@/components/settings/entry-preferences-card";
import { LearningPreferencesCard } from "@/components/settings/learning-preferences-card";
import { ReviewPreferencesCard } from "@/components/settings/review-preferences-card";
import { Button } from "@/components/ui/button";

const defaultSettings = {
  learning: {
    defaultLanguageSpace: "fi",
    dailyReviewGoal: "10",
    reviewSessionSize: "10",
  },
  entry: {
    defaultEntryType: "vocabulary",
    showExamplesByDefault: true,
    showSourceByDefault: false,
    preferRichTextForNotes: true,
  },
  review: {
    enableSpacedRepetition: true,
    includeWeakItemsInReview: true,
    typedAnswerStrictness: "normal" as const,
    reviewModes: {
      flashcard: true,
      multipleChoice: true,
      cloze: false,
      typedRecall: true,
    },
  },
  appearance: {
    theme: "dark" as const,
    compactLayout: false,
    reduceMotion: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Header
        eyebrow="Preferences"
        title="Settings"
        description="Customize how Kielimuisti works for your learning."
        className="sm:items-start"
      />

      <div className="grid gap-6">
        <LearningPreferencesCard
          value={settings.learning}
          onChange={(learning) => setSettings((prev) => ({ ...prev, learning }))}
        />
        <EntryPreferencesCard
          value={settings.entry}
          onChange={(entry) => setSettings((prev) => ({ ...prev, entry }))}
        />
        <ReviewPreferencesCard
          value={settings.review}
          onChange={(review) => setSettings((prev) => ({ ...prev, review }))}
        />
        <AppearanceSettingsCard
          value={settings.appearance}
          onChange={(appearance) => setSettings((prev) => ({ ...prev, appearance }))}
        />
        <DangerZoneCard
          onExportData={() => toast.info("Coming soon")}
          onResetReviewProgress={() => toast.info("Coming soon")}
          onDeleteAccount={() => toast.info("Coming soon")}
        />
      </div>

      <div>
        <Button
          onClick={() => {
            toast.success("Settings saved locally. Persistence coming soon.");
          }}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
}
