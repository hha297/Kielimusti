import { NOTE_KINDS, type NoteKind } from "@/types/entry-payload";

export const ENTRY_TYPES = ["vocabulary", "grammar", "note"] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];

export const entryTypeLabels: Record<EntryType, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  note: "Note",
};

export const noteKindLabels: Record<NoteKind, string> = {
  insight: "Insight",
  reflection: "Reflection",
  question: "Question",
  summary: "Summary",
  plan: "Plan",
  mistake: "Mistake reflection",
  journal: "Journal",
};

export function isNoteKind(value: string): value is NoteKind {
  return (NOTE_KINDS as readonly string[]).includes(value);
}
