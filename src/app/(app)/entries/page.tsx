import Link from "next/link";
import { format } from "date-fns";
import { Globe, PlusIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LanguageFlag } from "@/components/language-flag";
import { getWorldLanguage } from "@/constants/world-languages";
import { listEntriesForCurrentWorkspace } from "@/features/entries/actions";
import {
  ENTRY_TYPES,
  entryTypeLabels,
  type EntryType,
} from "@/features/entries/entry-taxonomy";
import { isDatabaseConfigured } from "@/db";
import { normalizeMeaningsForDisplay } from "@/lib/entry-html";
import type { EntryPayload } from "@/types/entry-payload";

const UNASSIGNED_LANG = "__unassigned__";

type EntryRow = Awaited<ReturnType<typeof listEntriesForCurrentWorkspace>>[number];

const legacyTypeLabels: Record<string, string> = {
  vocab: "Vocabulary (legacy)",
  example: "Example (legacy)",
  mistake: "Mistake (legacy)",
};

function labelForEntryType(t: string): string {
  if ((ENTRY_TYPES as readonly string[]).includes(t)) {
    return entryTypeLabels[t as EntryType];
  }
  return legacyTypeLabels[t] ?? t;
}

function readPayload(raw: unknown): EntryPayload | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as EntryPayload;
}

function joinList(items: string[] | undefined, sep = ", "): string {
  if (!items?.length) return "";
  return items.filter((s) => s.trim().length > 0).join(sep);
}

function vocabularyMeaningPreview(meaning: unknown): string {
  const rows = normalizeMeaningsForDisplay(meaning);
  if (!rows.length) return "";
  return rows.map((r) => r.meaning).join(" · ");
}

type ListTableKind = "vocabulary" | "grammar" | "note" | "generic";

function listTableKind(entryType: string): ListTableKind {
  if (entryType === "vocabulary" || entryType === "vocab") return "vocabulary";
  if (entryType === "grammar") return "grammar";
  if (entryType === "note") return "note";
  return "generic";
}

function PreviewText({ text }: { text: string }) {
  const t = text.trim();
  if (!t) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className="line-clamp-2 text-muted-foreground" title={t}>
      {t}
    </span>
  );
}

function groupEntriesByLanguage(rows: EntryRow[]): Map<string, EntryRow[]> {
  const map = new Map<string, EntryRow[]>();
  for (const row of rows) {
    const codes =
      row.languages && row.languages.length > 0 ? row.languages : [UNASSIGNED_LANG];
    for (const code of codes) {
      const bucket = map.get(code) ?? [];
      bucket.push(row);
      map.set(code, bucket);
    }
  }
  return map;
}

function languageSectionSortKeys(keys: string[]): string[] {
  const rest = keys.filter((k) => k !== UNASSIGNED_LANG).sort((a, b) => {
    const na = getWorldLanguage(a)?.name ?? a;
    const nb = getWorldLanguage(b)?.name ?? b;
    return na.localeCompare(nb, undefined, { sensitivity: "base" });
  });
  if (keys.includes(UNASSIGNED_LANG)) {
    return [...rest, UNASSIGNED_LANG];
  }
  return rest;
}

