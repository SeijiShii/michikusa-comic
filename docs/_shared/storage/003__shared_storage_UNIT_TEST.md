# _shared/storage 単体テスト計画

> **入力**: `./001__shared_storage_SPEC.md`, `./002__shared_storage_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | keys.build | `photos/{ownerId}/{uuid}.jpg` 等の正しい path |
| N-2 | presignUpload | 所有者キー配下の署名 URL 発行 |
| N-3 | purgeOwner | 所有者の全オブジェクト list+delete（DSR） |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | presign（他人キー） | ownerId ≠ session | 拒否（SEC-004） |
| E-2 | purge 部分失敗 | 一部 delete エラー | 再試行 + ログ、最終的に全消し |

### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | purgeOwner | オブジェクト 0 件 / 大量（ページネーション） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| R2 / S3 SDK | aws-sdk-client-mock |
| auth セッション | mock owner |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 分岐 | 75% |

## 4. 既存ユーティリティ依存
- `_shared/types` / `_shared/auth`（所有権）

## 5. テスト実行環境
- Vitest + aws-sdk-client-mock

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
