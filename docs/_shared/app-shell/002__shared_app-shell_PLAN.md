# _shared/app-shell 実装計画書
> 入力: 001, concept §1.3.2 / O57/O36/O37 ／ 2026-06-09
## 1. ファイル（src/ root + public/）
| `src/main.tsx` | entry, providers 合成 | 50 |
| `src/App.tsx` | router + layout + フッタ(O55) | 100 |
| `src/routes/*` | 全 feature 画面の配線 | 120 |
| `src/components/AppProviders.tsx` | Auth/Query/Theme provider | 60 |
| `api/*` | 全 feature API ハンドラを withOwner 統一公開 | 80 |
| `public/manifest.json` + sw + icons | PWA scaffold（ブランドマーク） | 40 |
| `scripts/dev.sh` / `stop.sh` | ローカル launcher（O36） | 60 |
## 2. 実装 Phase 分割（Phase 3.5 app bootstrap, O35/O36/O37）
- Phase 1: AppProviders + router + 合成ルート（全画面配線, mock data で起動）
- Phase 2: API ハンドラ層（全 feature api を withOwner 統一）+ Clerk セッション確立（P4.46 実 SDK）
- Phase 3: PWA scaffold（manifest/sw/icons）+ scripts/dev.sh + smoke
## 3. 依存順序
全 feature + 全 _shared → app-shell（最後）
## 4-6. 影響/横断/リスク
- **O57: これが無いと release で「動くアプリが無い」が露見**。全部品を配線。P4.46 ゲスト本番経路をここで確立。SDK install + glue は本 Phase（O35）
## 7. DoD（MVP, O36/O37）
- [ ] `bash scripts/dev.sh` で起動 + smoke green（O36）
- [ ] ゲスト確立 → 即撮影（0 タップ）成立
- [ ] 全ルート到達（O55）+ フッタ法務導線
- [ ] PWA インストール可（manifest/icons）
- [ ] PR で CI green（O37、既存 ci.yml）
- [ ] smoke E2E（004）green
## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
