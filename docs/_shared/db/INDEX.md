# _shared/db ドキュメントインデックス

**最終更新**: 2026-06-09
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 責務 (短縮、詳細は README.md)
DB スキーマ・マイグレーション（Neon Postgres + Drizzle スキーマ/制約/index）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001__shared_db_SPEC.md | SPEC | 設計済 | 2026-06-09 | Drizzle 9 テーブル、所有権 app 層担保(SEC-004)、cascade 削除(DSR) |
| 002 | 002__shared_db_PLAN.md | PLAN | 設計済 | 2026-06-09 | src/db/ 5 ファイル、3 Phase |
| 003 | 003__shared_db_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-09 | test DB、cascade/一意/FK、cov 80% |
| (E2E) | — | — | skip | — | cross-cutting スキップ |

## 関連
- 親 concept: `../../concept.md` §1.3.2 db 行
- **依存**: （なし）
- 実装コード: §1.4 参照（横断は分散実装）

## AI アクセスガイド
- 責務概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
