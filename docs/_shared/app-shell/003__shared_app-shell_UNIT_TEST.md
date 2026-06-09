# _shared/app-shell 単体テスト計画
> 2026-06-09
## 1. テストケース
- N-1: AppProviders が Auth/Query/Theme を提供
- N-2: router が全ルートを解決（capture/compose/gallery/collection/share/export/feedback/account/legal）
- N-3: API ハンドラ層が withOwner でラップ（401/200）
- E-1: 不明ルート → 404
- E-2: グローバルエラーバウンダリ
- B-1: オフライン fallback（PWA）
## 2. Mock: 全 feature を mock、jsdom
## 3. カバレッジ: 行 70%（合成中心、ロジック少）
## 4-5. 依存: 全モジュール / Vitest+jsdom
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
