import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { languageSpaces } from "@/db/schema";
import { getSession } from "@/lib/auth";

export type WorkspaceResult =
  | { ok: true; userId: string; languageSpaceId: string }
  | { ok: false; error: "unauthorized" };

/**
 * Resolves the signed-in user and ensures they have at least one language space
 * (creates a sensible default if none exist).
 */
export async function ensureUserWorkspace(): Promise<WorkspaceResult> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "unauthorized" };
  }

  const db = getDb();

  const existingSpace = await db
    .select()
    .from(languageSpaces)
    .where(eq(languageSpaces.userId, userId))
    .limit(1);

  if (existingSpace.length === 0) {
    const [space] = await db
      .insert(languageSpaces)
      .values({ userId, name: "Finnish", localeCode: "fi" })
      .returning({ id: languageSpaces.id });
    return { ok: true, userId, languageSpaceId: space.id };
  }

  return { ok: true, userId, languageSpaceId: existingSpace[0].id };
}
