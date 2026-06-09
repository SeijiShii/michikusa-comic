# _shared/db 実装レポート

**実装日**: 2026-06-09 / /flow:tdd（via /flow:auto 反復29）

## 実装（5 テスト green, pglite 実 Postgres 検証）
- `schema.ts`: Drizzle 9 テーブル（users/photos/comics/panels/ai_cost_logs/payments/feedbacks + index/uniq）
- `schema.sql`: DDL（マイグレーション相当、pglite テスト用）
- cascade 削除（**owner 削除 → 全データ消失 = SEC-001 DSR**、comic 削除 → panel cascade）を実 Postgres で検証
- uniq(comic_id,order) / uniq(stripe_ref) / FK 違反を検証

## DoD 充足
- [x] schema 9 テーブル + index/制約、types に整合
- [x] **cascade 削除（DSR）テスト green（pglite 実 Postgres）**
- [x] 一意/FK 違反テスト green
- [x] typecheck PASS（@types/node 追加）
- [ ] 本番マイグレーション（drizzle-kit generate → Neon、release 時）

## 備考
- pglite（@electric-sql/pglite）でローカル高速テスト。本番は Neon serverless driver（client.ts、release 時に実 DATABASE_URL）
