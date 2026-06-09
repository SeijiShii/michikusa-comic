# _shared/auth 実装計画書

> **入力**: `./001__shared_auth_SPEC.md`, `../../concept.md` §3.X SEC-004, perspectives O22, `~/.claude/flow-data/guest-auth-clerk-scaffold.md`
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/services/auth/ + api/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/auth/clerk.ts` | Clerk クライアント設定（ゲスト/段階認証） | @clerk/clerk-react, @clerk/backend | 60 |
| `src/services/auth/guestSession.ts` | establishGuestSession（匿名 sign-in token 経路、P4.46 非交渉） | clerk backend | 90 |
| `src/services/auth/owner.ts` | withOwner / requireOwner / getOwnerId | clerk backend, db | 80 |
| `api/auth/guest.ts` | ゲストセッション確立エンドポイント | guestSession | 50 |
| `src/components/AuthProvider.tsx` | ゲスト自動確立 + 段階認証 UI トリガ | clerk-react | 70 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: owner resolver（withOwner/requireOwner/getOwnerId） + mock セッション
- 401/200 分岐、owner_id 注入のユニットテスト（mock セッション）
### Phase 2: ゲストセッション確立の本番経路（P4.46）
- Clerk scaffold 展開: server `users.createUser()` + `signInTokens.createSignInToken()` → フロント `signIn.create({strategy:'ticket'})`
- **結合検証: 匿名セッション確立 → withOwner 保護 API が 200（401 でない）**（P4.46 DoD）
### Phase 3: 段階認証（linkAccount Google OAuth）+ AuthProvider 配線
- ゲスト→連携のデータ引き継ぎ

## 3. 依存関係順序
```
db(users) → owner resolver → guestSession → AuthProvider/api
```

## 4. 既存ファイルへの影響
- なし（基盤）。以降の全 feature API が withOwner を使う

## 5. 横断への追加・変更
- 全 feature API ハンドラが `withOwner` でラップ（app-shell の API ハンドラ層で統一適用）

## 6. リスク・注意点
- **P4.46 ハードゲート**: stub auth（固定ユーザー注入）が green でも未達。本番セッション経路の実コード必須。release §3.4 の本番 authed smoke 401 を本 Phase で先に潰す
- Clerk Anonymous の挙動・Free 10k MAU 制限の確認（PREREQUISITES §4）
- ゲスト→連携のデータ引き継ぎは Clerk の anonymous→linked 仕様に依存

## 7. 完了の定義（DoD）
- [ ] withOwner/requireOwner/getOwnerId 実装 + 401/200 テスト green
- [ ] **establishGuestSession の本番経路実装 + 「匿名→authed API 200」結合テスト green（P4.46 非交渉）**
- [ ] linkAccount（Google OAuth 段階認証）+ AuthProvider 配線
- [ ] typecheck green
- [ ] E2E: 「初回起動→即撮影（ゲスト）」「課金時に連携」シナリオは capture/account/export 側 E2E でカバー

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
