# _shared/helpers 実装レポート（一部実装）

**実装日**: 2026-06-09 / **実行**: /flow:tdd（via /flow:auto 反復27、Phase 3）

## 実装済（純関数、10 テスト green + typecheck PASS）
- `date.ts` formatYearMonth
- `privacy.ts` scrubPII（メール/電話/位置マスク、SEC-002）
- `area.ts` resolveArea（ローカル簡易テーブル、外部逆ジオなし）
- `validation.ts` validateImageFile / validatePhotoCount（SEC-005）

## 未実装（後続、jsdom+canvas + ライブラリ要）
- `image.ts` extractExif / stripGeoExif / resizeImage / compositePanels（[論点-001] 依存）
  - 必要: vitest jsdom 環境 + exifr / node-canvas、compositePanels は design 確定後

## DoD 充足
- [x] 純関数（date/privacy/area/validation）実装・テスト green
- [ ] 画像処理関数（image.ts）— 後続反復で実装
- [x] scrubPII PII 除去（SEC-002）
- [ ] stripGeoExif（image.ts に含む、後続）
