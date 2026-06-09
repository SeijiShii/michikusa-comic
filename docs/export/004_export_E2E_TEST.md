# export E2E テスト計画
> 2026-06-09
## 1. ジャーニー
| UC5-S1 | 高画質書き出しを選ぶ | 価格+対価明示(O43)→課金(test)→高画質書き出し |
| UC5-S2 | 投げ銭 | 固定額課金→お礼（控えめ, charter §2.2） |
## 2. 環境: Chromium モバイル / ゲスト→連携 / Stripe test モード
## 3. データ: Seed 作品 / Cleanup purge + テスト課金
## 5. ビジュアル検証（O34）: Level1 ✅ / Level2 ✅（価格が CTA 前=O43）/ Level3 △（決済画面は重要, 任意）
## 6. KPI: 成功率 100%, O43 価格透明性 pass
## 7. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
