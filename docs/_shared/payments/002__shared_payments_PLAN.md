# _shared/payments 実装計画書

> **入力**: `./001__shared_payments_SPEC.md`, `../../concept.md` charter §1 / §6
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/services/payments/ + api/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/payments/stripe.ts` | Stripe クライアント + createCheckout | stripe, db | 90 |
| `src/services/payments/webhook.ts` | handleWebhook（署名検証 + status 更新 + 冪等） | stripe, db | 100 |
| `api/payments/checkout.ts` | Checkout 作成（withOwner 保護） | stripe, auth | 50 |
| `api/payments/webhook.ts` | Webhook 受信（raw body、署名検証） | webhook | 40 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: createCheckout（interface + mock Stripe）
### Phase 2: handleWebhook（署名検証 + status 更新 + 冪等性）
### Phase 3: API 配線（withOwner 保護 checkout、raw body webhook）

## 3. 依存関係順序
```
db/auth → stripe → webhook → api
```

## 4. 既存ファイルへの影響
- なし（基盤）

## 5. 横断への追加・変更
- export/compose/gallery が課金導線。`.env.example` に STRIPE_* 追加

## 6. リスク・注意点
- **Webhook 署名検証必須**（偽装防止）。raw body 取得に注意（Vercel Functions の body parser 設定）
- 冪等性（stripe_ref uniq + イベント ID）で二重処理防止
- test キー → live キーへの swap は release（実課金 B-4、charter §1）
- 月固定費ゼロ維持（preferences §4.5）

## 7. 完了の定義（DoD）
- [ ] createCheckout + handleWebhook（署名検証）+ getPayments 実装・テスト green
- [ ] 署名検証失敗 400 / 冪等性テスト
- [ ] `.env.example` に STRIPE_* 追加
- [ ] E2E: export 側で課金フロー（test モード）をカバー

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
