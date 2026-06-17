// アカウント認証 UI 動線 (O22(B)/(E) 両輪)。
// - ゲスト: 「Google でログイン」1 ボタン (scaffold §1.6、link/sign-in は内部自動分岐)
// - 連携済(authed): サインアウト動線を提示 (別 Google 切替・連携解除可、行き止まり防止)
import { useState } from "react";

export interface AccountAuthProps {
  isAuthed: boolean;
  displayEmail?: string | null; // 実 Google email (合成 @guests は隠す、scaffold §1.6)
  onGoogleLogin: () => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
}

export function AccountAuth({ isAuthed, displayEmail, onGoogleLogin, onSignOut }: AccountAuthProps) {
  const [busy, setBusy] = useState(false);
  const run = (fn: () => void | Promise<void>) => async () => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };
  return (
    <section aria-label="アカウント">
      {isAuthed ? (
        <div>
          {displayEmail && <p>{displayEmail} でログイン中</p>}
          <button type="button" disabled={busy} onClick={run(onSignOut)}>
            サインアウト
          </button>
        </div>
      ) : (
        <button type="button" disabled={busy} onClick={run(onGoogleLogin)}>
          Google でログイン
        </button>
      )}
    </section>
  );
}
