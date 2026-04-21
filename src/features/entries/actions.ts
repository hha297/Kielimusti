"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { ensureDevWorkspace } from "@/db/workspace";
import { getDb } from "@/db";
import { entries } from "@/db/schema";
import { isEffectivelyEmptyHtml, sanitizeEntryHtml } from "@/lib/entry-html";
import type { EntryMeaning } from "@/types/entry-meaning";
import { createEntrySchema, type CreateEntryInput } from "@/lib/validation";

function normalizeMeanings(rows: CreateEntryInput["meaning"]): EntryMeaning[] | null {
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

export async function createEntry(input: CreateEntryInput) {
  const parsed = createEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const db = getDb();
  const { userId, languageSpaceId } = await ensureDevWorkspace();

  const contentStored = (() => {
    const raw = parsed.data.content;
    if (!raw) return null;
    const safe = sanitizeEntryHtml(raw);
    return isEffectivelyEmptyHtml(safe) ? null : safe;
  })();

  await db.insert(entries).values({
    languageSpaceId,
    userId,
    type: parsed.data.type,
    title: parsed.data.title,
    content: contentStored,
    meaning: normalizeMeanings(parsed.data.meaning),
    notes: parsed.data.notes,
    source: parsed.data.source,
    status: "active",
  });

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
