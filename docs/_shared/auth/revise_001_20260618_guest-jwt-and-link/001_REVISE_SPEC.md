# _shared/auth 変更仕様書（ゲスト JWT 永続化 + 段階認証連携/サインアウト動線）

> **改修種別**: 機能変更 + 拡張（owner churn 根絶 + O22(B) 連携動線追加）
> **issue / slug**: 001 / guest-jwt-and-link
> **基準 SPEC**: `../001__shared_auth_SPEC.md`
> **最終更新**: 2026-06-18
> **タグ**: cross-cutting / foundation / auth-required
> **起点**: `docs/AUDIT_20260618_0807.md` High 2 件（O22(B)/O22(D)）

---

## 1. 変更概要

audit が検出した 2 件の High を根絶する:
1. **O22(D) owner churn**: 現 `establishGuestSession`（§1 ticket 方式 = ゲスト=Clerk セッション、owner=Clerk userId）は、Clerk セッション失効後のリロードで新匿名 user が発行され owner が churn → owner-scoped local-first データ（comics/photos/payments）が orphan 化して消失する。**scaffold §1.7 の自前署名 guest JWT 永続方式**（Clerk 非セッション化、owner = guest JWT の sub）へ移行し、トークン失効でも owner が安定するようにする。
2. **O22(B) 段階認証/サインアウト動線欠落**: SPEC §1 が `linkAccount({provider})` を契約しているのに実コードが皆無（契約違反）。ゲスト→Google 連携（scaffold §1.6 の 1 ボタン link-first + sign-in fallback）と対の **サインアウト動線**（両輪、audit step 3.10）を実装する。

## 2. 変更前 vs 変更後

### 2.1 UC 変更
| UC | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| ゲスト開始 | `establishGuestSession` が per-call `createAnonymousUser`+`createSignInToken`(ticket) | `provisionGuest` がサーバ自前署名 guest JWT を発行、クライアントが localStorage 永続して再利用 | 失効後 churn を原理的に排除 |
| owner 解決 | Clerk session の userId のみ | `iss` で Clerk JWT / guest JWT を振り分け、guest は `verifyGuestToken` で sub を得る | ゲストを Clerk 非セッション化 |
| 段階認証 | （未実装） | `linkAccount`（Google OAuth、link-first + sign-in fallback の 1 ボタン） | O22(B) 契約履行 |
| サインアウト | （未実装） | `signOut`（連携後の authed 状態から離脱、別アカウント切替可） | 両輪（audit step 3.10） |

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `POST /api/auth/guest` | （ticket 返却の想定のみ、未配線） | `provisionGuest`: sub=`guest_<uuid>` を DB upsert → `signGuestToken(sub)`（HS256, TTL 180日, iss 固定）→ `{ guestToken }` | 新規（Clerk createUser しない=MAU 非消費） |
| owner resolver | `SessionProvider.getOwnerId()` のみ | `resolveOwner(authHeader)`: Bearer JWT の iss で分岐（Clerk → Clerk 検証 / guest → `verifyGuestToken`） | 後方互換（既存 `withOwner`/`requireOwner` シグネチャ維持、provider 実装を差し替え） |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| `users` | `id` に `guest_<uuid>` 形式の guest sub を許容（既存 Clerk userId と共存）。`is_guest` は据え置き | ❌（スキーマ不変、id 文字列の意味拡張のみ） |

### 2.4 バリデーション・エラー変更
| 対象 | 変更前 | 変更後 |
|---|---|---|
| guest JWT 検証 | — | 署名不正/期限切れ/iss 不一致 → 401（`verifyGuestToken` が throw、`withOwner` が 401 化） |
| client 送信 sub | — | 生 sub は信用しない。**サーバ署名済み token のみ**を信頼（SEC-001 整合） |

## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| _shared/auth | 高 | guestSession 置換 + owner resolver 拡張 + linkAccount/signOut 追加 |
| 全 feature API（withOwner 経由） | 中 | resolver 差し替えのみ、ハンドラ側コード不変（owner_id 取得 IF 維持） |
| account（linkAccount/削除 UI） | 中 | 連携・サインアウト UI 動線を account 画面に追加 |
| db（users 行） | 低 | id 文字列の意味拡張のみ、スキーマ不変 |

