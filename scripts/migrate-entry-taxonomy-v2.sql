-- Optional manual migration for existing databases that used the old 5-value `entry_type` enum
-- and had no `payload` column. Review and run in a transaction after backup.
--
-- Old enum values: vocab, grammar, note, example, mistake
-- New enum values: vocabulary, grammar, note
--
-- 1) Add payload (safe if already present)
ALTER TABLE entries ADD COLUMN IF NOT EXISTS payload JSONB;

-- 2) If your column is still the old enum, migrate via text (adjust type names if Drizzle named them differently).
--    Inspect: SELECT DISTINCT type::text FROM entries;

-- Example pattern (uncomment and adapt to your actual enum type name from `\dT+` in psql):

-- ALTER TABLE entries ALTER COLUMN type TYPE text USING type::text;
-- UPDATE entries SET type = 'vocabulary' WHERE type = 'vocab';
-- UPDATE entries SET type = 'note' WHERE type IN ('example', 'mistake');
-- DROP TYPE IF EXISTS entry_type CASCADE;  -- only if nothing else references it
-- CREATE TYPE entry_type AS ENUM ('vocabulary', 'grammar', 'note');
-- ALTER TABLE entries
--   ALTER COLUMN type TYPE entry_type USING type::entry_type;

-- Fresh installs: run `pnpm db:push` so Drizzle creates the new enum and `payload` column.
