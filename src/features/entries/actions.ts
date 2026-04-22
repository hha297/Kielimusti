"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { ensureDevWorkspace } from "@/db/workspace";
import { getDb } from "@/db";
import { entries } from "@/db/schema";
import type { CreateEntryInput } from "@/lib/entry-create-schema";
import { createEntrySchema } from "@/lib/entry-create-schema";
import { isEffectivelyEmptyHtml, sanitizeEntryHtml } from "@/lib/entry-html";
import type { EntryPayload } from "@/types/entry-payload";
import type { EntryMeaning } from "@/types/entry-meaning";

function normalizeMeanings(rows: CreateEntryInput["meanings"]): EntryMeaning[] | null {
  if (!rows?.length) return null;
  const out: EntryMeaning[] = [];
  for (const row of rows) {
    const m = row.meaning.trim();
    const ex = row.example?.trim() ?? "";
    if (!m && !ex) continue;
    if (!m) continue;
    out.push(ex ? { meaning: m, example: ex } : { meaning: m });
  }
  return out.length ? out : null;
}

function trimStringArray(items: string[], maxLen: number): string[] {
  return items.map((s) => s.trim()).filter((s) => s.length > 0 && s.length <= maxLen);
}

function buildPayload(data: CreateEntryInput): EntryPayload | null {
  const out: EntryPayload = {};
  switch (data.type) {
    case "vocabulary": {
      const p = data.pronunciation.trim();
      if (p) out.pronunciation = p;
      const pos = data.partOfSpeech.trim();
      if (pos) out.partOfSpeech = pos;
      const syn = trimStringArray(data.synonyms, 200);
      if (syn.length) out.synonyms = syn;
      const ant = trimStringArray(data.antonyms, 200);
      if (ant.length) out.antonyms = ant;
      break;
    }
    case "grammar": {
      const st = data.structure.trim();
      if (st) out.structure = st;
      const ex = trimStringArray(data.examples, 2000);
      if (ex.length) out.examples = ex;
      const cm = trimStringArray(data.commonMistakes, 2000);
      if (cm.length) out.commonMistakes = cm;
      const u = data.usageNotes.trim();
      if (u) out.usageNotes = u;
      break;
    }
    case "note": {
      if (data.noteKind) out.noteKind = data.noteKind;
      const tags = trimStringArray(data.tags, 80);
      if (tags.length) out.tags = tags;
      break;
    }
    default:
      break;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function storeContent(raw: string | undefined): string | null {
  if (!raw) return null;
  const safe = sanitizeEntryHtml(raw);
  return isEffectivelyEmptyHtml(safe) ? null : safe;
}

export async function createEntry(input: CreateEntryInput) {
  const parsed = createEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const db = getDb();
  const { userId, languageSpaceId } = await ensureDevWorkspace();
  const data = parsed.data;

  const sourceStored = data.source.trim() || null;

  const row = (() => {
    switch (data.type) {
      case "vocabulary":
        return {
          type: "vocabulary" as const,
          title: data.title.trim(),
          content: null as string | null,
          meaning: normalizeMeanings(data.meanings),
          payload: buildPayload(data),
          notes: data.notes.trim() || null,
          source: sourceStored,
          languages: [data.language],
          status: "active" as const,
        };
      case "grammar":
        return {
          type: "grammar" as const,
          title: data.title.trim(),
          content: storeContent(data.content),
          meaning: null as null,
          payload: buildPayload(data),
          notes: data.notes.trim() || null,
          source: sourceStored,
          languages: [data.language],
          status: "active" as const,
        };
      case "note":
        return {
          type: "note" as const,
          title: data.title.trim() || null,
          content: storeContent(data.content),
          meaning: null as null,
          payload: buildPayload(data),
          notes: null as null,
          source: sourceStored,
          languages: [data.language],
          status: "active" as const,
        };
      default:
        return null;
    }
  })();

  if (!row) {
    return { ok: false as const, error: { type: ["Invalid entry type"] } };
  }

  try {
    await db.insert(entries).values({
      languageSpaceId,
      userId,
      ...row,
    });
  } catch (e) {
    console.error("createEntry failed", e);
    const message =
      e instanceof Error
        ? e.message
        : "Could not save the entry. If you just changed the schema, run `pnpm db:push` against Postgres.";
    return {
      ok: false as const,
      error: { title: [message] },
    };
  }

  revalidatePath("/entries");
  return { ok: true as const };
}

export async function listEntriesForDevWorkspace() {
  const db = getDb();
  const { languageSpaceId } = await ensureDevWorkspace();

  return db
    .select({
      id: entries.id,
      type: entries.type,
      title: entries.title,
      status: entries.status,
      updatedAt: entries.updatedAt,
      languages: entries.languages,
      meaning: entries.meaning,
      payload: entries.payload,
    })
    .from(entries)
    .where(eq(entries.languageSpaceId, languageSpaceId))
    .orderBy(desc(entries.updatedAt));
}

export async function getEntryById(id: string) {
  const db = getDb();
  const { languageSpaceId } = await ensureDevWorkspace();

  const row = await db
    .select()
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  if (row.length === 0) {
    return null;
  }

  if (row[0].languageSpaceId !== languageSpaceId) {
    return null;
  }

  return row[0];
}

export async function deleteEntry(id: string) {
  const db = getDb();
  const { languageSpaceId } = await ensureDevWorkspace();

  const row = await db
    .select({
      id: entries.id,
      languageSpaceId: entries.languageSpaceId,
    })
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  if (row.length === 0) {
    return { ok: false as const, error: "not_found" as const };
  }

  if (row[0].languageSpaceId !== languageSpaceId) {
    return { ok: false as const, error: "forbidden" as const };
  }

  await db.delete(entries).where(eq(entries.id, id));
  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
  return { ok: true as const };
}
