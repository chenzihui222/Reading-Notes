import { getEnv } from "@/lib/env";
import { getNotes, createNote } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const { DB } = await getEnv();
  const notes = await getNotes(DB);
  return Response.json({ notes });
}

export async function POST(request: Request) {
  const { DB } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await request.json()) as {
    content: string;
    reference: string;
  };

  if (!body.content?.trim()) {
    return Response.json({ error: "Content required" }, { status: 400 });
  }

  const id = await createNote(DB, {
    content: body.content.trim(),
    reference: body.reference?.trim() || "",
  });

  return Response.json({ id });
}
