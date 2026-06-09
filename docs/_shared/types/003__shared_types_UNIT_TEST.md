# _shared/types 単体テスト計画

> **入力**: `./001__shared_types_SPEC.md`, `./002__shared_types_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 入力 | 期待 |
|---|---|---|---|
| N-1 | `ComicSchema.parse` | 有効な comic オブジェクト | success、型一致 |
| N-2 | `PhotoSchema.parse` | 位置あり/なし両方 | success（lat/lng optional） |
| N-3 | `PanelSchema.parse` | order=1..4 | success |
| N-4 | `mkOwnerId` | 文字列 | branded OwnerId 生成 |
| N-5 | `CreatePhotoInput.parse` | 有効 MIME/サイズ/caption | success |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | `PanelSchema.safeParse` | order=0 / order=5 | success:false |
| E-2 | `PaymentSchema.safeParse` | status 不正値 | success:false |
| E-3 | `CreatePaymentInput.safeParse` | amountJpy 負 / 範囲外 | success:false |
| E-4 | `SubmitFeedbackInput.safeParse` | body 長超過 | success:false |
| E-5 | `GenerateComicInput.safeParse` | photoIds 空配列 | success:false（1 以上必須） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B-1 | `CreatePhotoInput` | サイズ上限ちょうど / +1 | 上限 OK、超過 NG |
| B-2 | caption / speech / body | 最大長ちょうど / +1 | 同上 |
| B-3 | `GenerateComicInput` | photoIds 1 / 上限 N / N+1 | 1〜N OK、N+1 NG |
| B-4 | Unicode | 絵文字/結合文字を含む caption | 長さカウントが意図通り |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| 外部 | なし | 純定義モジュール、外部依存ゼロ |
| 時刻 | 固定 ISO 文字列を入力 | 再現性 |

## 3. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 90% | スキーマ定義は分岐少、高カバレッジ可能 |
| 分岐 | 80% | optional/refine 分岐 |

## 4. 既存ユーティリティ依存
- なし（zod のみ）

## 5. テスト実行環境
- フレームワーク: Vitest（concept §4.3 想定）
- 並列実行: ✅
- 実行: テストツールを実行（`npm run test` 相当）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
