# collection 実装計画書
> 入力: 001 ／ 2026-06-09
## 1. ファイル（src/features/collection/）
| `CollectionScreen.tsx` | 月次一覧 | 100 |
| `useCollections.ts` | 取得フック | 60 |
| `api/collections/index.ts` | 一覧（withOwner, 参照時集約） | 70 |
| `api/collections/[ym].ts` | 月詳細 | 40 |
## 2. Phase 分割
- Phase 1: API（参照時集約, owner 境界）
- Phase 2: CollectionScreen + useCollections
## 3. 依存順序
db/auth/gallery → api → UI
## 4-6. 影響/横断/リスク
- SEC-004 owner 境界。MVP は参照時集約（Cron は後）
## 7. DoD
- [ ] 月次一覧/詳細 動作・テスト green
- [ ] owner 境界
- [ ] E2E green
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
