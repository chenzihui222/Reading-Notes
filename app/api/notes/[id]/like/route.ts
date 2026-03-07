import { getEnv } from "@/lib/env";
import { toggleLike } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { DB } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user) {
    return Response.json({ error: "Login required" }, { status: 401 });
  }

  const liked = await toggleLike(DB, parseInt(id), user.github_id, user.github_login);
  return Response.json({ liked });
}
