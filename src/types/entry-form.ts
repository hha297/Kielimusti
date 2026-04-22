import type { EntryType } from "@/features/entries/entry-taxonomy";

import type { NoteKind } from "./entry-payload";

export type MeaningRowInput = { meaning: string; example?: string };

/** Single RHF shape: all keys present; validation is type-specific in Zod. */
export type EntryFormValues = {
  type: EntryType;
  language: string;
  title: string;
  content: string;
  pronunciation: string;
  partOfSpeech: string;
  meanings: MeaningRowInput[];
  synonyms: string[];
  antonyms: string[];
  structure: string;
  examples: string[];
  commonMistakes: string[];
  usageNotes: string;
  noteKind?: NoteKind;
  tags: string[];
  source: string;
  notes: string;
};

export function getDefaultEntryFormValues(type: EntryType): EntryFormValues {
  return {
    type,
    language: "en",
    title: "",
    content: "",
    pronunciation: "",
    partOfSpeech: "",
    meanings: type === "vocabulary" ? [{ meaning: "", example: "" }] : [],
    synonyms: [],
    antonyms: [],
    structure: "",
    examples: [],
    commonMistakes: [],
    usageNotes: "",
    noteKind: undefined,
    tags: [],
    source: "",
    notes: "",
  };
}
