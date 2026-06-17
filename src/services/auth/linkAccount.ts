// ゲスト → Google 段階認証 (O22(B)、scaffold §1.6 の 1 ボタン link-first + sign-in fallback)。
// ゲストは Clerk セッションでない (guest JWT) ため reverification 地雷が原理消滅 (scaffold §1.7 末尾)。
// 純粋な分岐ロジックを切り出してテスト可能にする (実 Clerk action は injectable)。
import { clearGuestToken, type KVStore } from "./guestStore.js";

const SIGNIN_FALLBACK_FLAG = "michikusa.linkFallback";

// 既に DB 連携済みアカウントを選んだときの error code か (provider 依存、broad match で hedge)
export function isExistingAccountError(code?: string | null): boolean {
  if (!code) return false;
  return /exists|claimed|already|identification/i.test(code);
}

export type LinkOutcome = "linked" | "signin-fallback" | "loop-stop";

// OAuth コールバック復帰時の分岐 (scaffold §1.6 ②③)
export function decideAfterCallback(
  errorCode: string | null | undefined,
  alreadyFellBack: boolean,
): LinkOutcome {
  if (!isExistingAccountError(errorCode)) return "linked"; // 新規連携成功
  if (alreadyFellBack) return "loop-stop"; // U13: 二重リダイレクト抑止 (1 回だけ fallback)
  return "signin-fallback"; // 既存アカウント → sign-in にフォールバック
}

export interface LinkDeps {
  store: KVStore;
  // Clerk: user.createExternalAccount({strategy:'oauth_google', redirectUrl}) → Google へ
  startGoogleLink(): Promise<void>;
  // Clerk: signIn.authenticateWithRedirect({strategy:'oauth_google', ...}) で既存ユーザーへ
  signInWithGoogle(): Promise<void>;
  flags: KVStore; // sessionStorage 相当 (loop ガード)
}

// 1 ボタン「Google でログイン」onClick → link 開始 (scaffold §1.6 ①)
export async function startLinkGoogle(deps: LinkDeps): Promise<void> {
  await deps.startGoogleLink();
}

// /account 復帰時のハンドラ (scaffold §1.6 ②③)
export async function handleLinkCallback(
  deps: LinkDeps,
  errorCode: string | null | undefined,
): Promise<LinkOutcome> {
  const alreadyFellBack = deps.flags.getItem(SIGNIN_FALLBACK_FLAG) === "1";
  const outcome = decideAfterCallback(errorCode, alreadyFellBack);
  if (outcome === "linked") {
    clearGuestToken(deps.store); // 連携成功 → guest token 破棄 (Clerk セッションへ)
    deps.flags.removeItem(SIGNIN_FALLBACK_FLAG);
  } else if (outcome === "signin-fallback") {
    deps.flags.setItem(SIGNIN_FALLBACK_FLAG, "1"); // 1 回だけ fallback
    await deps.signInWithGoogle();
  }
  // loop-stop: 何もしない (無限ループ防止)
  return outcome;
}
