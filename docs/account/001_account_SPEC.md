# account 機能仕様書
> **役割**: アカウント/データ管理。**セルフサービス全データ削除（Neon 行+R2 画像 purge）= SEC-001/O54 DSR 非交渉の必須** + 段階認証 UI + 開示(自分の全データ閲覧) + AI 同意 ON/OFF
> **タグ**: feature / auth-required / legal-required ／ 2026-06-09
> **入力**: concept §3.X SEC-001 / §9.3 / perspectives O54 / O22

## 1. 詳細 UC
### UC-A: セルフ全データ削除（DSR 削除権、非交渉）
- 設定 → 「全データを削除」→ 確認 → **Neon 全行 cascade 削除（db）+ R2 全オブジェクト purge（storage）**
- ゲスト/匿名でも本人がセルフ完結（運営は本人特定不能、O54）
### UC-B: 開示（DSR 開示権）
- 自分の全作品/写真/メタを閲覧（gallery で履行、別途 export 不要、O54）
### UC-C: 段階認証（O22）
- ゲスト → Google OAuth 連携（linkAccount, auth）。クラウド同期/課金時
### UC-D: AI 同意 / 設定
- AI 送信の同意状態確認（中核機能のため OFF は機能制限の明示）

## 2. 入出力
| GET | /api/account | — | { user, isGuest, consent } | withOwner |
| POST | /api/account/delete | { confirm } | { ok } | withOwner |
| POST | /api/account/link | { provider } | { linked } | withOwner |
- 副作用: **削除 = db cascade + R2 purgeOwner（協調、確実に消す）**

## 3. データモデル
- users（is_guest, consent）。削除は全テーブル owner_id cascade（db）

## 4. バリデーション/エラー
- 削除は二段階確認 / cascade + purge の整合（片方失敗時は再試行、DSR 履行）/ withOwner

## 5. NFR + 連携
- 削除は確実（DSR）。連携: auth（linkAccount/session）/ db（cascade）/ storage（purgeOwner）/ legal（SEC-001 文言と整合）/ gallery（開示）

## 6. タグ別
- 認可: 自分のみ / legal-required: DSR 履行手段（O54）

## 7. スコープ外
- 運用者向け削除ツール（O54: 匿名で incoherent、作らない）/ バルク export（開示は in-app 閲覧で履行）

## 8. 未決事項
- ゲスト→連携時のデータ引き継ぎ（auth と同期）/ 非アクティブ匿名データの自動 purge cron（保持期限）

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復22） |
