# _shared/auth E2E テスト計画（ゲスト JWT 永続化 + 連携/サインアウト）

> **入力**: `./001_REVISE_SPEC.md`, concept §1.1, 既存 capture/account E2E
> **最終更新**: 2026-06-18
> **注**: _shared/auth は cross-cutting。E2E は capture/account 経由 + 実キーは release Phase 2。

---

## 1. 変更 UC シナリオ
### UC: ゲスト継続（churn 非再現）
| ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| E1 | 初回起動（未連携） | provisionGuest → guest JWT 永続 → comic 保存 → **リロード/長時間後再訪** | 同 owner（guest sub 安定）で自分の comic が見える（orphan 化しない） |

### UC: 段階認証（O22(B)）
| ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| E2 | ゲストで作品あり | account 画面で「Google でログイン」（新規 Google） | 連携成功、デバイスのデータ引き継ぎ、guestToken クリア |
| E3 | 既存連携済み Google | 同ボタンで既存アカウント選択 | sign-in fallback で既存 owner へ切替（DB データでデバイス上書き） |

### UC: サインアウト両輪（audit step 3.10）
| ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| E4 | 連携済み（authed） | account でサインアウト | ゲストへ戻る、別 Google へ再連携可能（行き止まりにならない） |

## 2. リグレッションシナリオ
| UC | ID | 確認観点 |
|---|---|---|
| 保護 API 認可 | R1 | 匿名ゲスト（guest JWT）で自分の comic CRUD は 200、他人 owner は 403/404 |
| 未認証 | R2 | Bearer 無で保護 API は 401 |

## 3. 移行検証シナリオ
- 対象外（本番データ未発生、orphan 回収マイグレーションなし）。

## 4. 環境要件差分
| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| env | Clerk キーのみ | + `GUEST_TOKEN_SECRET` | guest JWT 署名 |
| 実 Clerk OAuth | — | Google OAuth dev 設定 | 連携往復検証（release） |

## 5. 期待 KPI
| 指標 | 目標 |
|---|---|
| churn 再現 | 0（リロード後も owner 不変） |
| 連携往復成功 | 100%（新規/既存両分岐） |

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-18 | 初版作成 | /flow:revise |
