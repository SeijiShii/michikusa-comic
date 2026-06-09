# export 機能仕様書
> **役割**: 高画質書き出し + PWYW 課金導線（買い切り/投げ銭） ／ **タグ**: feature / auth-required ／ 2026-06-09
> **入力**: concept §1.1 UC5 / charter §1 PWYW / §4.6 / O43 価格透明性

## 1. 詳細 UC
### UC5: 高画質で残す（concept §1.1 #5、任意）
- 1 作品の高解像度版を書き出し（[論点-002] 高解像度再生成）→ 保存/印刷
- **PWYW**: 高画質書き出し買い切り or 投げ銭。**完全無料利用が前提、課金は任意**（charter §1）
- **O43 価格透明性**: 金額+対価（例「高画質書き出し ○○円」）を CTA より前・ファーストビューに明示

## 2. 入出力
| POST | /api/export/:comicId/checkout | { kind } | { checkoutUrl } | withOwner |
| POST | /api/export/:comicId/render | — | { highResKey } | withOwner（課金確認後） |
- 副作用: Stripe Checkout（payments）/ 高解像度再生成（ai, [論点-002]）/ R2 保存（storage）

## 3. データモデル
- payments（既存）/ exports R2 キー（高画質）

## 4. バリデーション/エラー
- 課金完了確認後に高画質書き出し（payments Webhook）/ withOwner / O43 価格明示

## 5. NFR + 連携
- 高解像度生成はコスト（[論点-002] 課金で回収）。連携: payments（課金）/ ai（高解像度再生成）/ storage/ gallery/ compose

## 6. タグ別
- 認可: 自分の作品 + 課金状態

## 7. スコープ外
- サブスク / 返金 UI（手動, §9.4）

## 8. 未決事項
- [論点-002] 高解像度再生成 vs アップスケール（推奨: 課金時高解像度再生成でコスト回収）
- 投げ銭金額（charter §1.7 = 固定 100 円いいね型 or 任意）

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復20） |
