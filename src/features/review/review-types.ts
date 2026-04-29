export type ReviewContentType = "vocabulary" | "grammar";

export type ReviewMode =
  | "flashcard"
  | "multiple-choice"
  | "typed-recall"
  | "cloze"
  | "pattern-drill";

export type ReviewDirection = "word-to-meaning" | "meaning-to-word" | "mixed";

export type ReviewSource = "due" | "all" | "weak";

export type ReviewRating = "again" | "hard" | "good" | "easy";

export type ReviewQuestion = {
  id: string;
  contentType: ReviewContentType;
  mode: ReviewMode;
  prompt: string;
  answer: string;
  example?: string;
  choices?: string[];
  entryId?: string;
  direction?: Exclude<ReviewDirection, "mixed">;
};

export type ReviewSetupState = {
  language: string;
  contentType: ReviewContentType;
  mode: ReviewMode;
  direction: ReviewDirection;
  sessionSize: 5 | 10 | 20;
  source: ReviewSource;
  includeExamples: boolean;
};

export type ReviewSessionEntry = {
  id: string;
  type: ReviewContentType;
  title: string;
  meanings: Array<{ meaning: string; example?: string }>;
  structure?: string;
  usageNotes?: string;
  examples?: string[];
  updatedAt: string;
};

export type ReviewEntryRow = {
  id: string;
  type: string;
  title: string | null;
  status: string;
  updatedAt: string;
  meaning: unknown;
  payload: unknown;
  languages: string[];
};
