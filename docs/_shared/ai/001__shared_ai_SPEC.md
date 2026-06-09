# _shared/ai 仕様書（横断基盤）

> **役割**: 外部 AI クライアントラッパ。OpenAI Vision（写真理解→コマ割り素材）+ Gemini 2.5 Flash Image（4 コマ絵柄生成）+ プロンプトテンプレ（差別化のドメイン知識）+ フォールバック + レート制限（SEC-003）+ コスト積算
> **タグ**: cross-cutting / foundation / analytics（コスト）
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`（§1.1 AI 価値検証, §6, §3.X SEC-003, §4.6.2）, `../types`, `../cost-tracking`
> **target_type**: cross-cutting（E2E は compose 側）

---

## 1. 提供インターフェース
| 関数 | 責務 |
|---|---|
| `understandPhoto(photo)` | OpenAI Vision で写真を理解 → { 被写体, 状況, 4 コマ構成の素材 }（store=false、PII 注意） |
| `generatePanels(plan)` | Gemini 2.5 Flash Image で 4 コマの絵柄を stylize 生成（一貫性のため参照画像/共通プロンプト）。**セリフ/吹き出しは含めない**（アプリ側合成、[論点-001]） |
| `buildComicPlan(understanding, caption)` | 写真理解 + ひとこと → 4 コマ構成案（コマ割り + セリフ案）。**差別化のドメイン知識（4 コマの型）を内包** |

## 2. AI 価値検証（concept §1.1、差別化の根拠）
- **(b) ドメイン知識**: `buildComicPlan` が「4 コマ構成の型」をプロンプト/few-shot に組み込む（汎用 AI 直叩きとの差別化）
- **(c) 出力後処理**: 生成画像をアプリ側でセリフ合成可能な形に（panel 単位、編集可能）
- 生 LLM 出力でなく業務 UI（ギャラリー蓄積・文脈紐付け）に統合

## 3. プロンプト/モデル方針
- Vision: gpt-4o-mini Vision、`store=false`、送信前に位置情報など PII 配慮（SEC-002）
- 画像生成: Gemini 2.5 Flash Image、4 コマで絵柄一貫（共通スタイルプロンプト + 参照）。**解像度は段階化**（プレビュー低/書き出し高、[論点-002]）
- フォールバック: API ダウン/レート超過 → 「時間をおいて再試行」案内 + 下書き保持（§6）

## 4. レート制限 + コスト（SEC-003 / §4.6.2）
| 観点 | 方針 |
|---|---|
| レート制限 | 生成エンドポイントに IP/ユーザー単位制限（ゲスト厳しめ）。コスト爆発防止（SEC-003、O27） |
| コスト積算 | 各呼び出しを `cost-tracking` に記録（provider/metric/quantity/estimatedUsd）。無料枠アラート（§4.6.2） |
| API キー | server side のみ（ブラウザ非露出、§6） |

## 5. NFR + 連携
- **NFR**: 生成は非同期・数十秒許容（concept §3）。プロンプト品質が「4 コマらしさ」に直結（出力品質 NFR）
- **連携**: compose（understand/buildPlan/generate）/ cost-tracking（積算）/ types / helpers（画像）/ storage（生成画像保存は compose 経由）

## 6. タグ別追加項目（analytics=コスト）
- 全 AI 呼び出しに cost イベント（サービス名/エンドポイント/リクエスト数/トークン/画像数）を記録（§4.6.2）

## 7. スコープ外
- 画像の R2 保存（storage、compose が呼ぶ）/ セリフ合成（helpers.compositePanels）/ API キー取得（PREREQUISITES §1）

## 8. 未決事項
- [論点-002] 解像度段階化・生成上限・キャッシュの確定（compose/§4.6 と連携）
- [論点-001] セリフの焼き込み vs アプリ合成の最終線引き（design 確定後）
- AI 価値検証: 差別化根拠（4 コマの型）が弱ければ再検討（concept §1.1 注記）

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復11） |
