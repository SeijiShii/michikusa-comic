# _shared/helpers 単体テスト計画

> **入力**: `./001__shared_helpers_SPEC.md`, `./002__shared_helpers_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | formatYearMonth | Date → 'YYYY-MM' |
| N-2 | extractExif | EXIF 付き画像 → takenAt/lat/lng |
| N-3 | stripGeoExif | 位置 EXIF が除去される（SEC-002） |
| N-4 | validateImageFile | 有効 jpeg/png/webp → ok |
| N-5 | scrubPII | メール/電話/位置文字列がマスクされる |
| N-6 | compositePanels | 4 コマ + 吹き出し → 合成画像（サイズ確認） |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | validateImageFile | 不正 MIME / サイズ超過 / 破損 | ok:false + error |
| E-2 | extractExif | EXIF 無し/破損 | 空 {} を返す（throw しない） |
| E-3 | resolveArea | 座標不正 | 「エリア未設定」 |

### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | resizeImage | maxPx ちょうど / 極小 / 極大 |
| B-2 | scrubPII | PII 無しテキストは無変更 / 複数 PII |
| B-3 | validateImageFile | サイズ上限ちょうど / +1 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Canvas / Image API | jsdom + canvas mock（node-canvas） |
| EXIF | フィクスチャ画像（位置あり/なし/破損） |
| 時刻 | 固定注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 85% |
| 分岐 | 75%（検証分岐多） |

## 4. 既存ユーティリティ依存
- `_shared/types`（DTO 制約）

## 5. テスト実行環境
- Vitest + jsdom（画像処理） + フィクスチャ画像

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
