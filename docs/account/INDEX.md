# account ドキュメントインデックス

**最終更新**: 2026-06-09
**生成元**: /flow:concept (drift reconcile via /flow:auto + /flow:secure SEC-001)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
アカウント/データ管理（ゲスト→連携の段階認証 UI、セルフサービス全データ削除 = Neon 行 + R2 画像 purge、開示=自分の全データ閲覧、AI 同意 ON/OFF）。SEC-001/O54 由来の DSR 履行手段

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_account_SPEC.md | SPEC | 設計済 | 2026-06-09 | セルフ全データ削除(db+R2 purge) SEC-001/O54 DSR 非交渉, 段階認証, 開示 |
| 002 | 002_account_PLAN.md | PLAN | 設計済 | 2026-06-09 | delete(cascade+purge)/link/cron, 3 Phase |
| 003 | 003_account_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-09 | 削除協調(DSR), cov 85% |
| 004 | 004_account_E2E_TEST.md | E2E_TEST | 設計済 | 2026-06-09 | 削除→db+R2残置0, 開示, Level1+2 |
| 101 | 101_account_IMPL_REPORT.md | IMPL_REPORT | 一部実装 | 2026-06-09 | DeleteAllData UI(二段階確認/O54) 3 RTLテストgreen, 削除API後続 |

## 関連
- 親 concept: `../concept.md` §1.3.1 account 行
- **依存**: _shared/auth, _shared/db, _shared/storage, gallery
- **セキュリティ**: [SEC-001] O54 DSR（Critical、accepted-as-requirement）
- 実装コード: `src/features/account/`（§1.4 参照）

## AI アクセスガイド
- 機能概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

## 機能性質タグ
- legal-required / data-subject-rights / 非交渉の必須

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
