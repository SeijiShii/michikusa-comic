# _shared/auth 変更計画書（ゲスト JWT 永続化 + 連携/サインアウト）

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §1.4, scaffold §1.6/§1.7
> **最終更新**: 2026-06-18

---

## 1. 既存ファイル変更一覧
| ファイル | 変更内容 | リスク | 関連 § |
|---|---|---|---|
| `src/services/auth/guestSession.ts` | ticket 方式（per-call createAnonymousUser+ticket）を撤去 → guest JWT 方式（`provisionGuest`）へ | 低（本番データ未発生） | 7.1 |
| `src/services/auth/owner.ts` | `resolveOwner(authHeader)` を追加し iss 振り分け。`withOwner`/`requireOwner` は resolver 経由に | 低（IF 不変） | 7.2 |
| `src/services/auth/guestSession.test.ts` | ticket テスト → guest JWT テストに置換 | 低 | 003 |
| `api/_session.ts` | resolveOwner ベースの SessionProvider に差し替え（Bearer→owner） | 中（全 API の認証経路） | 7.2 |
| `.env.example` | `GUEST_TOKEN_SECRET=...` 追加 | 低 | 7.5 |

## 2. 新規ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/auth/guestToken.ts` | `genGuestSub`/`signGuestToken`/`verifyGuestToken`（HS256, iss 検証） | （node crypto / jose 等、injectable signer） | ~50 |
| `src/services/auth/guestToken.test.ts` | 署名往復・期限切れ・iss 不一致・改竄検出 | guestToken | ~60 |
| `src/services/auth/guestStore.ts` | client localStorage 永続（get/store/clear、key=`michikusa.guestToken`） | （injectable storage） | ~25 |
| `src/services/auth/guestStore.test.ts` | 再利用 no-op / 無時 fetch / clear | guestStore | ~40 |
| `src/services/auth/linkAccount.ts` | scaffold §1.6 連携ロジック（link-first→external_account_exists 検知→sign-in fallback の純粋分岐） | （injectable Clerk client） | ~60 |
| `src/services/auth/linkAccount.test.ts` | 新規連携 / 既存→fallback / 二重リダイレクト抑止フラグ | linkAccount | ~70 |
| `src/features/account/AccountAuth.tsx` | 「Google でログイン」1 ボタン + サインアウトボタン UI 動線 | linkAccount/guestStore | ~50 |
| `src/features/account/AccountAuth.test.tsx` | ボタン描画 / onClick 連携呼び出し / signOut 呼び出し | AccountAuth | ~40 |

## 3. 削除ファイル一覧
| ファイル | 削除理由 | 代替 |
|---|---|---|
| （なし。guestSession.ts は撤去でなく中身置換） | — | guestToken.ts + provisionGuest |

## 4. マイグレーション要否
- DB スキーマ変更: ❌（users.id 文字列の意味拡張のみ）
- 既存データ変換: ❌（本番セッション未発生、orphan 回収不要）
- 設定変更: ✅（`GUEST_TOKEN_SECRET` env 追加）
- → **005_MIGRATION 不要**（後方互換 ✅・データ移行なし）

## 5. 実装 Phase 分割（/flow:tdd-phase 連携）
### Phase 1: guest JWT コア（RED→GREEN→IMPROVE）
- 対象: `guestToken.ts`（sign/verify/iss/exp）+ `provisionGuest`（guestSession.ts 置換）
- ゴール: 署名往復・改竄/期限/iss 検証が green、provisionGuest が Clerk createUser を呼ばない
### Phase 2: owner resolver ルーティング
- 対象: `owner.ts` resolveOwner（iss 振り分け）+ `api/_session.ts` 差し替え
- ゴール: Clerk JWT → Clerk owner / guest JWT → sub / 無効 → 401
### Phase 3: client 永続 + 連携/サインアウト
- 対象: `guestStore.ts` + `linkAccount.ts` + `AccountAuth.tsx`
- ゴール: 再利用 no-op、新規/既存連携分岐、signOut 動線が green

## 6. 依存関係順序
```
guestToken → provisionGuest → resolveOwner → api/_session
                                 ↓
guestStore → linkAccount → AccountAuth
```

## 7. ロールアウト計画
| ステップ | 内容 | 期日 | 検証 |
|---|---|---|---|
| 1 | unit green（Phase 1-3） | 即時 | /flow:tdd |
| 2 | 実 Clerk/実 secret で匿名→authed 200 + Google 連携往復 | release | /flow:release Phase 2 |

## 8. リスク・注意点
- `external_account_exists` の正確な error code は実 Clerk で確認（scaffold §1.6 broad match `/exists|claimed|already|identification/i` で hedge）。
- guest JWT TTL 180日は長命だが、secret ローテーション時は既存ゲスト token 無効化に注意（再 provision で回復）。

## 9. 完了の定義 (DoD)
- [ ] Phase 1-3 unit green（guest JWT 署名往復・iss 振り分け・連携分岐・signOut）
- [ ] `establishGuestSession` ticket 方式が撤去され churn 経路が消滅
- [ ] `.env.example` に `GUEST_TOKEN_SECRET`
- [ ] 実キー結合（匿名→authed 200 / Google 連携）は release で検証（P4.46）

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-18 | 初版作成 | /flow:revise |
