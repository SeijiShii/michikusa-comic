# _shared/cost-tracking 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復28+31）
## 実装済（pricing + record, 7 テスト green）
- `pricing.ts`: loadPriceTable / estimateCost / checkFreeTier（80/100/120%）
- `record.ts`: recordCall（estimatedUsd 算出 + sink insert、best-effort 非ブロッキング §4.6.2）
## 未実装（後続）
- `aggregate.ts`（日次/月次集計、db）/ `alert.ts`（無料枠超過通知配線）
## DoD
- [x] estimateCost/checkFreeTier/recordCall テスト green（§4.6.2 単価 env 管理 + best-effort）
- [ ] aggregate / alert（db 集計、後続）
