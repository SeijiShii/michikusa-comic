// クライアント側 guest JWT 永続 (scaffold §1.7)。
// localStorage に永続し、失効/リロードでも同じ guest token を再利用 → owner churn 防止。
// storage は injectable (テスト容易 / SSR 安全)。

export const GUEST_TOKEN_KEY = "michikusa.guestToken";

export interface KVStore {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export function getStoredGuestToken(store: KVStore): string | null {
  return store.getItem(GUEST_TOKEN_KEY);
}

export function storeGuestToken(store: KVStore, token: string): void {
  store.setItem(GUEST_TOKEN_KEY, token);
}

export function clearGuestToken(store: KVStore): void {
  store.removeItem(GUEST_TOKEN_KEY);
}

// 起動時: 既存 token があれば再利用 (no-op = churn 防止)、無ければ fetch して永続。
export async function ensureGuestToken(
  store: KVStore,
  fetchToken: () => Promise<string>,
): Promise<string> {
  const existing = getStoredGuestToken(store);
  if (existing) return existing; // U5: 再利用 (fetch しない)
  const fresh = await fetchToken();
  storeGuestToken(store, fresh);
  return fresh;
}
