import { getEnv } from "@/lib/env";
import { createSession } from "@/lib/db";
import { setSessionCookie, generateSessionId } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.redirect(url.origin, 302);
  }

  const { DB, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = await getEnv();

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    return Response.redirect(url.origin + "/?error=auth_failed", 302);
  }

  // Get user info
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "zihui-notes",
    },
  });

  const userData = (await userRes.json()) as {
    id: number;
    login: string;
  };

  // Create session
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await createSession(DB, {
    id: sessionId,
    github_id: userData.id,
    github_login: userData.login,
    expires_at: expiresAt,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.origin,
      "Set-Cookie": setSessionCookie(sessionId),
    },
  });
}
