"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReviewContentType, ReviewQuestion, ReviewRating } from "@/features/review/review-types";

type TypedRecallReviewProps = {
  question: ReviewQuestion;
  contentType: ReviewContentType;
  onRate: (rating: ReviewRating) => void;
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function TypedRecallReview({ question, contentType, onRate }: TypedRecallReviewProps) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const matches = useMemo(() => normalize(answer) === normalize(question.answer), [answer, question.answer]);

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Typed recall</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xl font-semibold">{question.prompt}</p>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
          disabled={checked}
        />

        {!checked ? (
          <Button onClick={() => setChecked(true)} disabled={!answer.trim()}>
            Check
          </Button>
        ) : (
          <div className="space-y-3 rounded-[1rem] border border-border bg-background p-5">
            <p className="text-sm">Your answer: {answer}</p>
            <p className="text-sm">Expected: {question.answer}</p>
            {contentType === "vocabulary" ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onRate("again")}>
                  Again
                </Button>
                <Button onClick={() => onRate("good")}>{matches ? "Good" : "Continue"}</Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => onRate("again")}>
                  Again
                </Button>
                <Button variant="outline" onClick={() => onRate("hard")}>
                  Hard
                </Button>
                <Button variant="outline" onClick={() => onRate("good")}>
                  Good
                </Button>
                <Button onClick={() => onRate("easy")}>Easy</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
