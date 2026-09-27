-- ============================================================
--  V4: project category becomes an optional free-text label
--  (e.g. "University Final Project"), shown as a badge on the card.
--  The old fixed values "self-built" / "ai-assisted" are cleared.
-- ============================================================

ALTER TABLE projects ALTER COLUMN category DROP NOT NULL;

UPDATE projects SET category = NULL WHERE category IN ('self-built', 'ai-assisted');
