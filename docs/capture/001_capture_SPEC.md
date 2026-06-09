# capture 機能仕様書

> **役割**: 写真取り込み + ひとこと添え + メタ（日付/位置/エリア）付与
> **タグ**: feature / auth-required / offline-critical（取込はオフラインでも下書き可）
> **最終更新**: 2026-06-09
> **入力**: `../concept.md`（§1.1 UC1, §3.X SEC-004/005）, `./README.md`

---

## 1. 詳細 UC

### UC1: 写真を取り込んでひとことを添える（concept §1.1 #1 入口）
- **トリガー**: トップ/撮影画面で「写真をえらぶ」
- **前提**: ゲストセッション確立済（auth、0 タップ起動）
- **入力**: 写真 1〜数枚（カメラ/カメラロール）+ ひとこと（任意）
- **処理**: validateImageFile（MIME/サイズ/枚数、SEC-005）→ EXIF 抽出（撮影日時/位置、helpers）→ resolveArea → resizeImage → R2 presign アップロード（storage、所有者キー）→ photo メタ保存（db）
- **出力**: 取込完了 → compose（4 コマ化）へ遷移、または下書き保存
- **例外**: 不正ファイル → やさしいエラー（O38）/ アップロード失敗 → 再試行・下書き保持

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| POST | /api/photos/presign | { kind } | { uploadUrl, key } | withOwner |
| POST | /api/photos | { keys[], caption, exifMeta } | { photo[] } | withOwner |
### 2.2 画面入力
| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| 写真 | File[] | ✅ | MIME allow-list / サイズ上限 / 枚数上限（SEC-005） |
| ひとこと | text | ✕ | 長さ上限 |
### 2.3 副作用
- R2 アップロード（所有者キー）/ photos 行作成 / 位置情報は本人領域のみ（SEC-002）

## 3. データモデル
- `photos`（既存、_shared/db）。新規追加なし

## 4. バリデーション + エラーケース
| 対象 | ルール / エラー |
|---|---|
| ファイル | MIME/サイズ/枚数（SEC-005）→ やさしいエラー |
| アップロード失敗 | 再試行 + 下書き保持（offline-critical） |
| 認証 | withOwner（未認証 401、ただしゲストは自動確立済） |

## 5. 機能固有 NFR + 連携
### 5.1 NFR
- 取込〜プレビューは軽快（resize はクライアント、非ブロッキング）
### 5.2 連携
- _shared/storage（presign）/ _shared/helpers（exif/resize/validate）/ _shared/auth（withOwner）/ _shared/db（photos）/ compose（取込後遷移）

## 6. タグ別追加項目
### 6.1 認可（auth-required）
- 全 API withOwner、photos は owner_id 境界
### 6.3 オフライン（offline-critical）
- 取込・ひとことはオフラインでも下書き（IndexedDB）→ オンライン復帰で同期。競合は last-write-wins（個人データのため単純）

## 7. スコープ外
- 4 コマ生成（compose）/ 画像編集

## 8. 未決事項
- オフライン下書きの同期詳細は実装時（IndexedDB キュー）。MVP は「オンライン前提 + 失敗時リトライ」で簡素化も可（論点として記録）

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復14） |
