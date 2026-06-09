# gallery 単体テスト計画
> 入力: 001/002 ／ 2026-06-09
## 1. テストケース
- N-1: 一覧 API（owner 自分のみ、cursor）
- N-2: エリア/月フィルタ
- N-3: 詳細（comic+panels、署名URL）
- E-1: 他人 comic → 404（SEC-004）
- E-2: 未認証 → 401
- B-1: 空ギャラリー / 大量（ページネーション）
## 2. Mock 方針
db/auth/storage mock
## 3. カバレッジ
行 80% / 分岐 70%
## 4-5. 依存/環境
_shared/db,auth,storage / Vitest
## 6. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
