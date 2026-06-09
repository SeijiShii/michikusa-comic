# _shared/types 単体テストレポート

**実行日**: 2026-06-09 / vitest run

## 結果
- Test Files: 1 passed / Tests: 13 passed
- 正常系 4（entities/branded）+ 異常系 5（order/status/amount/body/photoIds）+ 境界 4（枚数/長さ/Unicode）
- カバレッジ目標 90%（スキーマ定義中心、主要分岐網羅）

## 備考
- 003_UNIT_TEST.md の計画ケース（N-1..5/E-1..5/B-1..4）を実装・全 green
