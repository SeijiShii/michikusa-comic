# _shared/storage 仕様書（横断基盤）

> **役割**: Cloudflare R2（S3 互換）画像ストレージ。署名 URL 発行 / キー設計 / アップロード / 削除（DSR purge）
> **タグ**: cross-cutting / foundation
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`（§3.X SEC-004, §4.3, §5.2）, `../types`, `../auth`
> **target_type**: cross-cutting（E2E は capture/account 側）

---

## 1. 提供インターフェース
| 関数 | 責務 |
|---|---|
| `presignUpload(ownerId, kind)` | 所有者キー配下への直接アップロード用署名 URL（写真原本）。**所有者キーのみ発行（SEC-004）** |
| `presignGet(ownerId, key)` | 私的オブジェクトの読み取り署名 URL（所有権検証後） |
| `putObject(ownerId, key, data)` | サーバー経由アップロード（生成コマ画像・書き出し画像） |
| `deleteObject(key)` | 単一削除 |
| `purgeOwner(ownerId)` | **所有者の全オブジェクト削除（SEC-001 DSR、account 削除で db cascade と協調）** |

## 2. キー設計
- `photos/{ownerId}/{uuid}.{ext}` — 取込写真原本
- `panels/{ownerId}/{comicId}/{order}.png` — 生成コマ画像
- `exports/{ownerId}/{comicId}/{quality}.png` — 書き出し画像（プレビュー低/高画質、[論点-002]）
- **キーに ownerId を必ず含める** → 所有権境界をパスで表現（SEC-004）

## 3. データモデル
- R2 オブジェクト。メタ（r2_key）は db（photos/panels）が保持。storage は I/O のみ

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| 署名 URL 発行 | ownerId = session.userId を auth で検証してから（他人キー発行禁止、SEC-004） |
| アップロード | MIME/サイズは helpers.validateImageFile で事前検証（SEC-005） |
| バケット | 私的バケット（public read 禁止）、署名 URL のみアクセス |
| purge 失敗 | 部分失敗をログ + 再試行（DSR 履行のため確実に消す） |

## 5. NFR + 連携
- **NFR**: エグレス無料（R2）、署名 URL の短期 TTL。画像トラフィック主体
- **連携**: capture（presignUpload）/ compose（putObject コマ画像）/ share・export（書き出し）/ account（purgeOwner、DSR）/ db（key 連携）/ auth（所有権検証）

## 6. タグ別追加項目
- 該当なし

## 7. スコープ外
- 画像処理（helpers）/ 生成（ai）/ R2 認証情報取得（PREREQUISITES §1）

## 8. 未決事項
- 現時点で論点なし（2026-06-09）。書き出し画像の保持/TTL は export 実装時に決定（ストレージコスト §4.6）

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復10） |
