# _shared/app-shell 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復35）
## 実装済（App 合成 + smoke, 3 RTL テスト green）
- `App.tsx`: 合成ルート（最小 view router）+ header nav + LegalFooter（O55 全画面導線）+ 入口リード文（O41）
- `LegalFooter.tsx`: 法務3ページ導線（O55 orphaned page 防止）
- smoke: 起動 / 画面遷移 / 法務ページ到達（O57 動くアプリの証明）
## 未実装（後続 + release）
- 実 feature 画面の配線（hooks/data、SDK 統合後）/ API ルートハンドラ層（withOwner 統一）/ Clerk セッション確立（P4.46 実 SDK）/ PWA scaffold（manifest/icons）/ deploy
## DoD
- [x] 合成ルート + ルーティング + O55 フッタ + O41 入口（3 RTL smoke）
- [ ] 実 data 配線 + API ハンドラ + Clerk 確立（P4.46）+ PWA + deploy（release）
