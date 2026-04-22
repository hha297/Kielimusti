/**
 * Shared entry validation — prefer importing from `@/lib/entry-create-schema` for types.
 */
export {
  createEntrySchema,
  meaningRowSchema,
  type CreateEntryInput,
} from "@/lib/entry-create-schema";

export { ENTRY_TYPES as entryTypes } from "@/features/entries/entry-taxonomy";
export type { EntryType } from "@/features/entries/entry-taxonomy";
