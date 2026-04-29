"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlipCard } from "@/features/review/components/flip-card";
import type { ReviewQuestion, ReviewRating } from "@/features/review/review-types";

type FlashcardReviewProps = {
  question: ReviewQuestion;
  includeExamples: boolean;
  onRate: (rating: ReviewRating) => void;
};

export function FlashcardReview({ question, includeExamples, onRate }: FlashcardReviewProps) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setRevealed(false);
  }, [question.id]);

  return (
    <Card className="border-border bg-card shadow-(--shadow-float)">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.14em] text-muted-foreground">
          Tap card to flip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FlipCard
          flipped={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
          front={
            <div className="flex w-full flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Prompt</p>
              <p className="text-2xl font-semibold tracking-tight">{question.prompt}</p>
            </div>
          }
          back={
            <div className="flex w-full flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Answer</p>
                <p className="mt-2 text-base">{question.answer}</p>
                {includeExamples && question.example ? (
                  <p className="mt-3 text-sm text-muted-foreground">Example: {question.example}</p>
                ) : null}
              </div>
            </div>
          }
        />

        {revealed ? (
          <div className="space-y-5">
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
          </div>
        ) : (
          <Button variant="outline" onClick={() => setRevealed(true)}>
            Reveal answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
