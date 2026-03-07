import { getEnv } from "@/lib/env";
import { getSessionId, clearSessionCookie } from "@/lib/auth";
import { deleteSession } from "@/lib/db";

export async function POST(request: Request) {
  const { DB } = await getEnv();
  const sessionId = getSessionId(request);

  if (sessionId) {
    await deleteSession(DB, sessionId);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
