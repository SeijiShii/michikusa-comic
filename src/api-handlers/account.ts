import type { OwnerId } from "../types/index.js";

// DSR 全データ削除ハンドラ (SEC-001/O54): db cascade + R2 purge を協調、確実に消す
export interface AccountDeps {
  deleteOwnerRows(ownerId: OwnerId): Promise<void>;   // db: owner_id cascade 削除
  purgeOwnerObjects(ownerId: OwnerId): Promise<void>;  // storage: R2 全オブジェクト purge
}

export class PurgeError extends Error {
  constructor(public stage: "db" | "storage", cause: unknown) {
    super(`データ削除に失敗しました (${stage})`); this.name = "PurgeError";
  }
}

// 両ストアを確実に消す。片方失敗でも整合性のため明示エラー (DSR 履行)
export async function handleDeleteAllData(deps: AccountDeps, ownerId: OwnerId): Promise<{ ok: true }> {
  try { await deps.deleteOwnerRows(ownerId); }
  catch (e) { throw new PurgeError("db", e); }
  try { await deps.purgeOwnerObjects(ownerId); }
  catch (e) { throw new PurgeError("storage", e); }
  return { ok: true };
}
