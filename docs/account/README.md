# account

アカウント/データ管理（ゲスト→連携の段階認証 UI、セルフサービス全データ削除 = Neon 行 + R2 画像 purge、開示=自分の全データ閲覧、AI 同意 ON/OFF）。SEC-001/O54 由来の DSR 履行手段

## このフォルダに置くドキュメント

- `001_account_SPEC.md` — 仕様書（`/flow:feature` で生成）
- `002_account_PLAN.md` — 実装計画書
- `003_account_UNIT_TEST.md` — 単体テスト計画
- `004_account_E2E_TEST.md` — E2E テスト計画

## 関連

- 概念設計: `../concept.md` §1.3.1（優先度 5、依存: _shared/auth, _shared/db, _shared/storage, gallery）
- セキュリティ: `../SECURITY_REVIEW_20260609.md#sec-001`（[SEC-001] O54 DSR、Critical）
- 実装コード対応: `src/features/account/`（§1.4 参照）
