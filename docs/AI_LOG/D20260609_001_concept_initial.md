# AI_LOG セッション D20260609_001 — /flow:concept (initial)

**実行日時**: 2026-06-09 (+09:00)
**コマンド**: /flow:concept
**対象**: プロジェクト全体（初版作成）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260609-001 〜 D20260609-009 (9 件)
**ファイル**: `D20260609_001_concept_initial.md`
**source_wants**: `./docs/wants.md`（idea_id I20260522-025 / batch 20260522_001 由来）

---

## 主要決定サマリ（人間向け要約）

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260609-001 | データ層（DB + 画像ストレージ） | Neon (Postgres) + Drizzle + Cloudflare R2 | auto-recommended |
| D20260609-002 | 4 コマ画像生成 AI | Gemini 2.5 Flash Image (nano-banana) | auto-recommended |
| D20260609-003 | 日本語セリフ描画方式 | アプリ側オーバーレイ（AI は絵柄 stylize まで） | auto-recommended |
| D20260609-004 | デザイン方向 | やわらか・温かみ・遅い遊び心 | auto-recommended |
| D20260609-005 | 認証 | Clerk（ゲスト → 課金/同期時に Google OAuth 段階認証） | auto-recommended |
| D20260609-006 | 収益モデル | PWYW（高画質書き出し買い切り + 100 円投げ銭）、Stripe 単発 | auto-recommended |
| D20260609-007 | アナリティクス | Vercel Web Analytics (cookieless) + 自前コスト積算ログ | auto-recommended |
| D20260609-008 | 外部 AI 利用 | 使う（本サービスの核、Vision + 画像生成） | auto-recommended |
| D20260609-009 | wants クリーンアップ | 全話題消化済、wants をクリア | auto-recommended |

## Open 論点（chosen_type=open）

| ID | 論点 | 関連 decision |
|---|---|---|
| 論点-001 | セリフ/コマ割りの「画像焼き込み」vs「アプリ合成」最終線引き | depends_on D20260609-003（/flow:design で詰める） |
| 論点-002 | 1 作品あたり生成コスト上限・解像度段階化・キャッシュ方針 | depends_on D20260609-002 |
| 論点-003 | 取り込み写真の著作権・肖像権（人物/店舗/商標 映り込み）+ 生成物の権利帰属 + シェア時注意喚起 | wants リスク由来 |

## 依存関係

- D20260609-002 → 依存: []（新規、preferences に画像生成蓄積なし）
- D20260609-003 → 依存: [D20260609-002]
- D20260609-005 → 依存: [D20260609-006]（課金時に段階認証が必要）
- 外部依存: preferences.md（Neon スタック charter §0、6 PJ 採用）をバイアス源に参照

## 生成・更新したアーティファクト

- 新規: `docs/concept.md`（§1〜§11）
- 新規: `docs/INDEX.md` / `docs/DOC_MAP.md` / `docs/PREREQUISITES.md` / `docs/SCENARIO.md`
- 新規: 機能フォルダ 8（capture / compose / gallery / collection / share / export / feedback / legal）README + INDEX
- 新規: 横断フォルダ 9（types / helpers / db / auth / storage / ai / cost-tracking / payments / app-shell）README + INDEX
- 新規: ルート `README.md`
- 更新: `docs/wants.md`（クリア）

## 学習・改善

- preferences への反映候補: §2.10 外部 AI に「Gemini 2.5 Flash Image（画像生成）」新規行（採用 1、試行レベル）、§2 標準スタック core row（React+TS / Neon / Vercel Functions / Clerk / Drizzle / Vercel / Sentry / CI/CD / shadcn / R2 / Stripe 単発 / Vercel Web Analytics）を +1。Step 7.5 でユーザー承認後に反映。

---

## Decisions

