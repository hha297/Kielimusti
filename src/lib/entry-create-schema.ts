import { z } from "zod";

import { WORLD_LANGUAGE_CODES } from "@/constants/world-languages";
import { NOTE_KINDS } from "@/types/entry-payload";

import { isEffectivelyEmptyHtml } from "@/lib/entry-html";

export const meaningRowSchema = z.object({
  meaning: z.string().max(5000),
  example: z.string().max(5000).optional(),
});

const languageCodeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .length(2, "Pick a language")
  .refine((c) => WORLD_LANGUAGE_CODES.has(c), "Unknown language");

const baseFields = {
  type: z.enum(["vocabulary", "grammar", "note"]),
  language: languageCodeSchema,
  title: z.string().max(500),
  content: z.string().max(50_000).optional().default(""),
  pronunciation: z.string().max(200).optional().default(""),
  partOfSpeech: z.string().max(120).optional().default(""),
  meanings: z.array(meaningRowSchema).max(100).default([]),
  synonyms: z.array(z.string().max(200)).max(200).default([]),
  antonyms: z.array(z.string().max(200)).max(200).default([]),
  structure: z.string().max(2000).optional().default(""),
  examples: z.array(z.string().max(2000)).max(200).default([]),
  commonMistakes: z.array(z.string().max(2000)).max(200).default([]),
  usageNotes: z.string().max(50_000).optional().default(""),
  noteKind: z.enum(NOTE_KINDS).optional(),
  tags: z.array(z.string().max(80)).max(200).default([]),
  source: z.string().max(2000).optional().default(""),
  notes: z.string().max(50_000).optional().default(""),
};

export const createEntrySchema = z.object(baseFields).superRefine((data, ctx) => {
  switch (data.type) {
    case "vocabulary": {
      const t = data.title.trim();
      if (!t) {
        ctx.addIssue({ code: "custom", message: "Word / phrase is required", path: ["title"] });
      }
      const validMeanings = data.meanings.filter((r) => r.meaning.trim().length > 0);
      if (validMeanings.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least one meaning",
          path: ["meanings"],
        });
      }
      break;
    }
    case "grammar": {
      const t = data.title.trim();
      if (!t) {
        ctx.addIssue({ code: "custom", message: "Grammar point is required", path: ["title"] });
      }
      const c = data.content?.trim() ?? "";
      if (!c || isEffectivelyEmptyHtml(c)) {
        ctx.addIssue({
          code: "custom",
          message: "Explanation is required",
          path: ["content"],
        });
      }
      break;
    }
    case "note": {
      const c = data.content?.trim() ?? "";
      if (!c || isEffectivelyEmptyHtml(c)) {
        ctx.addIssue({
          code: "custom",
          message: "Content is required",
          path: ["content"],
        });
      }
      break;
    }
    default:
      break;
  }
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;

/** Narrowed for actions layer (same as input after parse). */
export type ParsedCreateEntry = CreateEntryInput;
