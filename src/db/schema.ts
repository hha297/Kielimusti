import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { EntryMeaning } from "@/types/entry-meaning";

export const entryTypeEnum = pgEnum("entry_type", [
  "vocab",
  "grammar",
  "note",
  "example",
  "mistake",
]);

export const entryStatusEnum = pgEnum("entry_status", [
  "draft",
  "active",
  "archived",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const languageSpaces = pgTable("language_spaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  localeCode: text("locale_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  languageSpaceId: uuid("language_space_id")
    .notNull()
    .references(() => languageSpaces.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: entryTypeEnum("type").notNull(),
  title: text("title"),
  content: text("content"),
  meaning: jsonb("meaning").$type<EntryMeaning[] | null>(),
  notes: text("notes"),
  source: text("source"),
  confidence: integer("confidence"),
  status: entryStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const entryTags = pgTable("entry_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

export const reviewItems = pgTable("review_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  dueAt: timestamp("due_at", { withTimezone: true }),
  mode: text("mode").notNull().default("flashcard"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reviewAttempts = pgTable("review_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewItemId: uuid("review_item_id")
    .notNull()
    .references(() => reviewItems.id, { onDelete: "cascade" }),
  correct: boolean("correct").notNull(),
  response: text("response"),
  answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  languageSpaces: many(languageSpaces),
  entries: many(entries),
}));

export const languageSpacesRelations = relations(languageSpaces, ({ one, many }) => ({
  user: one(users, {
    fields: [languageSpaces.userId],
    references: [users.id],
  }),
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one, many }) => ({
  languageSpace: one(languageSpaces, {
    fields: [entries.languageSpaceId],
    references: [languageSpaces.id],
  }),
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
  tags: many(entryTags),
  reviewItems: many(reviewItems),
}));

export const entryTagsRelations = relations(entryTags, ({ one }) => ({
  entry: one(entries, {
    fields: [entryTags.entryId],
    references: [entries.id],
  }),
}));

export const reviewItemsRelations = relations(reviewItems, ({ one, many }) => ({
  entry: one(entries, {
    fields: [reviewItems.entryId],
    references: [entries.id],
  }),
  attempts: many(reviewAttempts),
}));

export const reviewAttemptsRelations = relations(reviewAttempts, ({ one }) => ({
  reviewItem: one(reviewItems, {
    fields: [reviewAttempts.reviewItemId],
    references: [reviewItems.id],
  }),
}));
