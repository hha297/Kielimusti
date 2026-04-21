import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deleteEntry, getEntryById } from "@/features/entries/actions";
import { isDatabaseConfigured } from "@/db";
import {
  normalizeMeaningsForDisplay,
  normalizeStoredContentForDisplay,
} from "@/lib/entry-html";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {entry.type} · {entry.status}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {entry.title?.trim() || "Untitled"}
          </h1>
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
        <ContentBlock html={entry.content} />
        <MeaningsBlock rawMeanings={entry.meaning} />
        <Field label="Notes" value={entry.notes} mono />
        <SourceField value={entry.source} />
      </div>

      <p className="text-xs text-muted-foreground">
        Editing and type-specific layouts are planned; this page is a read-only skeleton.
      </p>
    </div>
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
