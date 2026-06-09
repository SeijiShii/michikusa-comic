# capture 単体テスト計画

> **入力**: `./001_capture_SPEC.md`, `./002_capture_PLAN.md` ／ **最終更新**: 2026-06-09

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | usePhotoUpload | presign→put→photo 作成の流れ |
| N-2 | photo 作成 API | owner_id 付きで保存、EXIF メタ反映 |
### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | 不正ファイル | MIME/サイズ NG | 検証エラー（SEC-005） |
| E-2 | presign（他人キー） | — | 拒否（SEC-004） |
| E-3 | 未認証 | — | 401 |
| E-4 | アップロード失敗 | ネットワーク | リトライ + 下書き保持 |
### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | 枚数 | 1 / 上限 / 上限+1 |
| B-2 | ひとこと | 最大長 / 空 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| storage/auth/db | mock |
| File / IndexedDB | jsdom + fake-indexeddb |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存依存
- _shared/storage, auth, db, helpers, types

## 5. 実行環境
- Vitest + jsdom + fake-indexeddb

## 6. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature |
