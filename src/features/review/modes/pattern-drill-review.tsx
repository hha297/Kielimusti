"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewQuestion, ReviewRating } from "@/features/review/review-types";

type PatternDrillReviewProps = {
  question: ReviewQuestion;
  onRate: (rating: ReviewRating) => void;
};

export function PatternDrillReview({ question, onRate }: PatternDrillReviewProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Pattern drill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xl font-semibold">{question.prompt}</p>
        <Textarea
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your own example sentence..."
          disabled={submitted}
        />
        {!submitted ? (
          <Button onClick={() => setSubmitted(true)} disabled={!value.trim()}>
            Submit
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Saved examples: {question.answer}</p>
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
        )}
      </CardContent>
    </Card>
  );
}
