<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — _shared/auth (revise_001 guest JWT 認証面)

**レビュー日**: 2026-06-18
**レビュー実施者**: Claude (Opus 4.8 1M) + seiji
**対象**: _shared/auth revise_001（自前署名 guest JWT + 段階認証連携/サインアウト）
**入力**: revise_001 SPEC/PLAN + 実装コード（guestToken/owner/guestStore/linkAccount/signOut）
**観点ソース**: perspectives O23-O28 + concept §3.X SEC-001..005
**phase**: pre-impl（§3.0c release-pre ペア）

## 1. PJ 性質
公開 / 複数ユーザー（ゲスト中心）/ 個人情報あり（写真・位置）/ AI 利用 / 有償（PWYW）/ 国内主体。

## 2. 脆弱性パターン照合結果（新 auth 面）

### 2.1 サマリ
- Critical: 0 / High: 0 / Medium: 1 / Low: 1 / Info: 1
- 法令必須未対応: 0

### 2.2 詳細

#### [SEC-004 関連] O23 認可: owner resolver の信頼境界 — ✅ 対応済
- guest JWT/Clerk JWT の **署名検証済み sub/userId のみ** を owner に採用。client 送信の生 owner_id は不採用（`resolveOwner` が Bearer token を検証）。SEC-001/SEC-004 整合。
- 偽造耐性: guest token sub は `GUEST_TOKEN_SECRET`（サーバ専用）で署名 → 他者 sub の偽造不可。Clerk owner は verifyClerk 経由。

#### [O25 秘密情報] GUEST_TOKEN_SECRET — ✅ 対応済
- サーバ専用（`VITE_`/`import.meta.env` 露出なし、grep 確認済）。`.env.example` に presence のみ（空値）、ハードコードなし。`signGuestToken` は secret 空で throw。
- client が保持するのは**不透明な署名済み token**のみ（sub 偽造不可）。

#### [O24 入力検証] token パース — ✅ 対応済
- 不正形式/改竄/期限切れ/iss 不一致を `verifyGuestToken` が throw、`resolveOwner` が null 化（401）。
- **alg-confusion 安全**: verify は header の `alg` を信用せず常に HMAC-SHA256 で再計算 → `alg:none`/alg 差し替え攻撃が原理的に不成立。署名比較は `timingSafeEqual`（タイミング攻撃耐性）。

#### [SEC-003 / O27 レート制限] 新規ゲスト発行エンドポイント — ⚠️ Medium（要 wiring 反映）
- `/api/auth/guest`（provisionGuest）は DB 匿名行 upsert + token 署名を行う**新規公開エンドポイント**。レート制限が無いと guest-spam による DB 行膨張・コスト増の abuse 経路になりうる。
- **既存 SEC-003（O27、accepted-as-requirement）のスコープに本エンドポイントを必ず含める**こと。新規 §8 論点は起こさない（SEC-003 に subsumed）。L2 チェックリストに項目化。

#### [Low] guest JWT TTL 180日 + secret ローテーション
- 長命 token。secret ローテーション時に既存ゲストが一斉失効 → 再 provision（新 sub）で churn しうる。運用ノート（rotate は計画的に / 段階移行）。Low。

#### [Info] cross-service token 拒否
- iss=`michikusa-guest` 固定検証で他サービスの token を拒否。multi-service 環境での token 混入耐性 ✅。

## 3. §8 登録
- 新規 Critical/High なし（既存 SEC-001..005 で網羅。SEC-003 のスコープに guest endpoint を含めるのみ）。

## 4. 次のステップ
- L2（902）の rate-limit 項目を api wiring（release）で反映
- 実 Clerk binding 後に L3（security-review）で linkAccount/signOut の実コード確認
<!-- auto-generated-end -->
