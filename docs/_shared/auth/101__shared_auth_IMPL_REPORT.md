# _shared/auth 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復28+36）
## 実装済（owner resolver + guest session 経路, 8 テスト green）
- `owner.ts`: makeOwnerResolver / withOwner / requireOwner / getOwnerId / UnauthorizedError(401)（SEC-004、6テスト）
- `guestSession.ts`: **establishGuestSession 本番経路**（匿名 user 発行 + sign-in ticket、Clerk scaffold パターン、P4.46）。injectable ClerkBackend で testable、「匿名→authed owner 200（401でない）」を mock 検証（2テスト）
## 未実装（release、実 Clerk + 実キー）
- ClerkBackend 実 SDK アダプタ（@clerk/backend）/ フロント signIn.create({strategy:'ticket'}) 配線 / linkAccount（段階認証）
- **P4.46 DoD の「実 Clerk での 匿名→authed 200 結合検証」は release フェーズ**（実キー要）
## DoD
- [x] owner resolver（401/200）+ ゲスト本番経路コード（匿名→authed、mock 検証）
- [ ] 実 Clerk アダプタ + 実キー結合（release）/ 段階認証
> P4.46: 本番経路の**実コードは実装済**（stub の ownerId fake 注入ではない）。実 Clerk 検証のみ release。
