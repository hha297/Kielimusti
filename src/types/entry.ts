import type { InferSelectModel } from "drizzle-orm";

import type { entries } from "@/db/schema";

export type { EntryMeaning } from "@/types/entry-meaning";

export type Entry = InferSelectModel<typeof entries>;
