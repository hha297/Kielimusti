import type { EntryType } from "@/features/entries/entry-taxonomy";

export type FormFieldId =
  | "language"
  | "type"
  | "title"
  | "pronunciation"
  | "partOfSpeech"
  | "meanings"
  | "synonyms"
  | "antonyms"
  | "structure"
  | "content"
  | "examples"
  | "commonMistakes"
  | "usageNotes"
  | "noteKind"
  | "tags"
  | "source"
  | "notes";

export type FormFieldConfig = {
  id: FormFieldId;
  /** Shown in form UI */
  label: string;
  placeholder?: string;
  description?: string;
};

const languageField: FormFieldConfig = {
  id: "language",
  label: "Language",
};

const typeField: FormFieldConfig = {
  id: "type",
  label: "Entry type",
};

const sourceField: FormFieldConfig = {
  id: "source",
  label: "Source",
  placeholder: "Book, URL, speaker…",
};

/** Ordered fields to render for each entry type (schema-driven layout). */
export const entryFormFieldsByType: Record<EntryType, FormFieldConfig[]> = {
  vocabulary: [
    typeField,
    languageField,
    { id: "title", label: "Word / Phrase", placeholder: "Term or collocation" },
    {
      id: "pronunciation",
      label: "Pronunciation",
      placeholder: "IPA or how you say it",
    },
    {
      id: "partOfSpeech",
      label: "Part of speech",
      placeholder: "Noun, verb, adjective, adverb…",
    },
    {
      id: "meanings",
      label: "Meanings",
      description: "At least one meaning; optional example per row.",
    },
    { id: "synonyms", label: "Synonyms", placeholder: "Add synonym" },
    { id: "antonyms", label: "Antonyms", placeholder: "Add antonym" },
    sourceField,
    {
      id: "notes",
      label: "Notes",
      placeholder: "Short notes for this item",
      description: "Contextual notes for this vocabulary item only.",
    },
  ],
  grammar: [
    typeField,
    languageField,
    {
      id: "title",
      label: "Grammar point",
      placeholder: "Structure or rule name",
    },
    {
      id: "structure",
      label: "Structure",
      placeholder: "e.g. S + have + past participle",
    },
    {
      id: "content",
      label: "Explanation",
      placeholder: "Main explanation",
      description: "Rich text — rules, patterns, usage.",
    },
    {
      id: "examples",
      label: "Examples",
      placeholder: "Example sentence or pattern",
    },
    {
      id: "commonMistakes",
      label: "Common mistakes",
      placeholder: "Typical error or confusion",
    },
    {
      id: "usageNotes",
      label: "Usage notes",
      placeholder: "Extra usage hints (plain text)",
    },
    sourceField,
    {
      id: "notes",
      label: "Notes",
      placeholder: "Short notes for this grammar point",
      description: "Contextual notes for this grammar point only.",
    },
  ],
  note: [
    typeField,
    languageField,
    { id: "title", label: "Title", placeholder: "Optional headline" },
    {
      id: "noteKind",
      label: "Kind",
      description: "Optional label for filtering (insight, reflection…).",
    },
    {
      id: "content",
      label: "Content",
      placeholder: "Write your reflection, question, summary…",
      description: "Learning log — freeform rich text.",
    },
    { id: "tags", label: "Tags", placeholder: "Add tag" },
    sourceField,
  ],
};

export function getFieldConfigsForType(type: EntryType): FormFieldConfig[] {
  return entryFormFieldsByType[type];
}
