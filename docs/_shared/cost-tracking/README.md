# cost-tracking（横断設計）

外部 API コスト積算（呼び出しログ積算 + .env 単価 + 概算コスト + 無料枠アラート）

## このフォルダに置くドキュメント

- `001_cost-tracking_SPEC.md` — 仕様書
- `002_cost-tracking_PLAN.md` — 実装計画書
- `estimate_YYYYMMDD.md` — 横断単位見積もり

## 関連

- 概念設計: `../../concept.md` §1.3.2（優先度 2、依存: _shared/db）
- 実装コード対応: §1.4 の対応表参照（横断は集約 → 分散実装になることが多い）
- 参照する機能フォルダ: §1.3 依存グラフ参照
