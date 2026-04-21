# Language Diary

A personal language-learning web app where users build their own knowledge base instead of learning from a fixed syllabus.

Initial target language: Finnish.
Long-term goal: support any language.

## Core idea

Users add what they learn into a personal diary:

- vocabulary
- grammar
- notes
- examples
- mistakes

The app then creates review experiences only from the user's own data:

- flashcards
- multiple choice
- fill in the blank
- recall prompts
- writing prompts

## Product principles

- User-owned knowledge first
- Simple, fast capture flow
- Review based on what the user actually learned
- Do not silently “fix” user knowledge
- Validation should warn, not override
- Modular monolith first, scale later

## MVP scope

- Authentication
- Create language spaces
- Add/edit/delete entries
- Organize by type and tags
- Basic review sessions
- Simple spaced repetition scheduling
- Entry quality flags
- Minimal dashboard

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Drizzle ORM
- Auth.js
- Zod
- React Hook Form

## Entry types in MVP

- vocab
- grammar
- note
- example
- mistake

## Review modes in MVP

- flashcard
- multiple choice
- cloze
- typed recall

## Non-goals for MVP

- AI tutor
- full-blown grammar correction
- social features
- marketplace
- mobile app
- offline-first sync

## Architecture direction

Start with a modular monolith:

- one Next.js app
- one PostgreSQL database
- server actions / route handlers
- background jobs can be added later

## Design direction

Dark, clean, neutral, developer-oriented.
Inspired by Cal.com-like structure:

- sharp hierarchy
- restrained color use
- monochrome surfaces
- strong spacing
- practical UI over decorative UI
