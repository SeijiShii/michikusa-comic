# compose 機能仕様書

> **役割**: AI 4 コマ生成（コマ割り提案 + セリフ案 + 絵柄 stylize）+ アプリ側セリフ/吹き出し合成 + 微修正 + 保存
> **タグ**: feature / auth-required / stateful（draft→saved）
> **最終更新**: 2026-06-09
> **入力**: `../concept.md`（§1.1 UC1, §3.X SEC-003, §4.6, [論点-001/002]）, `./README.md`

---

## 1. 詳細 UC
### UC1: 写真 → 4 コマ化（concept §1.1 #1）
- **トリガー**: capture 後 or ギャラリーから「4 コマにする」
- **前提**: photo 取込済（capture）、ゲスト/認証セッション
- **処理**:
  1. `understandPhoto`（Vision、ai）→ 写真理解
  2. `buildComicPlan`（ai、4 コマの型 = 差別化）→ コマ割り + セリフ案
  3. `generatePanels`（Gemini、ai）→ 各コマの絵柄（**セリフ含まない**）→ R2 保存（storage）
  4. **アプリ側で `compositePanels`（helpers）= コマ枠 + 吹き出し + セリフを SVG/Canvas 合成**（[論点-001]）
  5. 微修正（セリフ編集 / 吹き出し位置 / 再生成）
  6. 保存（comic status: draft→saved）
- **出力**: 4 コマ作品 → ギャラリー
- **待ち時間 UX**: 生成中は O45 進捗体験（「描いています…」+ 軽い動き、design-system）

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| POST | /api/compose/generate | { photoIds, caption } | { comic(draft), panels } | withOwner + rate limit(SEC-003) |
| PATCH | /api/compose/:comicId/panels | { updates } | { panels } | withOwner |
| POST | /api/compose/:comicId/save | — | { comic(saved) } | withOwner |
### 2.3 副作用
- AI 呼び出し（コスト積算、§4.6.2）/ panel 画像 R2 保存 / comic・panels 行

## 3. データモデル
- `comics`（status draft/saved）/ `panels`（image_r2_key, speech, bubble_layout）。既存（db）

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| 生成 | photoIds 1..N（SEC-005）、rate limit（SEC-003）、コスト上限（[論点-002]） |
| 生成失敗/レート超過 | フォールバック（再試行案内 + 下書き保持、ai §6） |
| セリフ編集 | 長さ制限、XSS（合成時エスケープ、SEC-005） |

## 5. 機能固有 NFR + 連携
### 5.1 NFR
- 生成は非同期・数十秒許容（進捗 UX 丁寧、§3）。プレビューは低解像度、書き出し時に高解像度（[論点-002]、export）
### 5.2 連携
- _shared/ai（生成）/ _shared/helpers（compositePanels）/ _shared/storage（panel 画像）/ _shared/db（comic/panel）/ capture（入力）/ gallery（保存先）/ export（高画質再生成）

## 6. タグ別追加項目
### 6.1 認可（auth-required）: withOwner、comic/panel は owner 境界
### 6.2 状態遷移（stateful）: draft → saved（保存）。draft は再生成・編集可

## 7. スコープ外
- 高画質書き出し（export）/ シェア（share）

## 8. 未決事項
- **[論点-001]**: セリフ/コマ割りの焼き込み vs アプリ合成の最終線引き（design 確定 → 初版は案 A: AI は絵柄のみ、合成はアプリ）
- **[論点-002]**: 生成コスト上限・解像度段階化・キャッシュ（プレビュー低/書き出し高、再生成キャッシュ）

## 9. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復16） |
