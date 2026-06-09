# export 単体テスト計画
> 2026-06-09
## 1. テストケース
- N-1: checkout 作成（payments）
- N-2: 課金完了後の高画質 render
- N-3: O43 価格明示（金額+対価が CTA 前に表示）
- E-1: 未課金で render → 拒否
- E-2: 他人作品 → 403 / 未認証 → 401
- B-1: 投げ銭/買い切りの kind 分岐
## 2. Mock: payments/ai/storage mock
## 3. カバレッジ: 行 80%/分岐 75%
## 4-5. 依存: payments,ai,storage,gallery / Vitest
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
