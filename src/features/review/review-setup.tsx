"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleSwitch } from "@/components/settings/toggle-switch";
import { LanguageFlag } from "@/components/language-flag";
import { getWorldLanguage } from "@/constants/world-languages";

import { buildQuestions } from "./review-question-builder";
import { ReviewSession } from "./review-session";
import type { ReviewEntryRow, ReviewMode, ReviewQuestion, ReviewSetupState } from "./review-types";

type ReviewSetupProps = {
  rows: ReviewEntryRow[];
};

const MODE_CATALOG: Array<{ id: ReviewMode; title: string; description: string; supports: string }> = [
  { id: "flashcard", title: "Flashcard", description: "Reveal and self-rate your recall.", supports: "Vocabulary, Grammar" },
  { id: "multiple-choice", title: "Multiple choice", description: "Pick the best answer from options.", supports: "Vocabulary, Grammar" },
  { id: "typed-recall", title: "Typed recall", description: "Type the answer from memory.", supports: "Vocabulary, Grammar" },
  { id: "cloze", title: "Cloze from example", description: "Fill missing word in example sentence.", supports: "Vocabulary" },
  { id: "pattern-drill", title: "Pattern drill", description: "Write your own grammar example sentence.", supports: "Grammar" },
];

const REVIEW_STEPS = [
  { id: 1 as const, label: "Language" },
  { id: 2 as const, label: "Content & mode" },
  { id: 3 as const, label: "Session options" },
];

const DEFAULT_SETUP: ReviewSetupState = {
  language: "",
  contentType: "vocabulary",
  mode: "flashcard",
  direction: "mixed",
  sessionSize: 10,
  source: "due",
  includeExamples: true,
};

