# feedback 単体テスト計画
> 2026-06-09
## 1. テストケース
- N-1: リアクション送信（feedbacks 行）
- N-2: バグ報告（自動コンテキスト付与）
- N-3: scrubPII 適用（送信前+受信時, SEC-002）
- E-1: PII 含む本文 → マスク確認
- E-2: レート制限超過 → 拒否
- B-1: body 空/最大長
## 2. Mock: helpers/db mock
## 3. カバレッジ: 行 80%
## 4-5. 依存: helpers,db,auth / Vitest
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
