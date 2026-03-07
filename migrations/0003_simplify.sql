-- Drop old tables
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS notes;

-- New simplified notes table
CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  content     TEXT NOT NULL,
  reference   TEXT DEFAULT '',
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);
