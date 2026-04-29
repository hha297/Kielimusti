import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecentEntryItem = {
  id: string;
  title: string | null;
  type: string;
  updatedAt: Date;
};

type RecentEntriesCardProps = {
  entries: RecentEntryItem[];
};

const typeLabel: Record<string, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  note: "Note",
  vocab: "Vocabulary",
};

function entryTypeText(type: string): string {
  return typeLabel[type] ?? type;
}

export function RecentEntriesCard({ entries }: RecentEntriesCardProps) {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader className="px-5 pt-5">
        <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Recent Entries
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {entries.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium text-foreground">
                    {entry.title?.trim() || "Untitled"}
                  </p>
                  <Badge variant="outline" className="h-5 border-border bg-background text-xs">
                    {entryTypeText(entry.type)}
                  </Badge>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceToNow(entry.updatedAt, { addSuffix: true })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
