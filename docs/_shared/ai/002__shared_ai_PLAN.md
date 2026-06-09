# _shared/ai 実装計画書

> **入力**: `./001__shared_ai_SPEC.md`, `../../concept.md` §6 / §3.X SEC-003 / §4.6.2
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/services/ai/ + api/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/ai/vision.ts` | OpenAI Vision クライアント（understandPhoto、store=false） | openai, cost-tracking | 90 |
| `src/services/ai/imagegen.ts` | Gemini 2.5 Flash Image クライアント（generatePanels） | @google/genai, cost-tracking | 110 |
| `src/services/ai/prompts.ts` | 4 コマ構成プロンプト/few-shot（ドメイン知識、差別化） | — | 90 |
| `src/services/ai/plan.ts` | buildComicPlan（understanding+caption→構成案） | prompts | 70 |
| `src/services/ai/ratelimit.ts` | レート制限（Upstash Ratelimit、SEC-003） | @upstash/ratelimit | 50 |
| `src/services/ai/index.ts` | interface re-export + フォールバック | 上記 | 40 |

> **可逆性（O35）**: AI クライアントは interface（`PhotoUnderstander`/`PanelGenerator`）+ mock 実装 → 実 SDK 注入の順（Phase 分割）

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: interface + prompts + plan（純ロジック、mock 注入でテスト）
### Phase 2: ratelimit（SEC-003）+ コスト積算配線（cost-tracking）
### Phase 3: 実 SDK 注入（OpenAI Vision / Gemini）+ フォールバック + 結合

## 3. 依存関係順序
```
types/cost-tracking → prompts → plan → vision/imagegen → ratelimit/フォールバック
```

## 4. 既存ファイルへの影響
- なし（基盤）

## 5. 横断への追加・変更
- compose が understand/buildPlan/generate を呼ぶ。cost-tracking に積算

## 6. リスク・注意点
- **コスト**: Gemini 画像生成が支配的（§4.4）。[論点-002] 解像度段階化を Phase 2 で配線、レート制限必須（SEC-003）
- 画像生成の絵柄一貫性が不安定なら参照画像/プロンプト調整（出力品質）
- API キーは server side（§6）、Vision は store=false（学習拒否）

## 7. 完了の定義（DoD）
- [ ] understand/buildPlan/generate が interface + mock でテスト green
- [ ] ratelimit（SEC-003）+ コスト積算（§4.6.2）配線・テスト
- [ ] 実 SDK 注入 + フォールバック（ダウン/レート超過）結合
- [ ] E2E: compose 側でカバー（生成 UX）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
