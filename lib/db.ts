import type { D1Database } from "@cloudflare/workers-types";

export interface Like {
  github_id: number;
  github_login: string;
}

export interface Note {
  id: number;
  content: string;
  reference: string;
  created_at: string;
  likes: Like[];
}

export interface Session {
  id: string;
  github_id: number;
  github_login: string;
  created_at: string;
  expires_at: string;
}

// Notes
interface NoteRow {
  id: number;
  content: string;
  reference: string;
  created_at: string;
}

interface LikeRow {
  note_id: number;
  github_id: number;
  github_login: string;
}

export async function getNotes(db: D1Database): Promise<Note[]> {
  const { results: noteRows } = await db
    .prepare("SELECT * FROM notes ORDER BY created_at DESC")
    .all<NoteRow>();

  const notes = noteRows ?? [];
  if (notes.length === 0) return [];

  const ids = notes.map((n) => n.id);
  const placeholders = ids.map(() => "?").join(",");
  const { results: likeRows } = await db
    .prepare(`SELECT note_id, github_id, github_login FROM likes WHERE note_id IN (${placeholders})`)
    .bind(...ids)
    .all<LikeRow>();

  const likesMap = new Map<number, Like[]>();
  for (const row of likeRows ?? []) {
    const arr = likesMap.get(row.note_id) ?? [];
    arr.push({ github_id: row.github_id, github_login: row.github_login });
    likesMap.set(row.note_id, arr);
  }

  return notes.map((n) => ({
    ...n,
    likes: likesMap.get(n.id) ?? [],
  }));
}

export async function createNote(
  db: D1Database,
  note: { content: string; reference: string }
): Promise<number> {
  const result = await db
    .prepare("INSERT INTO notes (content, reference) VALUES (?, ?)")
    .bind(note.content, note.reference)
    .run();
  return result.meta.last_row_id as number;
}

export async function deleteNote(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM likes WHERE note_id = ?").bind(id).run();
  await db.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
}

// Likes
export async function toggleLike(
  db: D1Database,
  noteId: number,
  githubId: number,
  githubLogin: string
): Promise<boolean> {
  const existing = await db
    .prepare("SELECT 1 FROM likes WHERE note_id = ? AND github_id = ?")
    .bind(noteId, githubId)
    .first();

  if (existing) {
    await db
      .prepare("DELETE FROM likes WHERE note_id = ? AND github_id = ?")
      .bind(noteId, githubId)
      .run();
    return false; // unliked
  } else {
    await db
      .prepare("INSERT INTO likes (note_id, github_id, github_login) VALUES (?, ?, ?)")
      .bind(noteId, githubId, githubLogin)
      .run();
    return true; // liked
  }
}

// Sessions
export async function createSession(
  db: D1Database,
  session: { id: string; github_id: number; github_login: string; expires_at: string }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO sessions (id, github_id, github_login, expires_at) VALUES (?, ?, ?, ?)"
    )
    .bind(session.id, session.github_id, session.github_login, session.expires_at)
    .run();
}

export async function getSession(
  db: D1Database,
  id: string
): Promise<Session | null> {
  return db
    .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')")
    .bind(id)
    .first<Session>();
}

export async function deleteSession(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}
