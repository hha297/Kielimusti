import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsGridProps = {
  totalEntries: number;
  vocabularyCount: number;
  grammarCount: number;
};

const statItems = [
  { key: "totalEntries", label: "Total entries" },
  { key: "vocabularyCount", label: "Vocabulary" },
  { key: "grammarCount", label: "Grammar" },
] as const;

export function StatsGrid({
  totalEntries,
  vocabularyCount,
  grammarCount,
}: StatsGridProps) {
  const values = { totalEntries, vocabularyCount, grammarCount };

  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader className="px-5 pt-5">
        <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {statItems.map((item) => (
            <div key={item.key} className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{values[item.key]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
