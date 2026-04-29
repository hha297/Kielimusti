import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DueTodayCardProps = {
  dueCount: number;
};

export function DueTodayCard({ dueCount }: DueTodayCardProps) {
  const hasDueItems = dueCount > 0;

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader className="space-y-3 px-5 pt-5">
        <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Due Today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 pb-5">
        {hasDueItems ? (
          <>
            <div className="space-y-2">
              <p className="text-6xl font-semibold leading-none tracking-tight">{dueCount}</p>
              <p className="text-sm text-muted-foreground">items ready for review</p>
            </div>
            <Link href="/review" className={cn(buttonVariants(), "w-fit")}>
              Start review
            </Link>
          </>
        ) : (
          <div className="space-y-2 py-2">
            <p className="text-3xl font-semibold tracking-tight">You're all caught up</p>
            <p className="text-sm text-muted-foreground">No items ready for review.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
