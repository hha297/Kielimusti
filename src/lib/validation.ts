import { z } from "zod";

export const meaningRowSchema = z.object({
  meaning: z.string().max(5000),
  example: z.string().max(5000).optional(),
});

export const entryTypes = [
  "vocab",
  "grammar",
  "note",
  "example",
  "mistake",
] as const;

export const createEntrySchema = z.object({
  type: z.enum(entryTypes),
  title: z.string().trim().min(1, "Title is required").max(500),
  content: z.string().max(50_000, "Content must be at most 50000 characters").optional(),
  meaning: z.array(meaningRowSchema).max(100).optional(),
  notes: z.string().max(50_000).optional(),
  source: z.string().max(2000).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
