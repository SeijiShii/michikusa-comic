# export 実装計画書
> 入力: 001 ／ 2026-06-09
## 1. ファイル（src/features/export/）
| `ExportScreen.tsx` | 価格明示(O43)+課金導線+書き出し | 130 |
| `useExport.ts` | checkout→課金確認→高画質書き出し | 100 |
| `api/export/[comicId]/checkout.ts` | Stripe checkout（payments, withOwner） | 50 |
| `api/export/[comicId]/render.ts` | 高画質再生成+R2（課金確認後） | 80 |
## 2. Phase 分割
- Phase 1: checkout API（payments 連携）+ ExportScreen（O43 価格明示）
- Phase 2: render（高解像度, [論点-002]）+ 課金確認ゲート
## 3. 依存順序
payments/ai/storage/gallery → checkout → ExportScreen → render
## 4-6. 影響/横断/リスク
- O43 価格透明性（金額+対価を CTA 前）。課金確認後のみ高画質（不正回避）。[論点-002] コスト
## 7. DoD
- [ ] 価格明示(O43)+課金→高画質書き出し 動作・テスト green
- [ ] 課金確認ゲート（payments Webhook）
- [ ] E2E green（test モード課金）
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