## 4. 後方互換性
- **互換維持**: ✅（`withOwner`/`requireOwner`/`getOwnerId` のシグネチャ不変）
- 内部実装（guest 確立方式）は非互換だが、**まだ本番セッションを張っていない（実キー未注入・初回公開前）**ため移行対象データは存在しない → orphan 回収マイグレーション不要。
- 旧 `establishGuestSession`（ticket 方式）は撤去（scaffold §1.7「§1 の per-call createUser 経路を撤去」）。

## 5. ロールバック方針
- **コード revert で戻せる**: ✅（git tracked、本番データ未発生）
- DB ロールバック: 不要（スキーマ不変）

## 6. リリース戦略
- **方式**: 一括（初回公開前のため段階展開不要）
- 実 Clerk + 実キーでの「匿名→authed API 200」「Google 連携往復」結合検証は `/flow:release` Phase 2 で実施（P4.46 DoD）。

## 7. 詳細仕様（新仕様）

### 7.1 提供インターフェース（更新）
| 関数 | 責務 |
|---|---|
| `genGuestSub()` | `guest_<uuid>` 形式の sub を生成 |
| `signGuestToken(sub)` | HS256 署名 guest JWT 発行（secret=`GUEST_TOKEN_SECRET`、TTL 180日、iss=`michikusa-guest`） |
| `verifyGuestToken(token)` | 署名/期限/iss 検証 → sub を返す（不正は throw） |
| `provisionGuest(deps)` | sub 生成 → DB 匿名行 upsert → `signGuestToken` → `{ guestToken }`（サーバ、Clerk createUser しない） |
| `resolveOwner(authHeader, deps)` | Bearer JWT の iss で Clerk/guest 振り分け → OwnerId（無効/無は null） |
| `getStoredGuestToken()` / `storeGuestToken()` / `clearGuestToken()` | クライアント localStorage 永続（key=`michikusa.guestToken`） |
| `withOwner(handler)` / `requireOwner()` / `getOwnerId()` | 据え置き（provider が resolveOwner ベースに） |
| `linkAccount({ provider })` | scaffold §1.6 の 1 ボタン Google 連携（link-first + sign-in fallback、`/sso-callback` 復帰分岐） |
| `signOut()` | Clerk セッション破棄 → ゲストへ戻す（連携解除後の再ゲスト化） |

### 7.2 owner 解決ルーティング
- `Authorization: Bearer <jwt>` を decode（検証前に iss だけ peek）
  - iss=Clerk → Clerk の `authenticateRequest` で userId
  - iss=`michikusa-guest` → `verifyGuestToken` で sub
  - その他/無 → null（`requireOwner` は 401）
- **client 送信の生 owner_id は一切信用しない**（SEC-001/SEC-004）。

### 7.3 段階認証フロー（scaffold §1.6）
- 1 ボタン「Google でログイン」: session fresh 化不要（ゲストが Clerk セッションでない＝§1.5/§1.6 reverification 地雷が原理消滅、scaffold §1.7 末尾）。`createExternalAccount`→新規連携 or `external_account_exists`→sign-in fallback。連携成功で `clearGuestToken()`。
- `/sso-callback` ルート: keyless では Clerk コンポーネント非描画で `/account` リダイレクトのみ（offline-first 維持）。

### 7.5 機能固有 NFR + 既存連携（新仕様）
- guest JWT secret はサーバ専用（`GUEST_TOKEN_SECRET`、`.env.example` 追加）。ブラウザ非露出。
- 連携: 全 feature API（withOwner）/ account（link/signout UI）/ payments（課金は連携後）。

## 8. タグ別追加項目（auth-required）
- 所有者チェック: owner_id = resolveOwner 結果（Clerk userId または guest sub）。
- ゲスト権限: CRUD 可、課金は連携後。guest JWT 失効でも sub 安定（churn なし）。

## 9. 未決事項
- 現時点で論点なし（2026-06-18）。`GUEST_TOKEN_SECRET` の実値は release で FILL（Class C）。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-18 | 初版作成（audit High O22(B)/(D) 是正） | /flow:revise |
