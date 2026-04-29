import { normalizeMeaningsForDisplay } from "@/lib/entry-html";
import type { EntryPayload } from "@/types/entry-payload";

import type {
  ReviewDirection,
  ReviewEntryRow,
  ReviewMode,
  ReviewQuestion,
  ReviewSessionEntry,
  ReviewSetupState,
} from "./review-types";

type BuildQuestionsResult = {
  questions: ReviewQuestion[];
  reason?: string;
};

const REVIEW_MODE_SUPPORTED: Record<ReviewMode, Array<"vocabulary" | "grammar">> = {
  flashcard: ["vocabulary", "grammar"],
  "multiple-choice": ["vocabulary", "grammar"],
  "typed-recall": ["vocabulary", "grammar"],
  cloze: ["vocabulary"],
  "pattern-drill": ["grammar"],
};

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickDirection(direction: ReviewDirection): "word-to-meaning" | "meaning-to-word" {
  if (direction !== "mixed") return direction;
  return Math.random() > 0.5 ? "word-to-meaning" : "meaning-to-word";
}

function normalizeRows(rows: ReviewEntryRow[]): ReviewSessionEntry[] {
  return rows
    .filter((row): row is ReviewEntryRow & { title: string } => Boolean(row.title?.trim()))
    .filter((row) => row.type === "vocabulary" || row.type === "grammar")
    .map((row) => {
      const payload = ((row.payload ?? {}) as EntryPayload) || {};
      return {
        id: row.id,
        type: row.type,
        title: row.title.trim(),
        meanings: normalizeMeaningsForDisplay(row.meaning),
        structure: payload.structure?.trim(),
        usageNotes: payload.usageNotes?.trim(),
        examples: payload.examples ?? [],
        updatedAt: row.updatedAt,
      };
    });
}

function applySource(entries: ReviewSessionEntry[], source: ReviewSetupState["source"]) {
  if (source === "all") return entries;
  if (source === "due") return entries.filter((_, i) => i % 2 === 0);
  return entries.filter((_, i) => i % 3 === 0);
}

function buildVocabularyFlashcard(entry: ReviewSessionEntry, direction: ReviewDirection): ReviewQuestion {
  const finalDirection = pickDirection(direction);
  const firstMeaning = entry.meanings[0]?.meaning ?? "No saved meaning.";
  const answer = finalDirection === "word-to-meaning" ? firstMeaning : entry.title;
  const prompt = finalDirection === "word-to-meaning" ? entry.title : firstMeaning;
  return {
    id: `${entry.id}:flashcard`,
    contentType: "vocabulary",
    mode: "flashcard",
    prompt,
    answer,
    example: entry.meanings[0]?.example,
    entryId: entry.id,
    direction: finalDirection,
  };
}

function buildVocabularyMCQ(
  entry: ReviewSessionEntry,
  vocabPool: ReviewSessionEntry[],
  direction: ReviewDirection,
): ReviewQuestion | null {
  if (vocabPool.length < 4) return null;
  const finalDirection = pickDirection(direction);
  const correctAnswer = finalDirection === "word-to-meaning" ? entry.meanings[0]?.meaning : entry.title;
  if (!correctAnswer) return null;
  const distractorPool = vocabPool
    .filter((item) => item.id !== entry.id)
    .map((item) => (finalDirection === "word-to-meaning" ? item.meanings[0]?.meaning : item.title))
    .filter((x): x is string => Boolean(x));
  const distractors = distractorPool.slice(0, 3);
  if (distractors.length < 3) return null;
  const choices = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
  return {
    id: `${entry.id}:mcq`,
    contentType: "vocabulary",
    mode: "multiple-choice",
    prompt: finalDirection === "word-to-meaning" ? entry.title : correctAnswer,
    answer: correctAnswer,
    choices,
    entryId: entry.id,
    direction: finalDirection,
  };
}

function buildVocabularyTyped(entry: ReviewSessionEntry, direction: ReviewDirection): ReviewQuestion | null {
  const finalDirection = pickDirection(direction);
  const firstMeaning = entry.meanings[0]?.meaning;
  if (!firstMeaning) return null;
  return {
    id: `${entry.id}:typed`,
    contentType: "vocabulary",
    mode: "typed-recall",
    prompt: finalDirection === "word-to-meaning" ? entry.title : firstMeaning,
    answer: finalDirection === "word-to-meaning" ? firstMeaning : entry.title,
    example: entry.meanings[0]?.example,
    entryId: entry.id,
    direction: finalDirection,
  };
}

