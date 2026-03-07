CREATE TABLE IF NOT EXISTS likes (
  note_id     INTEGER NOT NULL,
  github_id   INTEGER NOT NULL,
  github_login TEXT NOT NULL,
  created_at  TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (note_id, github_id)
);
