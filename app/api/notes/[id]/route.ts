import { getEnv } from "@/lib/env";
import { deleteNote } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { DB } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  await deleteNote(DB, parseInt(id));
  return Response.json({ success: true });
}
