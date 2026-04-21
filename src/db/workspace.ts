import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { languageSpaces, users } from "@/db/schema";

const DEV_EMAIL = "dev@local.language-diary";

/**
 * Ensures a single dev user and default language space exist.
 * Replaced later with authenticated user + user-created spaces.
 */
export async function ensureDevWorkspace(): Promise<{
  userId: string;
  languageSpaceId: string;
}> {
  const db = getDb();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, DEV_EMAIL))
    .limit(1);

  let userId: string;
  if (existingUser.length === 0) {
    const [created] = await db
      .insert(users)
      .values({ email: DEV_EMAIL, name: "Dev user" })
      .returning({ id: users.id });
    userId = created.id;
  } else {
    userId = existingUser[0].id;
  }

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
    return { userId, languageSpaceId: space.id };
  }

  return { userId, languageSpaceId: existingSpace[0].id };
}
