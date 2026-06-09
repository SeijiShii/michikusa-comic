# compose ドキュメントインデックス

**最終更新**: 2026-06-09
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
AI 4 コマ生成（コマ割り提案 + セリフ案 + 絵柄 stylize）+ アプリ側セリフ/吹き出し合成 + 微修正 + 保存

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_compose_SPEC.md | SPEC | 設計済 | 2026-06-09 | AI 4コマ生成+アプリ側セリフ合成([論点-001])+編集+保存, SEC-003 |
| 002 | 002_compose_PLAN.md | PLAN | 設計済 | 2026-06-09 | ComposeScreen/PanelCanvas, 4 Phase |
| 003 | 003_compose_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-09 | rate limit/合成/XSS, cov 80% |
| 004 | 004_compose_E2E_TEST.md | E2E_TEST | 設計済 | 2026-06-09 | 生成→保存, O45進捗, Level1-3 |
| 101 | 101_compose_IMPL_REPORT.md | IMPL_REPORT | 一部実装 | 2026-06-09 | SpeechEditor 1 RTLテストgreen, 生成/PanelCanvas([論点-001])後続 |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../concept.md` §1.3.1 compose 行
- **依存**: _shared/ai, _shared/storage, _shared/db, capture
- 実装コード: `src/features/compose/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

## 機能性質タグ
- (まだ未確定。`/flow:feature` 実行時に決定)

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
