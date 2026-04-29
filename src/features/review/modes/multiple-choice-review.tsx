"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewQuestion } from "@/features/review/review-types";

type MultipleChoiceReviewProps = {
  question: ReviewQuestion;
  onNext: () => void;
};

export function MultipleChoiceReview({ question, onNext }: MultipleChoiceReviewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const choices = question.choices ?? [];
  const isCorrect = useMemo(() => selected === question.answer, [question.answer, selected]);

  if (choices.length < 4) {
    return (
      <Card className="border-border bg-card shadow-[var(--shadow-float)]">
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">Not enough choices to run this question.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Choose one</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xl font-semibold">{question.prompt}</p>
        <div className="grid gap-2">
          {choices.map((choice) => {
            const selectedStyle = selected === choice ? "border-[#141413] bg-[#FCFBFA]" : "border-border bg-white";
            const resultStyle =
              checked && choice === question.answer
                ? "border-green-600/40"
                : checked && selected === choice && choice !== question.answer
                  ? "border-destructive/50"
                  : "";
            return (
              <button
                key={choice}
                type="button"
                className={`rounded-[1rem] border px-5 py-4 text-left text-sm ${selectedStyle} ${resultStyle}`}
                onClick={() => !checked && setSelected(choice)}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {!checked ? (
          <Button onClick={() => setChecked(true)} disabled={!selected}>
            Check
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {isCorrect ? "Correct." : `Not quite. Correct answer: ${question.answer}`}
            </p>
            <Button onClick={onNext}>Next</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
