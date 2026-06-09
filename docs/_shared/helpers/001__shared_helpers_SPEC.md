# _shared/helpers 仕様書（横断基盤）

> **役割**: 日付・エリア解決・画像処理（リサイズ/EXIF）・バリデーション補助の純関数群
> **タグ**: cross-cutting / foundation
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`, `../types/001__shared_types_SPEC.md`
> **target_type**: cross-cutting（E2E スキップ）

---

## 1. 提供インターフェース（純関数）
| 関数 | 入力 → 出力 | 用途 |
|---|---|---|
| `formatYearMonth(date)` | Date → 'YYYY-MM' | コレクション集計 |
| `resolveArea(lat,lng)` | 座標 → エリア名（粗い逆ジオ、ローカル簡易 or 任意 API） | 写真メタ。**MVP は緯度経度→大まかな地域名のローカルテーブル or「エリア未設定」**（外部逆ジオ API は任意・コスト/プライバシー考慮） |
| `extractExif(file)` | 画像 → { takenAt?, lat?, lng? } | 撮影日時/位置抽出 |
| `stripGeoExif(file)` | 画像 → 位置情報除去済み画像 | **共有/書き出し時の位置情報除去（SEC-002 PII）** |
| `resizeImage(file, maxPx)` | 画像 → リサイズ画像 | アップロード前圧縮 / プレビュー低解像度（[論点-002]） |
| `compositePanels(panels, layout)` | コマ画像 + 吹き出し配置 → 合成画像（Canvas/SVG） | セリフ/吹き出しのアプリ側合成（[論点-001]、share/compose） |
| `validateImageFile(file)` | File → { ok, error? } | MIME/サイズ/枚数チェック（SEC-005） |
| `scrubPII(text)` | string → string | フィードバック本文の PII 除去（SEC-002/O40） |

## 2. 入出力
- すべて純関数（副作用なし、I/O は呼び出し側）。一部は Canvas/Image API（ブラウザ）依存

## 3. データモデル
- 該当なし（型は types を使用）

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| validateImageFile | MIME allow-list（jpeg/png/webp/heic）、サイズ上限、破損検出（SEC-005） |
| extractExif | EXIF 不在/破損時は空 { } を返す（throw しない） |
| resolveArea | 座標不正/不明は「エリア未設定」 |

## 5. NFR + 連携
- **NFR**: 画像処理はクライアントで非ブロッキング（Web Worker 検討）。compositePanels は書き出し品質に直結
- **連携**: capture（exif/resize/validate）/ compose・share（composite）/ feedback（scrubPII）/ types（型）

## 6. タグ別追加項目
- 該当なし

## 7. スコープ外
- 実際の画像生成（_shared/ai）/ ストレージ I/O（_shared/storage）

## 8. 未決事項
- [論点-002 連携] resolveArea の精度（ローカルテーブル vs 外部逆ジオ API）は MVP=ローカル簡易、商用化時に再評価（コスト/プライバシー）
- compositePanels の詳細（焼き込み範囲）は [論点-001]（design/compose）確定後

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復8） |
