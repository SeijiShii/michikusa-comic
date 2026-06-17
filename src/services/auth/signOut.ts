// サインアウト動線 (O22(E) 両輪、audit step 3.10)。
// 連携(authed)状態から離脱 → ゲストへ戻る。別アカウント切替・連携解除を可能にし「抜けられない詰み」を防ぐ。
import { clearGuestToken, ensureGuestToken, type KVStore } from "./guestStore.js";

export interface SignOutDeps {
  store: KVStore;
  // Clerk: signOut() でセッション破棄 (実装は @clerk/clerk-react、release で注入)
  clerkSignOut(): Promise<void>;
  // サインアウト後に新しいゲスト token を取得 (サーバ /api/auth/guest)
  fetchGuestToken(): Promise<string>;
}

// signOut — Clerk セッション破棄 → 旧 guest token 破棄 → 新規ゲストへ戻す。
export async function signOut(deps: SignOutDeps): Promise<string> {
  await deps.clerkSignOut();
  clearGuestToken(deps.store);
  // 新しいゲスト identity を確立 (ensureGuestToken は store 空なので fetch する)
  return ensureGuestToken(deps.store, deps.fetchGuestToken);
}
