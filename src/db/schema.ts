import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type { EntryMeaning } from "@/types/entry-meaning";
import type { EntryPayload } from "@/types/entry-payload";

export const entryTypeEnum = pgEnum("entry_type", ["vocabulary", "grammar", "note"]);

export const entryStatusEnum = pgEnum("entry_status", [
  "draft",
  "active",
  "archived",
]);

/** Application roles; extend this enum and Better Auth `additionalFields` together. */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

/**
 * Better Auth user model (`user` in adapter config). Includes username plugin fields
 * and an extendable `role` column.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** Normalized unique handle (Better Auth username plugin); null for legacy rows only. */
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("accounts_provider_account_uidx").on(table.providerId, table.accountId)],
);

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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
  /** Type-specific extras (POS, synonyms, grammar examples, note kind/tags, …). */
  payload: jsonb("payload").$type<EntryPayload | null>(),
  notes: text("notes"),
  source: text("source"),
  confidence: integer("confidence"),
  /** ISO 639-1 codes (JSON array of strings) — `jsonb` binds reliably with the `postgres` driver. */
  languages: jsonb("languages").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
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
  sessions: many(sessions),
  accounts: many(accounts),
  languageSpaces: many(languageSpaces),
  entries: many(entries),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
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
