# 実装レポート: _shared/auth revise_001（ゲスト JWT 永続化 + 連携/サインアウト）

## 実装日時
2026-06-18 08:18 (JST)

## モード
revise

## 関連ドキュメント
- 001_REVISE_SPEC.md / 002_REVISE_PLAN.md / 003_REVISE_UNIT_TEST.md / 004_REVISE_E2E_TEST.md
- 根拠: ../../AUDIT_20260618_0807.md §3.2（High O22(B)/(D)）
- AI_LOG: ../../AI_LOG/D20260618_004_tdd__shared_auth_revise_001.md

## 変更一覧

### Phase 1: guest JWT コア + provisionGuest（owner churn 根絶 O22(D)）
- 新規 `src/services/auth/guestToken.ts`: `genGuestSub`/`signGuestToken`/`verifyGuestToken`/`peekIss`/`isGuestSub`。node:crypto HMAC で HS256 最小実装（依存追加なし=可逆、原則14）。iss=`michikusa-guest`、TTL 180日、timingSafeEqual で署名検証。
- 置換 `src/services/auth/guestSession.ts`: ticket 方式（per-call createAnonymousUser+createSignInToken）を撤去 → `provisionGuest`（guest JWT 発行、**Clerk createUser 非呼び出し**=MAU 非消費）。
- テスト: guestToken.test.ts（U1/U8/U9/U10 + 改竄/secret）, guestSession.test.ts（U2/M2/D1）。

### Phase 2: owner resolver ルーティング
- 拡張 `src/services/auth/owner.ts`: `resolveOwner(authHeader, deps)` — Bearer JWT の iss を peek し guest JWT は `verifyGuestToken`、それ以外は `verifyClerk` 委譲。`sessionProviderFrom` 追加。client 送信生 owner_id は不採用（SEC-001/004）。
- 更新 `api/_session.ts`: `sessionFromReq` を resolveOwner ベースに（Authorization ヘッダ → owner、verifyClerk は release で @clerk/backend 注入）。
- テスト: resolveOwner.test.ts（U3/U4/U11 + 無効/改竄/配列）。

### Phase 3: client 永続 + 連携 + サインアウト UI（O22(B)/(E)）
- 新規 `guestStore.ts`: `getStoredGuestToken`/`storeGuestToken`/`clearGuestToken`/`ensureGuestToken`（既存再利用 no-op=churn 防止、key=`michikusa.guestToken`）。
- 新規 `linkAccount.ts`: scaffold §1.6 の 1 ボタン分岐（`isExistingAccountError`/`decideAfterCallback`/`handleLinkCallback`）。新規=linked（guest token クリア）/ 既存=sign-in fallback / 二重=loop-stop（U13）。Clerk action は injectable。
- 新規 `signOut.ts`: Clerk セッション破棄 → guest token 破棄 → 新ゲストへ（両輪、行き止まり防止）。
- 新規 `features/account/AccountAuth.tsx`: ゲスト=「Google でログイン」/ 連携済=サインアウト動線（displayEmail は実 Google email）。
- 更新 `.env.example`: `GUEST_TOKEN_SECRET` 追加。
- テスト: guestStore/linkAccount/signOut/AccountAuth 各 test。

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 追加変更 | HS256 を jose/jsonwebtoken でなく node:crypto HMAC で実装（依存追加回避=可逆、原則14） |
| 省略 | 実 Clerk SDK 結合（createExternalAccount/authenticateWithRedirect の実 binding）は injectable 境界として release に委譲（P4.46 DoD、実キー要） |
| 問題と対処 | なし。O22(D) churn 中核（guest JWT 永続）は完全実装、(B) 連携分岐ロジックも実装+テスト済 |

## PR Description
### タイトル
_shared/auth: ゲスト JWT 永続化で owner churn 根絶 + 段階認証連携/サインアウト動線（audit High O22 B/D）
### 概要
owner-scoped local-first のためゲストを Clerk 非セッション化（自前署名 guest JWT 永続）し、トークン失効/リロードでの owner churn=データ消失を根絶。あわせて契約済み未実装だった Google 段階認証連携 + 対のサインアウト動線（両輪）を実装。
### 変更内容
- guest JWT 発行/検証/永続（owner=sub、Clerk セッション非依存）
- owner resolver の iss ルーティング（guest/Clerk JWT 振り分け）
- 1 ボタン Google 連携（link-first + sign-in fallback）+ サインアウト
### テスト
- 108 tests green（+30）、typecheck clean。実キー結合（匿名→authed 200 / Google 往復）は release Phase 2。
