# feedback 機能仕様書
> **役割**: 好き嫌いリアクション + バグ報告ウィジェット（PII scrub）。O40 ユーザーフィードバック導線 ／ **タグ**: feature / auth-required / analytics ／ 2026-06-09
> **入力**: concept §1.3 feedback / §3.X SEC-002 / perspectives O40

## 1. 詳細 UC
### UC: フィードバック送信（O40）
- どの画面からでも 1 タップで 👍/👎 リアクション + バグ報告（自由記述 + 任意スクショ）
- **自動コンテキスト付与**: 画面/ルート / version / UA / 時刻。**送信前に PII scrub**（メール/位置/本文中の個人情報, SEC-002/O28）
- **二重シンク（O40）**: (a) 即時通知（共有運用チャンネル, 任意）+ (b) 中央集約（feedback-hub, 未構築なら §8 論点）

## 2. 入出力
| POST | /api/feedback | { kind, reaction?, body?, route, appVersion, ua } | { ok } | withOwner（ゲスト可） |
- 副作用: feedbacks 行 + (任意) 通知/hub 転送

## 3. データモデル
- feedbacks（既存 db、PII scrub 済本文）

## 4. バリデーション/エラー
- 送信前 scrubPII（SEC-002）/ body 長制限 / レート制限（スパム）/ Turnstile（任意）

## 5. NFR + 連携
- 軽量・どの画面からでも。連携: helpers（scrubPII）/ db / 通知（任意）/ feedback-hub（未構築なら別 PJ）

## 6. タグ別
- 認可: ゲスト可（owner 任意）/ analytics: フィードバック集計

## 7. スコープ外
- feedback-hub 本体（別 PJ、§8 論点）/ トリアージ（/flow:claim）

## 8. 未決事項
- **[論点] feedback-hub 未構築**: 共有 feedback-hub を別 PJ で立ち上げるか（O40）。MVP は feedbacks テーブル + 任意通知で開始、hub 接続は後

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復21） |
