# BOOTSTRAP.md

## Goal

Set up the initial repository for the MVP using a practical, scalable default stack.

## Create project

Use create-next-app with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- src directory
- import alias

Choose:

TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Yes
import alias: Yes

## Install core dependencies

pnpm add zod react-hook-form @hookform/resolvers next-auth
pnpm add drizzle-orm postgres
pnpm add lucide-react clsx tailwind-merge class-variance-authority
pnpm add date-fns
pnpm add sonner
Install dev dependencies
pnpm add -D drizzle-kit
Install shadcn/ui

Initialize shadcn/ui and add basic components:

button
input
textarea
label
card
badge
dialog
dropdown-menu
form
select
tabs
separator
table
toast or sonner integration
Initial folder structure
src/
app/
(marketing)/
page.tsx
(app)/
dashboard/
page.tsx
entries/
page.tsx
entries/new/
page.tsx
review/
page.tsx
settings/
page.tsx
api/
globals.css
layout.tsx

components/
ui/
app-shell/
entries/
review/
dashboard/

db/
schema.ts
index.ts

lib/
auth.ts
utils.ts
validation.ts

features/
entries/
review/
languages/

types/
Initial routes
/ landing page
/dashboard
/entries
/entries/new
/review
/settings
Environment variables

Create .env.local with placeholders:

DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
Database direction

Use PostgreSQL.

Start with these tables:

users
language_spaces
entries
entry_tags
review_items
review_attempts

Do not over-design at bootstrap stage.

Initial priorities after setup
Step 1

Build app shell:

sidebar
top bar
dark theme layout
auth gate
Step 2

Build entries CRUD:

entries list
create entry form
detail page
edit page later
Step 3

Build review basics:

fetch due review items
simple flashcard mode
store attempts
Step 4

Build dashboard:

due today
recent entries
weak items
Engineering rules
Prefer server components by default
Use client components only where interaction requires them
Validate forms with Zod
Keep business logic outside UI components
Avoid premature abstraction
Keep code readable and modular
Definition of done for bootstrap

The repo is ready when:

app runs locally
database is connected
auth is wired
app shell exists
entries list page exists
create entry page exists
minimal schema exists

Read DESIGN.md, PRODUCT.md, and BOOTSTRAP.md.
Set up the repository step by step.
Do not implement everything at once.
Start with project structure, app shell, database setup, and entries CRUD skeleton only.
Keep the UI dark, clean, neutral, and developer-oriented.
