import type { D1Database } from "@cloudflare/workers-types";
import { getSession } from "./db";

const ADMIN_GITHUB_LOGINS = ["chenzihui222", "lulucatdev"];
const SESSION_COOKIE = "zn_session";

export interface User {
  github_id: number;
  github_login: string;
  isAdmin: boolean;
}

export function getSessionId(request: Request): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export async function getCurrentUser(
  db: D1Database,
  request: Request
): Promise<User | null> {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;

  const session = await getSession(db, sessionId);
  if (!session) return null;

  return {
    github_id: session.github_id,
    github_login: session.github_login,
    isAdmin: ADMIN_GITHUB_LOGINS.includes(session.github_login),
  };
}

export function setSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
