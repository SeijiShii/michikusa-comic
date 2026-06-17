# 改修: ゲスト JWT 永続化 + 段階認証連携/サインアウト動線

- **issue / slug**: 001 / guest-jwt-and-link
- **実施日**: 2026-06-18
- **対象機能**: ../README.md (_shared/auth)
- **基準 SPEC**: ../001__shared_auth_SPEC.md
- **改修要望**: audit AUDIT_20260618_0807 High 2 件 — O22(B) linkAccount/連携・サインアウト動線欠落 + O22(D) ゲスト identity 非永続 owner churn
- **状態**: 設計中

## このフォルダのドキュメント
- `001_REVISE_SPEC.md` / `002_REVISE_PLAN.md` / `003_REVISE_UNIT_TEST.md` / `004_REVISE_E2E_TEST.md`
- `101_REVISE_IMPL_REPORT.md`（/flow:tdd 実装後）

## 関連
- 根拠: `../../AUDIT_20260618_0807.md` §3.2
- パターン SoT: `~/.claude/flow-data/guest-auth-clerk-scaffold.md` §1.6 / §1.7
