import DOMPurify from "isomorphic-dompurify";

import type { EntryMeaning } from "@/types/entry-meaning";

/** True when HTML has no visible text (empty editor, only empty tags). */
export function isEffectivelyEmptyHtml(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}

export function sanitizeEntryHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "strike",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
    ],
    ALLOWED_ATTR: ["class"],
  });
}

function escapePlainTextForHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, "<br />");
}

/** Handle jsonb `{ meaning, example }[]`, legacy `string[]`, plain text, or odd shapes. */
export function normalizeMeaningsForDisplay(raw: unknown): EntryMeaning[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? [{ meaning: t }] : [];
  }
  if (!Array.isArray(raw)) return [];
  const out: EntryMeaning[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const t = item.trim();
      if (t) out.push({ meaning: t });
      continue;
    }
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const m = String(o.meaning ?? "").trim();
      const ex = String(o.example ?? "").trim();
      if (!m && !ex) continue;
      if (!m) continue;
      out.push(ex ? { meaning: m, example: ex } : { meaning: m });
    }
  }
  return out;
}

/** Legacy plain-text rows render as safe HTML paragraphs. */
export function normalizeStoredContentForDisplay(raw: string | null): string {
  if (!raw?.trim()) return "";
  const s = raw.trim();
  if (/^<\s*[a-z]/i.test(s)) {
    return sanitizeEntryHtml(s);
  }
  const body = escapePlainTextForHtml(s);
  return sanitizeEntryHtml(`<p>${body}</p>`);
}
