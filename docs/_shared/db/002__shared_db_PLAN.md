# _shared/db 実装計画書

> **入力**: `./001__shared_db_SPEC.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/db/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/db/schema.ts` | Drizzle テーブル定義（9 テーブル + 中間表）+ relations | drizzle-orm, types | 240 |
| `src/db/client.ts` | Neon serverless driver + drizzle クライアント（接続プール） | @neondatabase/serverless, drizzle | 40 |
| `src/db/migrate.ts` | マイグレーション実行（drizzle-kit） | drizzle-kit | 30 |
| `drizzle.config.ts` | drizzle-kit 設定 | — | 20 |
| `src/db/index.ts` | re-export | 上記 | 15 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: schema + client（interface 確立）
- schema.ts（全テーブル）+ client.ts。型が types に整合することを確認
### Phase 2: マイグレーション
- drizzle-kit generate → migrate.ts。空 DB に適用 → スキーマ検証テスト
### Phase 3: 所有権規約テスト
- owner_id 必須 / cascade 削除（DSR）の repository 規約テスト（モック or test DB）

## 3. 依存関係順序
```
types → schema → client → migrate
```

## 4. 既存ファイルへの影響
- なし（基盤、優先度 1）

## 5. 横断への追加・変更
- 本モジュールがスキーマ SoT。auth/storage/cost-tracking/payments + 全 feature が `db` を import

## 6. リスク・注意点
- **Neon RLS 非搭載**: 所有権は app 層で担保（SEC-004）。repository 層が owner_id を漏らすと情報漏洩 → レビュー必須 + lint ルール検討
- 破壊的マイグレーション apply は Class B（実 DB 変更）、本 PJ は新規のため初回適用のみ
- DSR cascade 削除は R2 削除（storage）と協調が必要（account 機能で結合テスト）

## 7. 完了の定義（DoD）
- [ ] schema.ts が 9 テーブル + 中間表 + relations を定義、types に整合
- [ ] マイグレーション生成 + 適用 + スキーマ検証テスト green
- [ ] 所有権規約（owner_id 必須）+ cascade 削除テスト green
- [ ] typecheck green
- [ ] E2E: cross-cutting スキップ（統合は account/各 feature E2E でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
