# _shared/db 仕様書（横断基盤）

> **役割**: Neon (Postgres) + Drizzle スキーマ。9 エンティティのテーブル/制約/index/マイグレーション。所有権は app 層 owner resolver で担保（Neon は Supabase RLS 非搭載、SEC-004）
> **タグ**: cross-cutting / foundation
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`（§5 / §4.3）, `../types/001__shared_types_SPEC.md`
> **target_type**: cross-cutting（E2E スキップ）

---

## 1. 提供インターフェース
- Drizzle スキーマ（`schema.ts`）+ 型安全クライアント（`db`）+ マイグレーション
- 行型は `_shared/types` の `z.infer` 型に整合（db で型を重複定義しない、types を import）
- リポジトリ関数は各 feature / repository 層が持つ（db は接続 + スキーマ + マイグレーションのみ）

## 2. テーブル設計（concept §5.1 由来）
| テーブル | 主キー | 主カラム | index / 制約 |
|---|---|---|---|
| `users` | id (Clerk) | is_guest, created_at | — |
| `photos` | id (uuid) | owner_id, r2_key, taken_at, lat, lng, area, caption, created_at | idx(owner_id, created_at) |
| `comics` | id | owner_id, title, status, area, created_at, updated_at | idx(owner_id, created_at), idx(owner_id, area) |
| `comic_photos` | (comic_id, photo_id) | 順序 | FK→comics/photos（多対多） |
| `panels` | id | comic_id, order(1-4), image_r2_key, speech, bubble_layout(jsonb), style_prompt | uniq(comic_id, order), FK→comics ON DELETE CASCADE |
| `collections` | id | owner_id, year_month, created_at | uniq(owner_id, year_month) |
| `collection_comics` | (collection_id, comic_id) | — | FK |
| `ai_cost_logs` | id | owner_id, provider, metric, quantity, unit_price_version, estimated_usd, created_at | idx(created_at), idx(provider, created_at) |
| `payments` | id | owner_id, kind, status, amount_jpy, comic_id, stripe_ref, created_at | uniq(stripe_ref), idx(owner_id) |
| `feedbacks` | id | owner_id, kind, reaction, body, route, app_version, ua, created_at | idx(created_at) |

## 3. 所有権・認可（SEC-004 / O23）
- **Neon に RLS なし** → 全クエリは app 層で `owner_id = session.userId` を強制（`_shared/auth` の owner resolver）
- リポジトリ層は owner_id を必須引数に取り、WHERE 句に必ず含める（SPEC 規約として明記、レビューで機械チェック）
- **削除カスケード**（SEC-001/O54 DSR）: ユーザー全データ削除時、owner_id で全テーブルを cascade 削除（account 機能が呼ぶ）。R2 オブジェクト削除は storage 層と協調

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| 一意制約違反 | uniq(comic_id, order) / uniq(stripe_ref) で 409 マップ |
| FK 違反 | 親不在の panel/collection_comic は拒否 |
| マイグレーション | Drizzle migrate、前方適用のみ（破壊的変更は別マイルストーン、Class B apply） |

## 5. NFR + 連携
- **NFR**: 接続プール（Neon serverless driver）、index で owner 別クエリ最適化。低スケール（concept §3）
- **連携**: `_shared/types`（行型）/ 全 repository・feature（被参照）/ `_shared/storage`（削除協調）/ `_shared/cost-tracking`（ai_cost_logs 書き込み）

## 6. タグ別追加項目
- 該当なし（cross-cutting foundation）

## 7. スコープ外
- リポジトリ CRUD ロジック（各 feature / repository 層）
- 接続文字列の取得（PREREQUISITES §1 `DATABASE_URL`）

## 8. 未決事項
- 現時点で論点なし（2026-06-09）。bubble_layout jsonb スキーマは [論点-001] 確定後に制約強化

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復7） |
