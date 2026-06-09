# account 単体テスト計画
> 2026-06-09
## 1. テストケース
- N-1: アカウント情報取得（owner）
- N-2: **全データ削除（db 全行 cascade + R2 purgeOwner 両方呼ばれる, DSR）**
- N-3: 段階認証連携（linkAccount）
### 異常系
- E-1: 削除の二段確認なし → 拒否
- E-2: R2 purge 部分失敗 → 再試行（最終的に全消し, DSR 履行）
- E-3: 他人データ削除不可 / 未認証 401
### 境界
- B-1: データ 0 件 / 大量での削除
## 2. Mock: db/storage/auth mock（削除は cascade+purge の協調を spy 検証）
## 3. カバレッジ: 行 85%/分岐 80%（削除は最重要）
## 4-5. 依存: db,storage,auth / Vitest
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
