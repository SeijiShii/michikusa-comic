# gallery E2E テスト計画
> 入力: 001, concept §1.1 ／ 2026-06-09
## 1. ジャーニー
| UC2-S1 | ギャラリーを開く | 時系列で作品一覧表示 |
| UC2-S2 | エリア/月で絞り込み | フィルタ反映 |
| UC2-S3 | 作品をタップ | 詳細表示 |
## 2. 環境要件
Chromium モバイル / ゲスト認証 / seed 作品数件
## 3. データセットアップ
Seed: comics 数件 / Cleanup: purge
## 5. レイアウト・ビジュアル検証（O34）
- Level 1: ✅ GalleryScreen/ComicDetail
- Level 2: ✅ 作品が主役、グリッド配置、フィルタ UI
- Level 3: ❌
## 6. KPI
成功率 100%
## 7. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
