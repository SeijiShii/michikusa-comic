# capture 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（via /flow:auto 反復32, Phase 3 フロント着手）
## 実装済（UI コンポーネント, 4 RTL テスト green）
- `CaptureScreen.tsx`: 写真選択 + ひとこと + 検証(SEC-005) + やさしいエラー(O38) + 入口リード文(O41)
- design-system トークン適用（src/styles/tokens.css）
- フロントツールチェーン確立: React + Vite plugin + @testing-library/react + happy-dom（jsdom の CSS パーサ ESM 問題回避）
## 未実装（後続、backend 統合）
- `usePhotoUpload.ts`（presign→put→保存、storage/api 連携）/ `offlineQueue.ts`（IndexedDB）/ api ハンドラ
## DoD
- [x] CaptureScreen UI + 検証 + エラー表示 + O41 リード文（4 RTL テスト）
- [ ] アップロードフック/API（storage/auth/db 統合、後続）/ オフライン下書き
