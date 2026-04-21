# PRODUCT.md

## Product name

Working name: Language Diary

## Problem

Language learners often collect knowledge from many places:

- teachers
- books
- videos
- conversations
- articles
- daily mistakes

But this knowledge is fragmented.
Most tools are either:

- static course apps
- pure note apps
- pure flashcard apps

This product combines:

- personal language knowledge capture
- structured organization
- review generated from the user's own entries

## Vision

Help users build a personal language knowledge base and recall system.

The app should feel like:

- a diary of learned knowledge
- a structured knowledge graph
- a lightweight review engine

## Initial audience

Self-learners studying Finnish.

Later:

- learners of any language
- serious note-takers
- learners who dislike fixed curriculums

## MVP goals

### 1. Capture

Users can quickly add entries for things they learned.

### 2. Organize

Users can structure entries by:

- language
- type
- tag
- status

### 3. Review

The app can generate simple review flows from saved entries.

### 4. Track

Users can see what they learned and what needs review.

## Core entities

### LanguageSpace

A workspace for one language.
Example: Finnish, Japanese, German.

### Entry

A unit of knowledge added by the user.

### EntryType

For MVP:

- vocab
- grammar
- note
- example
- mistake

### ReviewItem

A generated review object linked to an entry.

### ReviewAttempt

A record of how the user answered during review.

## Entry model concept

Each entry may contain:

- title
- content
- meaning
- notes
- tags
- examples
- source
- confidence
- status

Not all fields are required for all entry types.

## User flows

### Flow 1: quick capture

User opens app -> clicks add entry -> fills minimal form -> saves

### Flow 2: browse knowledge

User opens entries page -> filters by type/tag/status -> opens detail page

### Flow 3: review due items

User opens dashboard -> sees due reviews -> starts review session

### Flow 4: improve weak knowledge

User reviews wrong answers -> sees linked source entry -> edits note

## Entry types in MVP

### vocab

Fields:

- term
- meaning
- example sentence
- notes
- tags

### grammar

Fields:

- pattern name
- explanation
- example
- notes
- tags

### note

Fields:

- title
- content
- tags

### example

Fields:

- sentence
- translation
- note

### mistake

Fields:

- wrong form
- corrected form
- explanation
- context

## Review modes in MVP

### flashcard

Front/back recall

### multiple choice

Prompt plus choices

### cloze

Fill missing word in a sentence

### typed recall

User types answer manually

## Validation philosophy

The system should not behave like an all-knowing authority.

Instead:

- detect obvious issues
- flag possible confusion
- suggest user review
- allow user to keep the entry

## MVP success criteria

- user can create a language space
- user can add entries easily
- user can review saved knowledge
- user can track due items
- product feels clean and reliable

## Not in MVP

- collaborative learning
- public decks
- advanced AI explanations
- speech recognition
- mobile native app
- real-time multiplayer anything
