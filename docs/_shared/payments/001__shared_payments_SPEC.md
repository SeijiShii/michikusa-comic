# _shared/payments 仕様書（横断基盤）

> **役割**: Stripe 単発決済（PWYW: 高画質書き出し買い切り / 投げ銭）+ Webhook 署名検証。継続課金なし
> **タグ**: cross-cutting / foundation / auth-required
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`（charter §1 PWYW, §4.6, §6）, `../db`, `../auth`, `../types`
> **target_type**: cross-cutting（E2E は export 側）

---

## 1. 提供インターフェース
| 関数 | 責務 |
|---|---|
| `createCheckout({ ownerId, kind, amountJpy, comicId? })` | Stripe Checkout セッション作成（単発）。kind=tip/highres_export |
| `handleWebhook(rawBody, sig)` | **署名検証**（SEC: Webhook 署名必須）→ payment status 更新（paid/failed） |
| `getPayments(ownerId)` | 自分の課金履歴 |

## 2. 決済フロー（PWYW、charter §1）
1. ユーザーが任意で「高画質書き出し買い切り」or「投げ銭（固定 100 円等）」を選択
2. `createCheckout` → Stripe Checkout（金額・対価を明示、O43 価格透明性は export UI 側）
3. 決済完了 → Webhook（署名検証）→ payment.status=paid → 機能解放（高画質書き出し）
- **完全無料で利用可能が前提**（課金は任意支援、charter §1）

## 3. データモデル
- `payments`（_shared/db）: owner_id, kind, status, amount_jpy, comic_id, stripe_ref（uniq）, created_at

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| Webhook 署名 | **署名検証必須**（偽装防止）。検証失敗は 400 |
| 冪等性 | stripe_ref uniq + イベント ID で二重処理防止 |
| 金額 | amountJpy 範囲（DTO スキーマ、SEC-005） |
| 認証 | createCheckout は withOwner 保護（課金は認証/連携が前提、auth） |

## 5. NFR + 連携
- **NFR**: 月固定費ゼロ（従量手数料のみ、preferences §4.5）。Webhook 信頼性
- **連携**: export（買い切り）/ compose・gallery（投げ銭導線）/ db（payments）/ auth（認証必須）

## 6. タグ別追加項目（auth-required）
- 課金は認証/連携ユーザー（ゲストは連携を促す、O22 段階認証）

## 7. スコープ外
- サブスク（採らない、concept）/ 返金 UI（手動対応、特商法 §9.4）/ Stripe キー取得（PREREQUISITES §5）

## 8. 未決事項
- 投げ銭の金額（固定 100 円 vs 任意）は export/compose UI 設計時に確定（charter §1.7 フォールバック = 固定 100 円いいね型）

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復13） |
