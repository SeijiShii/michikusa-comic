# _shared/app-shell E2E テスト計画（app smoke）
> 2026-06-09
## 1. ユーザージャーニー（smoke = 動くアプリの証明, O57）
| AS-S1 | アプリ起動 | ゲスト確立→トップ表示（0タップ撮影可） |
| AS-S2 | 主要画面遷移 | capture→compose→gallery→account→legal 全到達(O55) |
| AS-S3 | 保護 API | 匿名セッションで保護 API が 200（P4.46, 401 でない） |
## 2. 環境要件
- Chromium モバイル / ゲスト自動確立 / dev server（ローカル headless, Class A）
- AI/課金は mock/sandbox
## 3. データセットアップ
- Seed なし（起動 smoke）/ Cleanup purge
## 5. レイアウト・ビジュアル検証（O34）
- Level 1: ✅ トップ/主要画面
- Level 2: ✅ ナビ/フッタ到達(O55), 入口の「これは何？」(O41)
- Level 3: △（トップは重要画面, 任意）
## 6. KPI
- アプリ起動 + 全ルート到達 + 匿名→authed 200（P4.46）= 「動くアプリ」成立（O57）
## 7. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
