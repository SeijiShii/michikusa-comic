import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.js";

let _db: ReturnType<typeof drizzle> | null = null;
// 遅延初期化 (env は実行時に解決、実キーは release で)
export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 未設定 (release で FILL)");
  _db = drizzle(neon(url), { schema });
  return _db;
}
export { schema };
