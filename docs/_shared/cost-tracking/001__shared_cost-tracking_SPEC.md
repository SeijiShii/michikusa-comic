# _shared/cost-tracking 仕様書（横断基盤）

> **役割**: 外部 API/サービス呼び出しのログ積算 + `.env` 単価管理 + 概算コスト算出 + 無料枠超過アラート（concept §4.6.2）
> **タグ**: cross-cutting / foundation / analytics
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md` §4.6.2 / §4.6.3, `../db`, `../types`
> **target_type**: cross-cutting（E2E スキップ）

---

## 1. 提供インターフェース
| 関数 | 責務 |
|---|---|
| `recordCall({ ownerId?, provider, metric, quantity })` | 呼び出しを ai_cost_logs に積算記録 + `.env` 単価で estimatedUsd 算出 |
| `estimateCost(provider, metric, quantity)` | `.env` 単価 × 数量 → USD 概算 |
| `aggregate({ period, by })` | 日次/月次・機能別/プロバイダ別の集計 |
| `checkFreeTier()` | 無料枠 80/100/120% 判定 → アラート発火（通知 or ログ） |

## 2. 単価管理（.env、ハードコード禁止、§4.6.2）
```
COST_GEMINI_IMAGE_PER_GEN=<USD>          # 要確認
COST_OPENAI_GPT4O_MINI_PER_1K_INPUT=0.00015
COST_OPENAI_GPT4O_MINI_PER_1K_OUTPUT=0.0006
COST_R2_STORAGE_PER_GB_PER_MONTH=0.015
COST_R2_CLASS_A_PER_1K_OPS=0.0045
```
- 単価変更日も記録（過去ログ再計算の精度、`unit_price_version`）

## 3. データモデル
- `ai_cost_logs`（_shared/db）: provider, metric, quantity, unit_price_version, estimated_usd, created_at

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| 単価未設定 | `.env` に該当単価が無い → 警告ログ + estimatedUsd=null（記録は継続） |
| 集計 | 期間/集計軸の妥当性 |
| アラート | 閾値超過で 1 回だけ発火（多重通知防止） |

## 5. NFR + 連携
- **NFR**: 記録は呼び出しをブロックしない（非同期/best-effort）。精度は月次で外部請求と突合（誤差 >10% で単価再調査、§4.6.2）
- **連携**: ai（記録）/ storage（容量記録）/ db（ai_cost_logs）/ 運用（アラート）

## 6. タグ別追加項目（analytics）
- イベント: provider/metric/quantity/estimatedUsd。外部 API 呼び出しを能動的に積算（外部請求は遅延あり、§4.6.2）

## 7. スコープ外
- 収益指標（§4.6.4、本 PJ 不要）/ 課金（payments）/ 実際の通知配信基盤（最小: ログ/メール）

## 8. 未決事項
- 現時点で論点なし（2026-06-09）。アラート配信チャネル（ログ/メール/push）は運用開始時に確定

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復12） |
