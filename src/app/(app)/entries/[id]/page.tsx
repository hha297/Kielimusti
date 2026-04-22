import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { LanguageFlag } from "@/components/language-flag";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getWorldLanguage } from "@/constants/world-languages";
import { deleteEntry, getEntryById } from "@/features/entries/actions";
import {
  ENTRY_TYPES,
  entryTypeLabels,
  noteKindLabels,
  type EntryType,
} from "@/features/entries/entry-taxonomy";
import { isDatabaseConfigured } from "@/db";
import {
  normalizeMeaningsForDisplay,
  normalizeStoredContentForDisplay,
} from "@/lib/entry-html";
import type { EntryPayload } from "@/types/entry-payload";

function safeExternalHref(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    try {
      return new URL(`https://${t}`).href;
    } catch {
      return null;
    }
  }
  return null;
}

const legacyTypeLabels: Record<string, string> = {
  vocab: "Vocabulary (legacy)",
  example: "Example (legacy)",
  mistake: "Mistake (legacy)",
};

function humanEntryType(t: string): string {
  if ((ENTRY_TYPES as readonly string[]).includes(t)) {
    return entryTypeLabels[t as EntryType];
  }
  return legacyTypeLabels[t] ?? t;
}

function readPayload(raw: unknown): EntryPayload | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as EntryPayload;
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    notFound();
  }

  const entry = await getEntryById(id);
  if (!entry) {
    notFound();
  }

  async function remove() {
    "use server";
    const result = await deleteEntry(id);
    if (!result.ok) {
      if (result.error === "not_found") {
        notFound();
      }
      throw new Error("Could not delete entry");
    }
    redirect("/entries");
  }

  const payload = readPayload(entry.payload);
  const typeLine = (() => {
    const base = humanEntryType(entry.type);
    if (entry.type === "note" && payload?.noteKind) {
      return `${base} · ${noteKindLabels[payload.noteKind]}`;
    }
    return base;
  })();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {typeLine} · {entry.status}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {entry.title?.trim() || "Untitled"}
          </h1>
          {entry.languages && entry.languages.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
              {entry.languages.map((code) => {
                const lang = getWorldLanguage(code);
                const label = lang?.name ?? code.toUpperCase();
                const cc = lang?.flagCountry ?? "UN";
                return (
                  <li
                    key={code}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    <LanguageFlag countryCode={cc} title={label} />
                    <span className="font-medium text-foreground">{label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="pt-2 text-xs text-muted-foreground">No languages tagged on this entry.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/entries" className={buttonVariants({ variant: "outline" })}>
            Back to list
          </Link>
          <form action={remove}>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4">
        <PayloadBlock entryType={entry.type} payload={payload} />
        <ContentBlock html={entry.content} />
        <MeaningsBlock rawMeanings={entry.meaning} />
        <Field label="Item notes" value={entry.notes} mono />
        <SourceField value={entry.source} />
      </div>

      <p className="text-xs text-muted-foreground">
        Editing and type-specific layouts are planned; this page is a read-only skeleton.
      </p>
    </div>
  );
}

function PayloadBlock({ entryType, payload }: { entryType: string; payload: EntryPayload | null }) {
  if (!payload) return null;

  const isVocab = entryType === "vocabulary" || entryType === "vocab";
  const isGrammar = entryType === "grammar";
  const isNote = entryType === "note";

  if (isVocab) {
    return (
      <>
        <Field label="Pronunciation" value={payload.pronunciation ?? null} />
        <Field label="Part of speech" value={payload.partOfSpeech ?? null} />
        <StringListCard title="Synonyms" items={payload.synonyms} />
        <StringListCard title="Antonyms" items={payload.antonyms} />
      </>
    );
  }

  if (isGrammar) {
    return (
      <>
        <Field label="Structure" value={payload.structure ?? null} />
        <StringListCard title="Examples" items={payload.examples} />
        <StringListCard title="Common mistakes" items={payload.commonMistakes} />
        <Field label="Usage notes" value={payload.usageNotes ?? null} mono />
      </>
    );
  }

  if (isNote) {
    return <StringListCard title="Tags" items={payload.tags} />;
  }

  return null;
}

function StringListCard({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
          {items.map((item, i) => (
            <li key={i} className="whitespace-pre-wrap">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ContentBlock({ html }: { html: string | null }) {
  const safe = normalizeStoredContentForDisplay(html);
  if (!safe) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Content</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="rich-text-preview text-sm [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_em]:italic [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      </CardContent>
    </Card>
  );
}

function MeaningsBlock({ rawMeanings }: { rawMeanings: unknown }) {
  const meanings = normalizeMeaningsForDisplay(rawMeanings);
  if (!meanings.length) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Meanings</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full min-w-[280px] border-collapse text-sm">
            <colgroup>
              <col style={{ width: "33.333%" }} />
              <col style={{ width: "66.667%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border/80 text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Meaning</th>
                <th className="pb-2 font-medium text-muted-foreground">Example</th>
              </tr>
            </thead>
            <tbody>
              {meanings.map((row, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0">
                  <td className="py-2 pr-4 align-top whitespace-pre-wrap">{row.meaning}</td>
                  <td className="py-2 align-top whitespace-pre-wrap text-muted-foreground">
                    {row.example?.trim() ? row.example : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SourceField({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return null;
  }
  const text = value.trim();
  const href = safeExternalHref(text);
  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Source</p>
      </CardHeader>
      <CardContent className="pt-4">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-primary underline-offset-4 hover:underline"
          >
            {text}
          </a>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{text}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <p className={`whitespace-pre-wrap text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
