import { getEnv } from "@/lib/env";
import { getNotes } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import HomePage from "./home";

export default async function Home() {
  const { DB } = await getEnv();
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const fakeReq = new Request("http://localhost", {
    headers: { Cookie: cookie },
  });
  const user = await getCurrentUser(DB, fakeReq);
  const notes = await getNotes(DB);

  return <HomePage notes={notes} user={user} />;
}
