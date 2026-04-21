/** One sense: gloss + optional example (stored in `entries.meaning` jsonb). */
export type EntryMeaning = {
  meaning: string;
  example?: string;
};
