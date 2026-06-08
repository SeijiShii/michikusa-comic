# app-shell（横断設計）

アプリ合成レイヤ（合成ルート + UI↔data 配線 + API ルートハンドラ層 + Clerk セッション確立 + PWA/deploy scaffold）

## このフォルダに置くドキュメント

- `001_app-shell_SPEC.md` — 仕様書
- `002_app-shell_PLAN.md` — 実装計画書
- `estimate_YYYYMMDD.md` — 横断単位見積もり

## 関連

- 概念設計: `../../concept.md` §1.3.2（優先度 9、依存: 全 feature + _shared 全部）
- 実装コード対応: §1.4 の対応表参照（横断は集約 → 分散実装になることが多い）
- 参照する機能フォルダ: §1.3 依存グラフ参照