export function ReviewSetup({ rows }: ReviewSetupProps) {
  const [setup, setSetup] = useState<ReviewSetupState>(DEFAULT_SETUP);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [questions, setQuestions] = useState<ReviewQuestion[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    for (const row of rows) {
      if (row.type !== "vocabulary") continue;
      if (!row.title?.trim()) continue;
      for (const code of row.languages ?? []) set.add(code);
    }
    return [...set].sort((a, b) => {
      const na = getWorldLanguage(a)?.name ?? a;
      const nb = getWorldLanguage(b)?.name ?? b;
      return na.localeCompare(nb, undefined, { sensitivity: "base" });
    });
  }, [rows]);

  const hasLanguageOptions = languageOptions.length > 0;
  const effectiveLanguage =
    setup.language && languageOptions.includes(setup.language)
      ? setup.language
      : (languageOptions[0] ?? "");

  const availableModes = useMemo(
    () =>
      MODE_CATALOG.filter((mode) =>
        setup.contentType === "vocabulary"
          ? mode.id !== "pattern-drill"
          : mode.id !== "cloze",
      ),
    [setup.contentType],
  );

  const invalidMode =
    (setup.contentType === "vocabulary" && setup.mode === "pattern-drill") ||
    (setup.contentType === "grammar" && setup.mode === "cloze");
  const step2Validation = useMemo(() => {
    if (!effectiveLanguage) return { valid: false, message: "Select a language first." };
    const probe = buildQuestions(rows, {
      ...setup,
      language: effectiveLanguage,
      source: "all",
      sessionSize: 5,
    });
    if (probe.questions.length > 0) return { valid: true, message: null as string | null };
    return { valid: false, message: probe.reason ?? "No questions available for this mode yet." };
  }, [effectiveLanguage, rows, setup]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {questions ? (
        <ReviewSession
          setup={setup}
          questions={questions}
          onExit={() => {
            setQuestions(null);
            setStep(2);
          }}
        />
      ) : (
        <>
          <Header
            eyebrow="Practice"
            title="Review"
            description="Practice from your own saved knowledge."
            className="sm:items-start"
          />

          <div className="rounded-[1.25rem] border border-border bg-white p-5 shadow-(--shadow-float)">
            <div className="relative">
              <div className="absolute top-4 right-12 left-4 h-1 rounded-full bg-border/70">
                <div
                  className={[
                    "h-full bg-[#141413] transition-all duration-300"
                  ].join(" ")}
                  style={{ width: `${((step - 1) / (REVIEW_STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex items-center justify-between">
                {REVIEW_STEPS.map((item) => {
                  const active = item.id <= step;
                  const current = item.id === step;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.id <= step && setStep(item.id)}
                      className="flex flex-col items-center gap-2"
                    >
                      <span
                        className={[
                          "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                          active
                            ? "border-[#141413] bg-[#141413] text-[#F3F0EE]"
                            : "border-border bg-background text-muted-foreground",
                          current ? "ring-4 ring-black/10" : "",
                        ].join(" ")}
                      >
                        {item.id}
                      </span>
                      <div className="space-y-0.5 text-center">
                        <p className={item.id <= step ? "text-sm font-medium text-foreground uppercase" : "text-sm text-muted-foreground uppercase"}>
                          {item.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {step === 1 ? (
            <Card className="border-border bg-card shadow-[var(--shadow-float)]">
              <CardHeader>
                <CardTitle>Choose language</CardTitle>
                <CardDescription>Pick which language space to review first.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasLanguageOptions ? (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-xs text-muted-foreground">
                        Only languages that already have entries are listed.
                      </p>
                    </div>
                    <Select
                      value={effectiveLanguage}
                      onValueChange={(next) => setSetup((prev) => ({ ...prev, language: next ?? "" }))}
                    >
                      <SelectTrigger>
                        {(() => {
                          const selected = getWorldLanguage(effectiveLanguage);
                          const selectedLabel = selected?.name ?? effectiveLanguage.toUpperCase();
                          const selectedCountry = selected?.flagCountry ?? "UN";
                          return (
                            <span className="flex items-center gap-2">
                              <LanguageFlag
                                countryCode={selectedCountry}
                                title={selectedLabel}
                                className="h-3! w-[18px]!"
                              />
                              <span>{selectedLabel}</span>
                            </span>
                          );
                        })()}
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((code) => {
                          const meta = getWorldLanguage(code);
                          const label = meta?.name ?? code.toUpperCase();
                          const country = meta?.flagCountry ?? "UN";
                          return (
                            <SelectItem key={code} value={code}>
                              <span className="flex items-center gap-2">
                                <LanguageFlag countryCode={country} title={label} className="h-3! w-[18px]!" />
                                <span>{label}</span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No entry languages found yet. Create at least one entry before starting review.
                  </p>
                )}
                <div>
                  <Button onClick={() => setStep(2)} disabled={!hasLanguageOptions || !effectiveLanguage}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === 2 ? (
            <>
              <Card className="border-border bg-card shadow-[var(--shadow-float)]">
                <CardHeader>
                  <CardTitle>Choose content type</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant={setup.contentType === "vocabulary" ? "default" : "outline"}
                    onClick={() => setSetup((prev) => ({ ...prev, contentType: "vocabulary", mode: "flashcard" }))}
                  >
                    Vocabulary
                  </Button>
                  <Button
                    variant={setup.contentType === "grammar" ? "default" : "outline"}
                    onClick={() => setSetup((prev) => ({ ...prev, contentType: "grammar", mode: "flashcard" }))}
                  >
                    Grammar
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-[var(--shadow-float)]">
                <CardHeader>
                  <CardTitle>Choose practice mode</CardTitle>
                  <CardDescription>Select one mode for this session.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {availableModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSetup((prev) => ({ ...prev, mode: mode.id }))}
                      className={`rounded-[1rem] border p-5 text-left ${setup.mode === mode.id ? "border-[#141413] bg-[#FCFBFA]" : "border-border bg-white"}`}
                    >
                      <p className="font-medium">{mode.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{mode.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted-foreground">{mode.supports}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
              {!step2Validation.valid ? (
                <p className="text-sm text-destructive">{step2Validation.message}</p>
              ) : null}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!step2Validation.valid}>
                  Next
                </Button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Card className="border-border bg-card shadow-[var(--shadow-float)]">
                <CardHeader>
                  <CardTitle>Session options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">Session size</p>
                    <div className="w-full sm:w-48">
                      <Select
                        value={String(setup.sessionSize)}
                        onValueChange={(next) => setSetup((prev) => ({ ...prev, sessionSize: Number(next) as 5 | 10 | 20 }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">Source</p>
                    <div className="w-full sm:w-48">
                      <Select
                        value={setup.source}
                        onValueChange={(next) => setSetup((prev) => ({ ...prev, source: next as ReviewSetupState["source"] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="due">Due only</SelectItem>
                          <SelectItem value="all">All entries</SelectItem>
                          <SelectItem value="weak">Weak items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm">Include examples when available</p>
                      <p className="text-xs text-muted-foreground">Used by flashcards and explanation hints.</p>
                    </div>
                    <ToggleSwitch
                      checked={setup.includeExamples}
                      onCheckedChange={(next) => setSetup((prev) => ({ ...prev, includeExamples: next }))}
                      ariaLabel="Include examples when available"
                    />
                  </div>
                </CardContent>
              </Card>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  disabled={invalidMode}
                  onClick={() => {
                    const built = buildQuestions(rows, { ...setup, language: effectiveLanguage });
                    if (built.questions.length === 0) {
                      setErrorMessage(built.reason ?? "No questions available for this setup.");
                      return;
                    }
                    setErrorMessage(null);
                    setQuestions(built.questions);
                  }}
                >
                  Start practice
                </Button>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
