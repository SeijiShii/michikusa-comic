# _shared/auth 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（via /flow:auto 反復28）
## 実装済（owner resolver, 6 テスト green）
- `owner.ts`: makeOwnerResolver / withOwner / requireOwner / getOwnerId / UnauthorizedError(401)
- injectable SessionProvider（mock 注入でテスト、SEC-004 認可分岐 401/200 検証済）
## 未実装（後続、実 Clerk SDK + キー要 = release 連携）
- `guestSession.ts` establishGuestSession（Clerk Anonymous + sign-in token 本番経路、P4.46）
- `clerk.ts` 実 SDK 配線 / `AuthProvider.tsx` / linkAccount（段階認証）
## DoD
- [x] withOwner/requireOwner/getOwnerId + 401/200 テスト green
- [ ] **establishGuestSession 本番経路 + 匿名→authed 200 結合（P4.46、実 Clerk 要、release で）**
- [ ] 段階認証連携
> ⚠️ P4.46: owner resolver は実装済だが、ゲストセッション確立の実 Clerk 経路は実キー必須のため release フェーズで完成。stub では満たさない旨は SPEC/PLAN に明記済。
