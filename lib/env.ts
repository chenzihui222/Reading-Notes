import { env } from "cloudflare:workers";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

interface AppEnv {
  DB: D1Database;
  IMAGES: R2Bucket;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export async function getEnv(): Promise<AppEnv> {
  return env as unknown as AppEnv;
}
