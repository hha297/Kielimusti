import Link from "next/link";
import { format } from "date-fns";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listEntriesForDevWorkspace } from "@/features/entries/actions";
import { isDatabaseConfigured } from "@/db";

function DatabaseSetup() {
  return (
    <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Add{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          DATABASE_URL
        </code>{" "}
        to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          .env.local
        </code>
        , then run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          pnpm db:push
        </code>{" "}
        to create tables.
      </p>
    </div>
  );
}

function DatabaseError() {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-muted-foreground">
      Could not reach the database. Check <span className="font-mono text-foreground">DATABASE_URL</span>{" "}
      and that Postgres is running.
    </div>
  );
}

export default async function EntriesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Entries</h1>
            <p className="text-sm text-muted-foreground">
              Your knowledge items for the active language space.
            </p>
          </div>
          <Button disabled variant="secondary">
            New entry
          </Button>
        </header>
        <DatabaseSetup />
      </div>
    );
  }

  let rows: Awaited<ReturnType<typeof listEntriesForDevWorkspace>> = [];
  try {
    rows = await listEntriesForDevWorkspace();
  } catch {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Entries</h1>
            <p className="text-sm text-muted-foreground">Browse and filter saved knowledge.</p>
          </div>
          <Link href="/entries/new" className={buttonVariants({ variant: "secondary" })}>
            New entry
          </Link>
        </header>
        <DatabaseError />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Entries</h1>
          <p className="text-sm text-muted-foreground">
            Browse and open items. Filters and richer columns come next.
          </p>
        </div>
        <Link href="/entries/new" className={buttonVariants()}>
          New entry
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No entries yet.{" "}
          <Link href="/entries/new" className="text-foreground underline underline-offset-4">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[160px] text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground capitalize">{row.type}</TableCell>
                  <TableCell>
                    <Link
                      href={`/entries/${row.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {row.title?.trim() || "Untitled"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.status}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {format(row.updatedAt, "yyyy-MM-dd HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
