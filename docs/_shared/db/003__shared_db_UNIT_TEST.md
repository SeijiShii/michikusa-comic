# _shared/db 単体テスト計画

> **入力**: `./001__shared_db_SPEC.md`, `./002__shared_db_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | schema 型 | types の infer 型と構造一致（型レベル + サンプル insert） |
| N-2 | マイグレーション適用 | 全テーブル + index + 制約が作成される |
| N-3 | cascade 削除 | comic 削除で panels が消える / owner 全削除で全行消える（DSR） |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | uniq(comic_id, order) | 同 comic で order 重複 insert | 一意制約違反 |
| E-2 | uniq(stripe_ref) | 同 stripe_ref 重複 | 違反 |
| E-3 | FK | 親不在の panel insert | FK 違反 |
| E-4 | 所有権規約 | owner_id 無しのリポジトリ呼び出し（型/lint で防止） | コンパイルエラー or 実行時拒否 |

### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | panel order | 1 / 4 OK、0 / 5 はアプリ層 + check 制約で拒否 |
| B-2 | jsonb bubble_layout | 空 / 大きい配列 |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| DB | test DB（Neon dev ブランチ or pglite/インメモリ Postgres） | スキーマ・制約の実検証が必要 |
| 時刻 | 固定注入 | 再現性 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80%（スキーマ定義 + マイグレーション + cascade） |
| 分岐 | 70% |

## 4. 既存ユーティリティ依存
- `_shared/types`（行型）

## 5. テスト実行環境
- Vitest + test DB（pglite 推奨でローカル高速、または Neon dev ブランチ）
- 並列: テスト DB 分離に注意

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
