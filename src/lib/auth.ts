import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";

import { getDb } from "@/db";
import * as schema from "@/db/schema";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.length) {
    throw new Error(`${name} is not set`);
  }
  return v;
}

export const auth = betterAuth({
  secret: requireEnv("BETTER_AUTH_SECRET"),
  baseURL: requireEnv("BETTER_AUTH_URL"),
  /** Match Drizzle `uuid()` primary keys (default Better Auth IDs are base62 strings). */
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [username(), nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;

/**
 * Current session (or null) for Server Components, route handlers, and server actions.
 * Wrapped in `cache()` so multiple reads in one request hit a single lookup.
 */
export const getSession = cache(async (): Promise<AuthSession | null> => {
  return auth.api.getSession({ headers: await headers() });
});