```yaml
- id: D20260609-001
  timestamp: 2026-06-09T10:00:00+09:00
  command: /flow:concept
  phase: Step 2 / 設計判断（wants 保留論点：データ層）
  question: メタデータ DB + 画像ストレージをどう組むか
  options:
    - Neon (Postgres) + Drizzle + Cloudflare R2 (recommended)
    - Supabase (DB + Storage 一体)
    - Neon + Vercel Blob
  recommended: Neon + Cloudflare R2
  chosen: Neon (Postgres) + Drizzle + Cloudflare R2
  chosen_type: auto-recommended
  depends_on: []
  context: |
    画像中心 PWA。preferences charter §0 デフォルト（Neon + Vercel + Clerk + R2）に整合。
    Supabase は preferences §5 で「無料 2 プロジェクト制約でマイクロサービス連発不適合」として NG。
    R2 はエグレス無料 + 10GB 無料枠で画像トラフィックに有利。

- id: D20260609-002
  timestamp: 2026-06-09T10:10:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.5 外部 AI（画像生成プロバイダ）
  question: 4 コマ生成の画像 AI をどれにするか
  options:
    - Gemini 2.5 Flash Image (nano-banana) (recommended)
    - OpenAI gpt-image-1
    - Replicate (SDXL 系)
    - ハイブリッド（stylize + アプリ合成）
  recommended: Gemini 2.5 Flash Image
  chosen: Gemini 2.5 Flash Image (nano-banana)
  chosen_type: auto-recommended
  depends_on: []
  context: |
    preferences に画像生成の蓄積なし（既存は OpenAI Vision テキスト用途のみ）= 新規判断。
    複数画像の一貫性・参照画像付き編集に強く、写真 stylize → 4 コマ絵柄一貫に好適。
    低単価で PWYW・無料枠厳守に整合。単価・無料枠は要確認。

- id: D20260609-003
  timestamp: 2026-06-09T10:12:00+09:00
  command: /flow:concept
  phase: Step 2 / 自動判断（日本語セリフ描画方式）
  question: セリフ・コマ枠を画像に焼き込むか、アプリ側で重ねるか
  options:
    - アプリ側オーバーレイ（SVG/Canvas で吹き出し・セリフ） (recommended)
    - 画像に焼き込み（生成 AI にセリフも描かせる）
  recommended: アプリ側オーバーレイ
  chosen: アプリ側オーバーレイ（AI は各コマの絵柄 stylize まで）
  chosen_type: auto-recommended
  depends_on: [D20260609-002]
  context: |
    画像生成 AI は日本語テキスト描画が不安定。吹き出し・セリフ・コマ枠をアプリ側で
    SVG/Canvas 合成すると可読性が安定し、微修正（セリフ編集）も容易。生成コストも下がる。
    最終的な焼き込み/合成の線引きは [論点-001] として /flow:design で詰める。

- id: D20260609-004
  timestamp: 2026-06-09T10:20:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.12 デザイン方向
  question: プロダクトの世界観・ムード
  options:
    - やわらか・温かみ・遅い遊び心 (recommended)
    - 元気・カラフル・ポップ
    - ミニマル・中立・写真映え
  recommended: やわらか・温かみ・遅い遊び心
  chosen: やわらか・温かみ・遅い遊び心
  chosen_type: auto-recommended
  depends_on: []
  context: |
    提供価値「日常を面白がる・道草の記録」、ターゲット「絵心はないが面白がりたい一般の人」、
    charter §2.2（競争・煽り・中毒回避）から導出。詳細なデザインシステムは Phase 1.5 /flow:design。

- id: D20260609-005
  timestamp: 2026-06-09T10:25:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.7(1) 認証方式 + 摩擦設計
  question: 認証方式とゲスト/段階認証
  options:
    - Clerk ゲスト（匿名）→ 課金/他端末同期時に Google OAuth 段階認証 (recommended)
    - 最初から OAuth 強制
  recommended: Clerk ゲスト → 段階認証
  chosen: Clerk Anonymous → Google OAuth Linking（課金/同期時）
  chosen_type: auto-recommended
  depends_on: [D20260609-006]
  context: |
    charter §1.1「気軽に触り始められる」適合。起動 → 即撮影 0 タップ。
    perspectives O22（progressive auth）+ preferences §2.4（Clerk 6 PJ 採用）。

- id: D20260609-006
  timestamp: 2026-06-09T10:30:00+09:00
  command: /flow:concept
  phase: Step 2 / charter §1 収益モデル
  question: 収益モデルと決済
  options:
    - PWYW（高画質書き出し買い切り + 100 円投げ銭）/ Stripe 単発 (recommended)
    - サブスク
  recommended: PWYW + Stripe 単発
  chosen: PWYW（完全無料利用 + 高画質書き出し買い切り + 投げ銭）、Stripe 単発（継続課金なし）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    wants charter §1。AI 生成コストは高画質書き出し課金で回収。preferences §4.5
    「個人ツールは無料枠 $0 厳守 + Stripe 固定費ゼロ課金導線」（3 PJ 観測）に整合。

- id: D20260609-007
  timestamp: 2026-06-09T10:35:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.6 アナリティクス・計測
  question: アナリティクス・計測ツール
  options:
    - Vercel Web Analytics (cookieless) + 自前コスト積算ログ (recommended)
    - GA4 / PostHog
    - 使わない
  recommended: Vercel Web Analytics + 自前コスト積算
  chosen: Vercel Web Analytics (cookieless) + 自前コスト積算ログ（§4.6.2）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    consent banner 不要で公開 LP 流入計測。AI コストは外部請求遅延を避け自前積算（§4.6.2 必須）。
    preferences §2.7（Vercel Web Analytics 4 PJ）。

- id: D20260609-008
  timestamp: 2026-06-09T10:40:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.5 外部 AI 利用の是非
  question: プロダクトで外部 AI を使うか
  options:
    - 使う（Vision + 画像生成、本サービスの核） (recommended)
    - 使わない
  recommended: 使う
  chosen: 使う（OpenAI Vision で写真理解 + Gemini で 4 コマ生成）
  chosen_type: auto-recommended
  depends_on: [D20260609-002]
  context: |
    AI 価値検証（汎用 AI 直叩きとの差別化）: (a) 写真→コマ割り構成の型、(b) ギャラリー蓄積で
    振り返れる、(c) 街・日付・場所の文脈紐付け。wants §差別化に明記。

- id: D20260609-009
  timestamp: 2026-06-09T11:00:00+09:00
  command: /flow:concept
  phase: Step 5.5 wants クリーンアップ
  question: 入力 wants を全話題消化後にクリアするか
  options:
    - クリア（全話題は concept.md / §8 未決事項に反映済） (recommended)
    - 残す
  recommended: クリア
  chosen: クリア（冒頭に cleared コメントを残置）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    wants 全話題は concept.md に消化、リスク 3 件は §8 [論点-001..003] に登録済。

- id: D20260609-010
  timestamp: 2026-06-09T11:30:00+09:00
  command: /flow:concept
  phase: Step 5.47 SCENARIO 更新（ユーザー要望割り込み）
  question: SCENARIO に GitHub リポジトリ整備を含めるか
  options:
    - Phase 1 を「概念設計 + リポジトリ整備」に拡張し完了ゲート化 (recommended)
  recommended: Phase 1 拡張
  chosen: Phase 1 を「概念設計 + リポジトリ整備」に拡張（remote/main 保護/CI scaffold/Secrets/Vercel 連携を完了ゲート化）
  chosen_type: explicit-choice
  type: command-feedback
  depends_on: []
  context: |
    seiji [flow]「シナリオに Github レポジトリの整備も含める」。PJ 側 SCENARIO.md に in-place 反映。
    [flow] タグのため flow-suite テンプレ（Step 5.47.2）への反映候補を
    ~/.claude/flow-data/command-feedback-inbox.md CF-20260609-001 に capture（PJ セッションのため
    本体編集はせず capture-only、flow-suite メンテ時にユーザー確認を経て適用）。
```
