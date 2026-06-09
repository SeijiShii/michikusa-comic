# gallery 機能仕様書

> **役割**: マイギャラリー（時系列・エリア別振り返り）。**自分の全作品閲覧 = SEC-001 DSR 開示の履行も兼ねる**
> **タグ**: feature / auth-required ／ **最終更新**: 2026-06-09
> **入力**: `../concept.md` §1.1 UC2 / §3.X SEC-001/004

## 1. 詳細 UC
### UC2: 振り返り（concept §1.1 #2）
- 保存済 4 コマを時系列 / エリア別に一覧 → 詳細表示
- **開示権の履行**: 自分の全作品・写真・メタを閲覧できることが DSR 開示（O54、別途 export 不要）

## 2. 入出力
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| GET | /api/comics | { cursor, area?, yearMonth? } | { comics[], next } | withOwner |
| GET | /api/comics/:id | — | { comic, panels } | withOwner |

## 3. データモデル
- comics/panels（既存）。owner 境界で取得（SEC-004）

## 4. バリデーション + エラー
- withOwner（401）/ 他人 comic（404）/ ページネーション

## 5. NFR + 連携
- idx(owner_id, created_at/area) で高速（db）。署名 URL で画像表示（storage）
- 連携: compose（保存先）/ share・export（詳細から）/ collection（月次）/ account（開示）

## 6. タグ別
- 認可: withOwner、owner 境界

## 7. スコープ外
- 編集（compose）/ 書き出し（share/export）

## 8. 未決事項
- 現時点で論点なし（2026-06-09）

## 9. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature（反復17） |
