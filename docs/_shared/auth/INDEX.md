# _shared/auth ドキュメントインデックス

**最終更新**: 2026-06-09
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 責務 (短縮、詳細は README.md)
認証・認可基盤（Clerk ゲスト→段階認証・セッション・所有権制御）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001__shared_auth_SPEC.md | SPEC | 設計済 | 2026-06-09 | Clerk ゲスト→段階認証(O22) + owner resolver(SEC-004) + 本番経路(P4.46) |
| 002 | 002__shared_auth_PLAN.md | PLAN | 設計済 | 2026-06-09 | guestSession 本番経路, withOwner, 3 Phase |
| 003 | 003__shared_auth_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-09 | 401/200, 匿名→authed 結合(P4.46 DoD) |
| (E2E) | — | — | skip | — | capture/account 側でカバー |
| 101 | 101__shared_auth_IMPL_REPORT.md | IMPL_REPORT | 一部実装 | 2026-06-09 | owner resolver 6テストgreen, ゲスト本番経路は release |

## 関連
- 親 concept: `../../concept.md` §1.3.2 auth 行
- **依存**: _shared/db
- 実装コード: §1.4 参照（横断は分散実装）

## AI アクセスガイド
- 責務概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
