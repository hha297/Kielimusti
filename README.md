# Kielimuisti

Personal language knowledge base: capture entries, organize by language, and review on your own terms.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, Drizzle ORM, [Better Auth](https://www.better-auth.com/) (email/password + username), Zod, React Hook Form.

## Prerequisites

- Node.js 20+
- pnpm
- Docker (for local Postgres), or any PostgreSQL instance you point `DATABASE_URL` at

## Environment variables

Copy `.env.example` to `.env` and fill in values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string. Default local compose: `postgres://postgres:postgres@localhost:5433/kielimuisti` |
| `BETTER_AUTH_SECRET` | At least 32 characters of entropy. Generate with: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public origin of the app, e.g. `http://localhost:3000` |

`next build` and the Better Auth server both expect these to be set.

## Local database (Docker)

Postgres is defined in `docker-compose.yml` and published on **host port 5433** (so it does not clash with a local Postgres on 5432).

```bash
docker compose up -d
```

## Database schema and migrations

Drizzle config lives in `drizzle.config.ts`; the schema is `src/db/schema.ts`.

**Option A — push (typical local dev, applies diff to the DB)**

```bash
pnpm db:push
```

Use this when you are iterating quickly or when the database already has objects from an earlier schema (avoids replaying a full initial migration on a non-empty database).

### Reset local database (drop everything, recreate schema)

**Only for local dev** when you are fine losing all data. This wipes every table, enum, and object in `public`, then reapplies the Drizzle schema from scratch (no incremental casts).

```bash
docker exec -i kielimuisti-db psql -U postgres -d kielimuisti -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;"
pnpm exec drizzle-kit push --force
```

`--force` avoids interactive prompts when Drizzle would otherwise ask about destructive changes (use only on a throwaway database).

After a reset, create accounts again via `/sign-up`.

### If you cannot reset: `email_verified` cast to boolean

If you keep an old database and push fails with `email_verified` cannot be cast to boolean:

```bash
docker exec -i kielimuisti-db psql -U postgres -d kielimuisti -c "ALTER TABLE users ALTER COLUMN email_verified TYPE boolean USING (email_verified IS NOT NULL);"
```

Then run `pnpm db:push` again (in a real terminal if Drizzle asks follow-up questions).

**Option B — generate + migrate (versioned SQL migrations)**

```bash
pnpm db:generate   # writes SQL under drizzle/ from schema drift
pnpm db:migrate  # applies pending migrations (requires drizzle migration setup / DB state that matches the journal)
```

A baseline migration `drizzle/0000_better-auth.sql` is included for **empty** databases. If `db:migrate` fails because tables already exist, prefer `db:push` once to align the live schema, then continue with generate/migrate for future changes.

## Auth behavior

- **Sign up** (`/sign-up`): name, email, username, password. Usernames are unique; emails are unique.
- **Sign in** (`/sign-in`): one identifier field (`emailOrUsername`). If it contains `@`, it is treated as email; otherwise as username.
- **App routes** under `(app)` require a session; unauthenticated users are redirected to `/sign-in`.
- **Auth routes** (`/sign-in`, `/sign-up`) redirect signed-in users to `/dashboard`.
- **Sign out** is available from the user menu in the app shell.

Roles are stored on `users.role` (`user` \| `admin` enum). Only the server should set `admin` (signup does not accept a role from the client).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm db:push` | Apply schema to DB (Drizzle Kit) |
| `pnpm db:generate` | Generate SQL migrations from schema |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Drizzle Studio |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
