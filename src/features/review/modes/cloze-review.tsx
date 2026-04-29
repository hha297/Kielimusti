"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReviewQuestion } from "@/features/review/review-types";

type ClozeReviewProps = {
  question: ReviewQuestion;
  onNext: () => void;
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function ClozeReview({ question, onNext }: ClozeReviewProps) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = useMemo(() => normalize(value) === normalize(question.answer), [question.answer, value]);

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Cloze</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-lg">{question.prompt}</p>
        <Input value={value} onChange={(e) => setValue(e.target.value)} disabled={checked} placeholder="Missing word" />
        {!checked ? (
          <Button onClick={() => setChecked(true)} disabled={!value.trim()}>
            Check
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {correct ? "Correct." : `Expected answer: ${question.answer}`}
            </p>
            <Button onClick={onNext}>Next</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
