import { createEntrySchema } from "@/lib/entry-create-schema";
import { getFieldConfigsForType } from "@/features/entries/entry-form-config";
import { entryTypeLabels, noteKindLabels } from "@/features/entries/entry-taxonomy";
import type { EntryType } from "@/features/entries/entry-taxonomy";
import { getDefaultEntryFormValues } from "@/types/entry-form";

/** Default RHF values when switching or initializing an entry type. */
export const getDefaultValuesByType = getDefaultEntryFormValues;

/** Ordered field metadata for dynamic form rendering. */
export const getFieldConfigByType = getFieldConfigsForType;

/** Single Zod schema with `superRefine` branching on `type`. */
export const getValidationSchemaByType = (_type: EntryType) => createEntrySchema;

export function getLabelsAndPlaceholdersByType(type: EntryType) {
  return {
    typeLabel: entryTypeLabels[type],
    fields: getFieldConfigsForType(type),
    noteKindLabels,
  };
}
