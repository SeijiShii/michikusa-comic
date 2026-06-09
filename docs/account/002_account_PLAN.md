# account 実装計画書
> 入力: 001, concept §3.X SEC-001 / O54 ／ 2026-06-09
## 1. ファイル（src/features/account/）
| `AccountScreen.tsx` | 設定/連携/削除/AI同意 UI | 130 |
| `useAccount.ts` | 取得/連携/削除フック | 80 |
| `api/account/index.ts` | アカウント情報（withOwner） | 40 |
| `api/account/delete.ts` | **全データ削除（db cascade + R2 purgeOwner 協調）** | 90 |
| `api/account/link.ts` | 段階認証連携（auth） | 40 |
| `cron/purge-inactive.ts` | 非アクティブ匿名データ自動 purge | 60 |
## 2. Phase 分割
- Phase 1: delete API（**db cascade + R2 purge 協調**, 二段確認, DSR 非交渉）+ テスト
- Phase 2: AccountScreen + link（段階認証）+ AI 同意
- Phase 3: 自動 purge cron（保持期限）
## 3. 依存順序
db/storage/auth → delete/link API → AccountScreen → cron
## 4-6. 影響/横断/リスク
- **SEC-001 Critical**: 削除が db+R2 両方を確実に消す（片方失敗の整合性は結合テスト必須）。legal の SEC-001 文言と整合。O54: 運用者ツールは作らない
## 7. DoD
- [ ] **セルフ全データ削除（db cascade + R2 purge）動作・結合テスト green（DSR 非交渉）**
- [ ] 段階認証連携 / AI 同意
- [ ] 自動 purge cron
- [ ] legal SEC-001 文言と整合
- [ ] E2E green（削除フロー）
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
