# _shared/ai 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復30）
## 実装済（prompts/plan, 2 テスト green）
- `prompts.ts`: FOUR_PANEL_STRUCTURE（起承転結の型 = 差別化ドメイン知識）+ STYLE_GUIDE
- `plan.ts`: buildComicPlan（写真理解+ひとこと→4コマ構成案、セリフ案）
## 未実装（後続、SDK mock + 実キー）
- `vision.ts`（OpenAI）/ `imagegen.ts`（Gemini）/ `ratelimit.ts`（SEC-003）/ フォールバック
## DoD
- [x] buildComicPlan（4コマの型、差別化）テスト green
- [ ] Vision/Gemini 実 SDK（release 連携）/ レート制限（Upstash mock 後続）
