# compose 実装計画書

> **入力**: `./001_compose_SPEC.md`, `../concept.md` §1.4 / [論点-001/002] ／ **最終更新**: 2026-06-09

## 1. 実装対象ファイル（src/features/compose/）
| ファイル | 責務 | LOC |
|---|---|---|
| `ComposeScreen.tsx` | 生成→プレビュー→編集 UI | 180 |
| `PanelCanvas.tsx` | コマ + 吹き出し + セリフの SVG/Canvas 合成（[論点-001]） | 200 |
| `useGenerate.ts` | 生成フック（ポーリング, TanStack Query, O45 進捗） | 120 |
| `SpeechEditor.tsx` | セリフ/吹き出し微修正 | 120 |
| `api/compose/generate.ts` | 生成 API（withOwner + rate limit SEC-003） | 100 |
| `api/compose/[comicId]/panels.ts` | 編集 PATCH | 60 |
| `api/compose/[comicId]/save.ts` | 保存 | 40 |

## 2. 実装 Phase 分割
- Phase 1: generate API（ai 注入 mock + rate limit + コスト積算）+ comic/panel 保存
- Phase 2: PanelCanvas 合成（[論点-001] 案 A: AI 絵柄 + アプリ吹き出し）
- Phase 3: ComposeScreen + useGenerate（O45 進捗）+ SpeechEditor 編集
- Phase 4: 解像度段階化（[論点-002]、プレビュー低）+ 実 SDK 結合

## 3. 依存関係順序
ai/helpers/storage/db → generate API → PanelCanvas → ComposeScreen/SpeechEditor

## 4-6. 影響/横断/リスク
- 最重量機能。[論点-001/002] を Phase 2/4 で確定。SEC-003 レート制限必須、コスト爆発防止。生成品質（4コマらしさ・絵柄一貫）が出力品質 NFR の核

## 7. 完了の定義
- [ ] 生成→合成→編集→保存が動作・テスト green
- [ ] SEC-003 レート制限 + コスト積算（§4.6.2）
- [ ] PanelCanvas 合成（日本語セリフ可読、[論点-001]）
- [ ] O45 進捗体験
- [ ] E2E（004）green

## 8. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature |
