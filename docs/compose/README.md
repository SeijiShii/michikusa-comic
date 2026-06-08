# compose

AI 4 コマ生成（コマ割り提案 + セリフ案 + 絵柄 stylize）+ アプリ側セリフ/吹き出し合成 + 微修正 + 保存

## このフォルダに置くドキュメント

- `001_compose_SPEC.md` — 仕様書（`/flow:feature` で生成）
- `002_compose_PLAN.md` — 実装計画書
- `003_compose_UNIT_TEST.md` — 単体テスト計画
- `004_compose_E2E_TEST.md` — E2E テスト計画
- `estimate_YYYYMMDD.md` — 機能単位見積もり（`/flow:estimate` で生成）

## 関連

- 概念設計: `../concept.md` §1.3.1（優先度 4、依存: _shared/ai, _shared/storage, _shared/db, capture）
- 全体見積: `../estimates/`
- 実装コード対応: `src/features/compose/`（§1.4 参照）
