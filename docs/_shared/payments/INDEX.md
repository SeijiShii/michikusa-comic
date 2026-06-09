# _shared/payments ドキュメントインデックス

**最終更新**: 2026-06-09
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 責務 (短縮、詳細は README.md)
課金基盤（Stripe 単発 PWYW + Webhook 署名検証）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001__shared_payments_SPEC.md | SPEC | 設計済 | 2026-06-09 | Stripe 単発 PWYW + Webhook 署名検証, 継続課金なし |
| 002 | 002__shared_payments_PLAN.md | PLAN | 設計済 | 2026-06-09 | checkout/webhook, 3 Phase |
| 003 | 003__shared_payments_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-09 | 署名NG 400, 冪等, cov 85% |
| (E2E) | — | — | skip | — | export 側 |
| 101 | 101__shared_payments_IMPL_REPORT.md | IMPL_REPORT | 一部実装 | 2026-06-09 | webhook冪等/署名 3テストgreen, Stripe SDK後続 |

## 関連
- 親 concept: `../../concept.md` §1.3.2 payments 行
- **依存**: _shared/db, _shared/auth
- 実装コード: §1.4 参照（横断は分散実装）

## AI アクセスガイド
- 責務概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
