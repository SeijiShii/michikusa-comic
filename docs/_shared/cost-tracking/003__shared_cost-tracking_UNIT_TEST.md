# _shared/cost-tracking 単体テスト計画

> **入力**: `./001__shared_cost-tracking_SPEC.md`, `./002__shared_cost-tracking_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | estimateCost | 単価 × 数量 → 正しい USD |
| N-2 | recordCall | ai_cost_logs に行追加 + estimatedUsd 算出 |
| N-3 | aggregate | 日次/月次・プロバイダ別集計が正しい |
| N-4 | checkFreeTier | 80/100/120% で正しくアラート判定 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | 単価未設定 | `.env` に該当キー無し | 警告 + estimatedUsd=null、記録継続 |
| E-2 | record 失敗 | DB エラー | best-effort（サービス継続、例外を握る） |
| E-3 | アラート多重 | 同閾値を複数回超過 | 1 回だけ発火 |

### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | checkFreeTier | 79%/80%/100%/120% 境界 |
| B-2 | quantity | 0 / 大量 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| db | mock / test DB |
| `.env` 単価 | テスト用固定値注入 |
| 時刻 | 固定（期間集計） |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 85% |
| 分岐 | 80%（閾値分岐） |

## 4. 既存ユーティリティ依存
- `_shared/db` / `_shared/types`

## 5. テスト実行環境
- Vitest + test DB / mock

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
