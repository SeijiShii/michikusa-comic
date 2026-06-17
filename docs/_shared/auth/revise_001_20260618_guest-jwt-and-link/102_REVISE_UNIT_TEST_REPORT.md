# 単体テストレポート: _shared/auth revise_001

## 実施日時
2026-06-18 08:18 (JST)

## テスト実行環境
- Node + Vitest 2.1.x
- happy-dom（AccountAuth は @testing-library/react）

## テスト結果（新規分）
| # | テストケース | ファイル | 結果 |
|---|---|---|---|
| U1 | sign→verify 往復 | guestToken.test.ts | ✅ |
| U8 | 改竄/別 secret 検出 | guestToken.test.ts | ✅ |
| U9 | 期限切れ | guestToken.test.ts | ✅ |
| U10 | iss 不一致拒否 | guestToken.test.ts | ✅ |
| U2 | provisionGuest（Clerk createUser 非呼び出し） | guestSession.test.ts | ✅ |
| M2 | guest sub → authed owner（401 でない） | guestSession.test.ts | ✅ |
| D1 | provision ごと新規 sub | guestSession.test.ts | ✅ |
| U3 | guest JWT → sub | resolveOwner.test.ts | ✅ |
| U4 | Clerk JWT → userId | resolveOwner.test.ts | ✅ |
| U11 | Bearer 無 → null | resolveOwner.test.ts | ✅ |
| U5 | 既存 token 再利用 no-op | guestStore.test.ts | ✅ |
| U6 | 連携成功 → guest token クリア | linkAccount.test.ts | ✅ |
| U12 | 既存アカウント → sign-in fallback | linkAccount.test.ts | ✅ |
| U13 | 二重リダイレクト抑止 loop-stop | linkAccount.test.ts | ✅ |
| U7 | signOut → 新ゲストへ | signOut.test.ts | ✅ |
| — | AccountAuth 描画/onClick × 4 | AccountAuth.test.tsx | ✅ |

## サマリー
| 項目 | 値 |
|---|---|
| 既存テスト | 78 |
| 追加テスト | 30 |
| 合計 | 108 |
| 成功 | 108 |
| 失敗 | 0 |
| 成功率 | 100% |

## 備考
- 実 Clerk SDK 結合（createExternalAccount/authenticateWithRedirect の binding、匿名→authed 200 の実環境検証）は injectable 境界として release Phase 2（P4.46 DoD）。本 unit はロジック（churn 防止・iss 振り分け・連携分岐・両輪）を網羅。
