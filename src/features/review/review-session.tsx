"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewQuestion, ReviewRating, ReviewSetupState } from "@/features/review/review-types";

import { ClozeReview } from "./modes/cloze-review";
import { FlashcardReview } from "./modes/flashcard-review";
import { MultipleChoiceReview } from "./modes/multiple-choice-review";
import { PatternDrillReview } from "./modes/pattern-drill-review";
import { TypedRecallReview } from "./modes/typed-recall-review";

type ReviewSessionProps = {
  setup: ReviewSetupState;
  questions: ReviewQuestion[];
  onExit: () => void;
};

export function ReviewSession({ setup, questions, onExit }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<ReviewRating[]>([]);
  const current = questions[index];

  const finished = index >= questions.length;
  const summary = useMemo(
    () => ({
      again: ratings.filter((r) => r === "again").length,
      goodOrBetter: ratings.filter((r) => r === "good" || r === "easy").length,
    }),
    [ratings],
  );

  const next = (rating?: ReviewRating) => {
    if (rating) setRatings((prev) => [...prev, rating]);
    setIndex((prev) => prev + 1);
  };

  if (finished) {
    return (
      <div className="space-y-4 rounded-[1.25rem] border border-border bg-card p-7 shadow-[var(--shadow-float)]">
        <h2 className="text-2xl font-semibold">Session complete</h2>
        <p className="text-sm text-muted-foreground">
          Reviewed {questions.length} items. Again: {summary.again}, Good/Easy: {summary.goodOrBetter}.
        </p>
        <Button onClick={onExit}>Back to setup</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-card p-5 shadow-[var(--shadow-float)]">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {index + 1} / {questions.length}
          </Badge>
          <Badge variant="secondary" className="uppercase">{setup.mode}</Badge>
        </div>
        <Button variant="outline" onClick={onExit}>
          Exit session
        </Button>
      </div>

      {setup.mode === "flashcard" ? (
        <FlashcardReview question={current} includeExamples={setup.includeExamples} onRate={next} />
      ) : null}
      {setup.mode === "multiple-choice" ? <MultipleChoiceReview question={current} onNext={() => next("good")} /> : null}
      {setup.mode === "typed-recall" ? (
        <TypedRecallReview question={current} contentType={setup.contentType} onRate={next} />
      ) : null}
      {setup.mode === "cloze" ? <ClozeReview question={current} onNext={() => next("good")} /> : null}
      {setup.mode === "pattern-drill" ? <PatternDrillReview question={current} onRate={next} /> : null}
    </div>
  );
}
