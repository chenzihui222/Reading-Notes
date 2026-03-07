import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

interface CloudflareEnv {
  DB: D1Database;
  IMAGES: R2Bucket;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

declare namespace Cloudflare {
  interface Env extends CloudflareEnv {}
}
