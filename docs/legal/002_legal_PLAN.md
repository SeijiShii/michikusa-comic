# legal 実装計画書

> **入力**: `./001_legal_SPEC.md`, `../concept.md` §9 ／ **最終更新**: 2026-06-09

## 1. 実装対象ファイル（src/features/legal/ + src/routes/legal/）
| ファイル | 責務 | LOC |
|---|---|---|
| `routes/legal/privacy.tsx` | プラポリ本文（SEC-001 DSR 文言） | 80 |
| `routes/legal/terms.tsx` | 利用規約（生成物権利帰属） | 70 |
| `routes/legal/specified-commercial-transactions.tsx` | 特商法表記 | 50 |
| `components/LegalFooter.tsx` | フッタリンク（全画面、O55） | 30 |
| `components/ConsentBanner.tsx` | 初回 AI 送信同意 | 50 |

## 2. 実装 Phase 分割
- Phase 1: 静的ページ本文（design-system 準拠）
- Phase 2: フッタ導線（O55 到達性）+ ConsentBanner

## 3. 依存関係順序
ページ本文 → フッタ/同意

## 4-6. 影響/横断/リスク
- 全画面にフッタを配線（O55、orphaned page 禁止）。SEC-001 文言を account セルフ削除と整合。法務文面は人間最終確認（§9.3）

## 7. 完了の定義
- [ ] 3 ページ + フッタ導線 + ConsentBanner
- [ ] O55: 全ルートからフッタ到達可
- [ ] SEC-001 DSR 文言が account セルフ削除と整合
- [ ] E2E（004）green

## 8. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature |
