# feedback 実装計画書
> 入力: 001 ／ 2026-06-09
## 1. ファイル（src/features/feedback/）
| `FeedbackWidget.tsx` | 👍/👎 + バグ報告（全画面 1タップ） | 110 |
| `useFeedback.ts` | 送信（自動コンテキスト+scrubPII） | 70 |
| `api/feedback/index.ts` | 受信（scrub再確認, rate limit） | 70 |
## 2. Phase 分割
- Phase 1: API（scrubPII, rate limit）+ useFeedback
- Phase 2: FeedbackWidget（全画面配置）+ 任意通知/hub 転送スタブ
## 3. 依存順序
helpers(scrubPII)/db/auth → api → useFeedback → FeedbackWidget
## 4-6. 影響/横断/リスク
- SEC-002 PII scrub 必須（送信前+受信時）。Q12.7(2) 通知（運用者→ユーザー）と逆向き（混同しない）
## 7. DoD
- [ ] リアクション+バグ報告送信 動作・テスト green
- [ ] PII scrub（SEC-002）二重
- [ ] 全画面からウィジェット到達
- [ ] E2E green
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
