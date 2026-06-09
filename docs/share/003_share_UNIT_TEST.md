# share 単体テスト計画
> 2026-06-09
## 1. テストケース
- N-1: useShareImage 合成→Blob（4コマ画像）
- N-2: stripGeoExif が共有画像に適用（SEC-002）
- N-3: navigator.share 呼び出し / 非対応フォールバック
- E-1: 他人作品 → 拒否
- B-1: navigator.share 非対応環境
## 2. Mock: helpers/navigator.share mock, Canvas jsdom
## 3. カバレッジ: 行 80%
## 4-5. 依存: helpers,storage,gallery / Vitest+jsdom
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