function buildVocabularyCloze(entry: ReviewSessionEntry): ReviewQuestion | null {
  const example = entry.meanings.find((m) => m.example?.trim())?.example?.trim();
  if (!example) return null;
  const escapedTitle = entry.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escapedTitle, "i");
  if (!re.test(example)) return null;
  return {
    id: `${entry.id}:cloze`,
    contentType: "vocabulary",
    mode: "cloze",
    prompt: example.replace(re, "_____"),
    answer: entry.title,
    example,
    entryId: entry.id,
    direction: "meaning-to-word",
  };
}

function buildGrammarFlashcard(entry: ReviewSessionEntry): ReviewQuestion {
  const answer = [entry.usageNotes, entry.examples?.[0]].filter(Boolean).join("\n\n") || "No explanation saved yet.";
  return {
    id: `${entry.id}:flashcard`,
    contentType: "grammar",
    mode: "flashcard",
    prompt: entry.structure || entry.title,
    answer,
    example: entry.examples?.[0],
    entryId: entry.id,
  };
}

function buildGrammarMCQ(entry: ReviewSessionEntry, grammarPool: ReviewSessionEntry[]): ReviewQuestion | null {
  if (grammarPool.length < 4) return null;
  const prompt = entry.usageNotes || entry.examples?.[0];
  if (!prompt) return null;
  const distractors = grammarPool
    .filter((g) => g.id !== entry.id)
    .map((g) => g.title)
    .slice(0, 3);
  if (distractors.length < 3) return null;
  return {
    id: `${entry.id}:mcq`,
    contentType: "grammar",
    mode: "multiple-choice",
    prompt,
    answer: entry.title,
    choices: [entry.title, ...distractors].sort(() => Math.random() - 0.5),
    entryId: entry.id,
  };
}

function buildGrammarTyped(entry: ReviewSessionEntry): ReviewQuestion {
  const prompt = entry.structure || entry.title;
  const answer = stripHtml(entry.usageNotes || "No saved explanation.");
  return {
    id: `${entry.id}:typed`,
    contentType: "grammar",
    mode: "typed-recall",
    prompt,
    answer,
    example: entry.examples?.[0],
    entryId: entry.id,
  };
}

function buildGrammarPattern(entry: ReviewSessionEntry): ReviewQuestion {
  return {
    id: `${entry.id}:pattern`,
    contentType: "grammar",
    mode: "pattern-drill",
    prompt: entry.structure || entry.title,
    answer: (entry.examples ?? []).join("\n") || "No saved examples.",
    example: entry.examples?.[0],
    entryId: entry.id,
  };
}

export function buildQuestions(rows: ReviewEntryRow[], setup: ReviewSetupState): BuildQuestionsResult {
  if (!REVIEW_MODE_SUPPORTED[setup.mode].includes(setup.contentType)) {
    return { questions: [], reason: "This mode is not available for the selected content type." };
  }

  const all = normalizeRows(rows);
  const filteredByLanguage = all.filter((entry) =>
    rows
      .find((row) => row.id === entry.id)
      ?.languages?.includes(setup.language),
  );
  const filteredByType = filteredByLanguage.filter((entry) => entry.type === setup.contentType);
  const sourced = applySource(filteredByType, setup.source);

  if (sourced.length === 0) {
    return {
      questions: [],
      reason: `No ${setup.contentType} entries found for the selected language.`,
    };
  }

  const questions: ReviewQuestion[] = [];
  for (const entry of sourced) {
    if (setup.contentType === "vocabulary") {
      if (setup.mode === "flashcard") questions.push(buildVocabularyFlashcard(entry, setup.direction));
      if (setup.mode === "multiple-choice") {
        const q = buildVocabularyMCQ(entry, sourced, setup.direction);
        if (q) questions.push(q);
      }
      if (setup.mode === "typed-recall") {
        const q = buildVocabularyTyped(entry, setup.direction);
        if (q) questions.push(q);
      }
      if (setup.mode === "cloze") {
        const q = buildVocabularyCloze(entry);
        if (q) questions.push(q);
      }
    } else {
      if (setup.mode === "flashcard") questions.push(buildGrammarFlashcard(entry));
      if (setup.mode === "multiple-choice") {
        const q = buildGrammarMCQ(entry, sourced);
        if (q) questions.push(q);
      }
      if (setup.mode === "typed-recall") questions.push(buildGrammarTyped(entry));
      if (setup.mode === "pattern-drill") questions.push(buildGrammarPattern(entry));
    }
  }

  if (questions.length === 0) {
    if (setup.mode === "cloze") return { questions: [], reason: "Cloze mode needs vocabulary examples." };
    if (setup.mode === "multiple-choice") {
      return { questions: [], reason: "Not enough entries to generate multiple-choice options yet." };
    }
    return { questions: [], reason: "No review questions could be generated for this setup." };
  }

  return { questions: questions.slice(0, setup.sessionSize) };
}
