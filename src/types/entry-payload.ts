/**
 * Sparse JSON stored in `entries.payload`; which fields apply is determined by `entries.type`.
 */
export const NOTE_KINDS = [
  "insight",
  "reflection",
  "question",
  "summary",
  "plan",
  "mistake",
  "journal",
] as const;

export type NoteKind = (typeof NOTE_KINDS)[number];

export type EntryPayload = {
  pronunciation?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  antonyms?: string[];
  structure?: string;
  examples?: string[];
  commonMistakes?: string[];
  usageNotes?: string;
  noteKind?: NoteKind;
  tags?: string[];
};
