import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { users } from "../db/schema.js";
import { purgeOwnerObjects } from "../services/storage/r2.js";
import type { AccountDeps } from "../api-handlers/account.js";
import type { OwnerId } from "../types/index.js";

// users 削除で全テーブル cascade (schema の onDelete:cascade)、R2 purge と協調 (SEC-001 DSR)
export const accountDeps: AccountDeps = {
  async deleteOwnerRows(ownerId: OwnerId) { await getDb().delete(users).where(eq(users.id, ownerId)); },
  async purgeOwnerObjects(ownerId: OwnerId) { await purgeOwnerObjects(ownerId); },
};
