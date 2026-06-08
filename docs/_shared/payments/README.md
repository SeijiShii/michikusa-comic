# payments（横断設計）

課金基盤（Stripe 単発 PWYW + Webhook 署名検証）

## このフォルダに置くドキュメント

- `001_payments_SPEC.md` — 仕様書
- `002_payments_PLAN.md` — 実装計画書
- `estimate_YYYYMMDD.md` — 横断単位見積もり

## 関連

- 概念設計: `../../concept.md` §1.3.2（優先度 3、依存: _shared/db, _shared/auth）
- 実装コード対応: §1.4 の対応表参照（横断は集約 → 分散実装になることが多い）
- 参照する機能フォルダ: §1.3 依存グラフ参照
