# share 機能仕様書
> **役割**: 画像書き出し + OS 標準シェア（合成画像レンダリング）。製品内グロース導線 ／ **タグ**: feature / auth-required ／ 2026-06-09
> **入力**: concept §1.1 UC3 / §4.8.2 製品内グロース / [論点-003]

## 1. 詳細 UC
### UC3: 分かち合う（concept §1.1 #3）
- 作品を画像書き出し → OS 標準シェア（navigator.share）/ URL コピー
- **製品内グロース（§4.8.2）**: シェア画像末尾に控えめにサービス名+URL、強制シェアなし（charter §2.2）
- **[論点-003] 注意喚起**: 人物/店舗/商標が写る場合のシェア前の軽い注意 + 位置情報除去（stripGeoExif, SEC-002）

## 2. 入出力
- クライアント合成（compositePanels, helpers）→ navigator.share / Blob ダウンロード
- 任意: OG カード用に書き出し画像を R2 保存（storage）

## 3. データモデル
- 追加なし（既存 comic/panel）

## 4. バリデーション/エラー
- 共有前に stripGeoExif（SEC-002）/ navigator.share 非対応はフォールバック（ダウンロード+コピー）

## 5. NFR + 連携
- 合成品質（標準解像度）。連携: gallery/compose（対象）/ helpers（合成/strip）/ storage（OG, 任意）

## 6. タグ別
- 認可: 自分の作品のみ

## 7. スコープ外
- 高画質書き出し（export）/ 外部 SNS 直接 API（スコープ外）

## 8. 未決事項
- [論点-003] 注意喚起 UI の文言（legal と同期）

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復19） |