/** Rows of a single entry type — columns depend on `entryType`. */
function EntryTypeTable({ rows, entryType }: { rows: EntryRow[]; entryType: string }) {
  const kind = listTableKind(entryType);

  if (kind === "vocabulary") {
    return (
      <div className="overflow-x-auto rounded-[1.25rem] border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Title</TableHead>
              <TableHead className="min-w-[160px]">Meaning</TableHead>
              <TableHead className="min-w-[140px]">Synonyms</TableHead>
              <TableHead className="min-w-[140px]">Antonyms</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px] text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const payload = readPayload(row.payload);
              return (
                <TableRow key={row.id}>
                  <TableCell className="align-top">
                    <Link
                      href={`/entries/${row.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {row.title?.trim() || "Untitled"}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[220px] align-top text-sm">
                    <PreviewText text={vocabularyMeaningPreview(row.meaning)} />
                  </TableCell>
                  <TableCell className="max-w-[200px] align-top text-sm">
                    <PreviewText text={joinList(payload?.synonyms)} />
                  </TableCell>
                  <TableCell className="max-w-[200px] align-top text-sm">
                    <PreviewText text={joinList(payload?.antonyms)} />
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground">{row.status}</TableCell>
                  <TableCell className="align-top text-right font-mono text-xs text-muted-foreground">
                    {format(row.updatedAt, "yyyy-MM-dd HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (kind === "grammar") {
    return (
      <div className="overflow-x-auto rounded-[1.25rem] border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Title</TableHead>
              <TableHead className="min-w-[200px]">Structure</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px] text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const payload = readPayload(row.payload);
              return (
                <TableRow key={row.id}>
                  <TableCell className="align-top">
                    <Link
                      href={`/entries/${row.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {row.title?.trim() || "Untitled"}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[280px] align-top text-sm">
                    <PreviewText text={payload?.structure?.trim() ?? ""} />
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground">{row.status}</TableCell>
                  <TableCell className="align-top text-right font-mono text-xs text-muted-foreground">
                    {format(row.updatedAt, "yyyy-MM-dd HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (kind === "note") {
    return (
      <div className="overflow-x-auto rounded-[1.25rem] border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Title</TableHead>
              <TableHead className="min-w-[200px]">Tags</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px] text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const payload = readPayload(row.payload);
              return (
                <TableRow key={row.id}>
                  <TableCell className="align-top">
                    <Link
                      href={`/entries/${row.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {row.title?.trim() || "Untitled"}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[280px] align-top text-sm">
                    <PreviewText text={joinList(payload?.tags)} />
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground">{row.status}</TableCell>
                  <TableCell className="align-top text-right font-mono text-xs text-muted-foreground">
                    {format(row.updatedAt, "yyyy-MM-dd HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-border/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[160px] text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
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
  );
}

function groupRowsByEntryType(rows: EntryRow[]): Map<string, EntryRow[]> {
  const map = new Map<string, EntryRow[]>();
  for (const row of rows) {
    const list = map.get(row.type) ?? [];
    list.push(row);
    map.set(row.type, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return map;
}

function EntriesGroupedTables({ rows }: { rows: EntryRow[] }) {
  const grouped = groupEntriesByLanguage(rows);
  const keys = languageSectionSortKeys([...grouped.keys()]);
  return (
    <div className="space-y-10">
      {keys.map((langKey) => {
        const bucket = grouped.get(langKey) ?? [];
        if (bucket.length === 0) return null;
        const meta = langKey === UNASSIGNED_LANG ? null : getWorldLanguage(langKey);
        const title = langKey === UNASSIGNED_LANG ? "Unassigned" : (meta?.name ?? langKey);
        const flagCountry = meta?.flagCountry ?? "UN";
        const byType = groupRowsByEntryType(bucket);
        const typeKeys = [
          ...ENTRY_TYPES,
          ...[...byType.keys()].filter(
            (k) => !(ENTRY_TYPES as readonly string[]).includes(k),
          ),
        ];
        return (
          <section key={langKey} className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-2">
              {langKey === UNASSIGNED_LANG ? (
                <Globe className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              ) : (
                <LanguageFlag countryCode={flagCountry} title={title} className="!h-5 !w-8" />
              )}
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <span className="text-sm text-muted-foreground">({bucket.length})</span>
            </div>
            <div className="space-y-6">
              {typeKeys.map((t) => {
                const typeRows = byType.get(t);
                if (!typeRows?.length) return null;
                const label = labelForEntryType(t);
                return (
                  <div key={`${langKey}-${t}`} className="space-y-2">
                    <h3 className="flex flex-wrap items-baseline gap-2 text-base font-semibold tracking-tight">
                      <span>{label}</span>
                      <span className="text-sm font-normal text-muted-foreground">({typeRows.length})</span>
                    </h3>
                    <EntryTypeTable rows={typeRows} entryType={t} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DatabaseSetup() {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-border/80 bg-muted/20 p-8 text-center">
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
    <div className="rounded-[1.25rem] border border-destructive/40 bg-destructive/5 p-6 text-sm text-muted-foreground">
      Could not reach the database. Check <span className="text-foreground">DATABASE_URL</span>{" "}
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
            <h1 className="text-5xl font-semibold uppercase tracking-wider">Entries</h1>
            <p className="text-sm text-muted-foreground">
              Your knowledge items for the active language space.
            </p>
          </div>
          <Button disabled variant="secondary">
            <PlusIcon className="size-4" />
            New entry
          </Button>
        </header>
        <DatabaseSetup />
      </div>
    );
  }

  let rows: Awaited<ReturnType<typeof listEntriesForCurrentWorkspace>> = [];
  try {
    rows = await listEntriesForCurrentWorkspace();
  } catch {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-5xl font-semibold uppercase tracking-wider">Entries</h1>
            <p className="text-sm text-muted-foreground">Browse and filter saved knowledge.</p>
          </div>
          <Link href="/entries/new" className={buttonVariants({ variant: "secondary" })}>
            <PlusIcon className="size-4" />
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
          <h1 className="text-5xl font-semibold uppercase tracking-wider">Entries</h1>
          <p className="text-sm text-muted-foreground">
            Browse by language and type; open a row for full detail.
          </p>
        </div>
        <Link href="/entries/new" className={buttonVariants()}>
          <PlusIcon className="size-4" />
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
        <EntriesGroupedTables rows={rows} />
      )}
    </div>
  );
}
