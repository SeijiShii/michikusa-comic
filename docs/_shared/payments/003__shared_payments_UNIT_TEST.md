# _shared/payments 単体テスト計画

> **入力**: `./001__shared_payments_SPEC.md`, `./002__shared_payments_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | createCheckout | Stripe セッション作成、payment(pending) 記録 |
| N-2 | handleWebhook（署名 OK） | status=paid 更新、機能解放トリガ |
| N-3 | getPayments | 自分の履歴のみ（owner 境界） |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | handleWebhook（署名 NG） | 不正署名 | 400、status 更新せず |
| E-2 | 冪等性 | 同イベント二重 | 1 回だけ処理 |
| E-3 | createCheckout（未認証） | withOwner | 401 |
| E-4 | amountJpy 範囲外 | DTO 検証 | 拒否（SEC-005） |

### 1.3 境界値
| ID | 対象 | 境界 |
|---|---|---|
| B-1 | amountJpy | 最小（100 円）/ 上限 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Stripe SDK | mock（署名検証は stripe.webhooks.constructEvent を mock/実ロジック） |
| db | mock / test DB |
| auth | mock owner |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 85% |
| 分岐 | 80%（署名/冪等分岐） |

## 4. 既存ユーティリティ依存
- `_shared/db` / `_shared/auth` / `_shared/types`

## 5. テスト実行環境
- Vitest + Stripe mock（webhook 署名は固定鍵で検証ロジックを通す）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
