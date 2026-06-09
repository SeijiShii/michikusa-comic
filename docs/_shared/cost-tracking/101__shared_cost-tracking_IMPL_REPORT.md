# _shared/cost-tracking 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（via /flow:auto 反復28）
## 実装済（pricing, 4 テスト green）
- `pricing.ts`: loadPriceTable（COST_ env）/ estimateCost / checkFreeTier（80/100/120%）
## 未実装（後続、db 実装後）
- `record.ts` recordCall（ai_cost_logs 書き込み）/ `aggregate.ts` / `alert.ts`
## DoD
- [x] estimateCost / checkFreeTier + 境界テスト green（§4.6.2 単価 env 管理）
- [ ] recordCall / aggregate（db 依存、後続）
