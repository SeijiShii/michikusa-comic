<!-- auto-generated-start -->
# 実装前セキュリティチェックリスト — _shared/auth (revise_001 + api wiring)

> guest JWT 認証面 + release での api wiring 時に手元に置くチェックリスト。

## [O25 秘密情報] GUEST_TOKEN_SECRET
- [ ] `GUEST_TOKEN_SECRET` を 32B+ のランダム値で生成（`openssl rand -base64 32` 等）
- [ ] サーバ env のみに設定（`VITE_` prefix 厳禁＝ブラウザ露出禁止）
- [ ] `.env.local` / デプロイ先 env のみ。コミット禁止（.gitignore 済）
- [x] `signGuestToken` は secret 空で throw（実装済）

## [O23 認可] owner resolver
- [x] client 送信の生 owner_id を信用しない（resolveOwner が署名検証、実装済）
- [ ] 実 Clerk binding（verifyClerk）を @clerk/backend の `authenticateRequest`/`getAuth(req).userId` に差し替え（release）
- [ ] 全 feature API が `withOwner` 経由で owner_id を受け取ることを確認

## [O27 / SEC-003 レート制限] ⚠️ 新規ゲスト発行エンドポイント
- [ ] **`/api/auth/guest`（provisionGuest）に IP/匿名単位レート制限を適用**（SEC-003 スコープに含める）
- [ ] guest-spam による DB 行膨張・コスト増の abuse を防ぐ（ゲストは厳しめ閾値）
- [ ] 既存 SEC-003 の rate limiter 実装に本エンドポイントを登録

## [O24 入力検証] token
- [x] 不正形式/改竄/期限/iss を verifyGuestToken が拒否（実装済）
- [x] alg-confusion 安全（header alg を信用せず常に HMAC-SHA256、実装済）

## [linkAccount/signOut]
- [ ] 実 Clerk `createExternalAccount`/`authenticateWithRedirect` を startGoogleLink/signInWithGoogle に binding（release）
- [ ] `external_account_exists` の実 error code を実 Clerk で確認し検知条件を合わせる（scaffold §1.6 broad match で hedge 済）
- [ ] `/sso-callback` ルートで keyless 時は Clerk コンポーネント非描画（offline-first 維持）
- [ ] 連携成功で guest token クリア → Clerk セッションへ（実装済ロジック）
<!-- auto-generated-end -->
