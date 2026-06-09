# share 実装計画書
> 入力: 001 ／ 2026-06-09
## 1. ファイル（src/features/share/）
| `ShareButton.tsx` | シェア導線（navigator.share/コピー） | 80 |
| `useShareImage.ts` | 合成→Blob→共有（helpers.compositePanels, stripGeoExif） | 90 |
| `ShareNotice.tsx` | 注意喚起（[論点-003]） | 40 |
| `api/share/og.ts` | OG カード書き出し保存（任意, withOwner） | 50 |
## 2. Phase 分割
- Phase 1: useShareImage（合成+strip, mock）+ ShareButton
- Phase 2: ShareNotice（[論点-003]）+ OG（任意）
## 3. 依存順序
helpers/storage/gallery → useShareImage → ShareButton/ShareNotice
## 4-6. 影響/横断/リスク
- SEC-002 位置情報除去必須（共有経路で必ず strip）。charter §2.2 強制シェアなし
## 7. DoD
- [ ] 合成→共有/ダウンロード動作・テスト green
- [ ] stripGeoExif 必須通過（SEC-002）
- [ ] 注意喚起（[論点-003]）
- [ ] E2E green
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
