import { getEnv } from "@/lib/env";

export async function GET(request: Request) {
  const { GITHUB_CLIENT_ID } = await getEnv();

  const origin = new URL(request.url).origin;
  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubUrl.searchParams.set("redirect_uri", `${origin}/api/auth/callback`);
  githubUrl.searchParams.set("scope", "read:user");

  return Response.redirect(githubUrl.toString(), 302);
}
