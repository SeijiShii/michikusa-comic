# _shared/auth 単体テスト計画（ゲスト JWT 永続化 + 連携/サインアウト）

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, 既存 `guestSession.test.ts`/`owner.test.ts`
> **最終更新**: 2026-06-18

---

## 1. 追加テストケース
### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| U1 | `signGuestToken`/`verifyGuestToken` 往復 | sub=`guest_abc` | verify が同 sub を返す |
| U2 | `provisionGuest` | injectable signer+DB | DB 匿名行 upsert + `{guestToken}` 返却、**Clerk createUser 未呼び出し** |
| U3 | `resolveOwner` (guest JWT) | iss=`michikusa-guest` の Bearer | sub を OwnerId として返す |
| U4 | `resolveOwner` (Clerk JWT) | iss=Clerk の Bearer | Clerk userId を返す |
| U5 | `guestStore` 再利用 | 既存 token あり | fetch せず no-op で同 token |
| U6 | `linkAccount` 新規連携 | createExternalAccount 成功 | 連携完了 + `clearGuestToken` 呼び出し |
| U7 | `signOut` | authed 状態 | Clerk セッション破棄 → ゲストへ |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| U8 | `verifyGuestToken` 改竄 | 署名不正 token | throw（401 化） |
| U9 | `verifyGuestToken` 期限切れ | exp 過去 | throw |
| U10 | `verifyGuestToken` iss 不一致 | iss=他サービス | throw（cross-service token 拒否） |
| U11 | `resolveOwner` 無 Bearer | header なし | null（requireOwner は 401） |
| U12 | `linkAccount` 既存アカウント | `external_account_exists` 系 error | sign-in fallback 経路に分岐 |
| U13 | `linkAccount` 二重リダイレクト | fallback フラグ既セット | ループ防止（1 回だけ fallback） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| U14 | guest sub 形式 | `guest_<uuid>` パターン | 形式一致のみ owner 採用 |

## 2. 修正テストケース
| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| M1 | `guestSession.test.ts` | ticket 発行（createAnonymousUser+createSignInToken）検証 | provisionGuest（guest JWT 発行・Clerk createUser 非呼び出し）検証 | ticket 方式撤去 |
| M2 | 「匿名→authed 200」結合 | ticket userId で resolver | guest JWT sub で resolveOwner→requireOwner が 401 でない | 方式変更 |

## 3. 削除テストケース
| ID | 対象 | 削除理由 |
|---|---|---|
| D1 | `createSignInToken` 呼び出し検証 | ticket 方式撤去で無効 |

## 4. リグレッション強化
- `owner.test.ts` の `withOwner`/`requireOwner` 401 挙動は維持（IF 不変）。
- 全 feature API が resolver 差し替え後も owner_id を正しく受け取ることを既存テストで担保。

## 5. Mock 方針差分
| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| Clerk backend | `ClerkBackend`(createAnonymousUser/createSignInToken) | injectable signer（HS256）+ injectable Clerk client（createExternalAccount） | guest を Clerk 非セッション化 |
| storage | — | injectable localStorage mock | client 永続テスト |

## 6. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承 |
| 分岐 | 75% | 連携分岐（新規/fallback）を網羅 |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-18 | 初版作成 | /flow:revise |
