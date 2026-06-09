# collection 機能仕様書
> **役割**: 月末「今月の道草」自動コレクション ／ **タグ**: feature / auth-required / analytics ／ 2026-06-09
> **入力**: concept §1.1 UC4

## 1. 詳細 UC
### UC4: 月次まとめ（concept §1.1 #4）
- 月ごとに保存作品を自動集約 → 「今月の道草」として一覧表示
- 集計は月次バッチ（Vercel Cron）or 参照時集約

## 2. 入出力
| GET | /api/collections | { yearMonth? } | { collections[] } | withOwner |
| GET | /api/collections/:ym | — | { comics[] } | withOwner |
- 副作用: 月次集計（collection 行、参照時 or cron）

## 3. データモデル
collections / collection_comics（既存 db）

## 4. バリデーション/エラー
withOwner / yearMonth 形式 / 空月は空コレクション

## 5. NFR + 連携
- 軽量集計。連携: gallery（作品）/ db / share（まとめ書き出し, 任意）

## 6. タグ別
- 認可: owner 境界 / analytics: 月次利用集計（任意）

## 7. スコープ外
個別作品編集

## 8. 未決事項
- 集計方式（参照時集約 vs Cron 事前集計）は実装時。MVP は参照時集約で簡素化推奨

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復18） |
