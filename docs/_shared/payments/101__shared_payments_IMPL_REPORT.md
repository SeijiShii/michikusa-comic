# _shared/payments 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復31）
## 実装済（webhook ロジック, 3 テスト green）
- `webhook.ts`: mapEventToStatus / IdempotencyGuard（冪等）/ verifyOrThrow + SignatureError(400)
## 未実装（後続、Stripe SDK + 実キー = release）
- `stripe.ts` createCheckout（実 Stripe）/ `api/payments/*`（withOwner + raw body 署名検証）
## DoD
- [x] イベント→status マップ / 冪等性 / 署名検証失敗 400 テスト green
- [ ] createCheckout 実 Stripe（release）/ live キー swap（B-4）
