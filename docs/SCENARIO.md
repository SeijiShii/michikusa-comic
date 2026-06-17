# 道草コミック 開発シナリオ

**最終更新**: 2026-06-09
**生成元**: /flow:concept (初回) / /flow:scenario (更新)
**シナリオ種別**: 新規 MVP 立ち上げ

> 本ファイルは AI が「次に何をすべきか」を判断する際の参照ドキュメント。
> `/flow:auto` および引数空起動された各 flow コマンドが本ファイルを Read する。
> §5 現在地カーソルは flow コマンドが auto-generated 範囲で書き換える。

---

## 1. ゴール

散歩で見つけた風景を AI 補助で 4 コマ漫画に仕立てて残す・分かち合う軽量 PWA を、無料枠厳守 + PWYW で 1〜2 ヶ月で MVP 公開する。

## 2. 進行フェーズ

1. **Phase 1: 概念設計 + リポジトリ整備** — concept.md + SCENARIO.md 確定 + GitHub リポジトリ整備（init/remote/ブランチ保護/CI scaffold/Secrets）
2. **Phase 1.5: デザインシステム** — concept のやわらか・温かみ路線から design SoT 導出 + スタイル基盤適用（`/flow:design`、O39）。[論点-001] のセリフ合成方針もここで詰める
3. **Phase 2: 機能設計** — concept §1.3 優先度順に SPEC + PLAN + UNIT_TEST + E2E_TEST 生成
4. **Phase 3: 実装** — TDD で各機能実装、Phase 2 完了から順次。画面実装後に視覚デザインレビュー（Design gate）
5. **Phase 4: 公開準備** — audit + secure(deps) + 法務書類（§9）+ PR
6. **Phase 5: 公開後運用** — feedback / claim → fix / revise の循環

## 3. 各フェーズで使う flow コマンド + 完了ゲート

### Phase 1: 概念設計 + リポジトリ整備
- 主コマンド: `/flow:concept` (初回 NEW) ✅ 完了
- **GitHub リポジトリ整備**（concept §10 の方針に基づく）:
  1. `git init` + `.gitignore`（`.env*.local` 除外）+ 初回コミット ✅（本セッションで実施）
  2. GitHub に private リポジトリ作成 + remote 追加 + push（`gh repo create michikusa-comic --private --source=. --push`）
  3. main ブランチ保護（PR 必須 + CI green 必須、Trunk-based）
  4. CI scaffold（`.github/workflows/ci.yml`: lint / typecheck / unit）+ Dependabot 有効化
  5. GitHub Secrets 登録（§10.5 / PREREQUISITES.md §1 のキー一覧、値は実装フェーズで FILL）
  6. Vercel プロジェクト連携（preview/production デプロイ、初回本番 deploy は Phase 4）
- セキュア: `/flow:secure --phase=design --scope=concept`
- 見積（1 回目）: `/flow:estimate`
- 完了ゲート: concept.md 全節埋まり / **GitHub リポジトリ作成 + remote push + main 保護 + CI scaffold 配置** / secure Critical/High closed / 初回見積生成

### Phase 1.5: デザインシステム
- 主コマンド: `/flow:design`
- 完了ゲート: `docs/design/design-system.md` 生成 / トークンがスタイル基盤に反映 / [論点-001] 方針確定

### Phase 2: 機能設計
- 主コマンド: `/flow:feature <target>`（優先度順: _shared/types → helpers → db → auth/storage/ai/cost-tracking → payments/capture/legal → compose/gallery → collection/share/export/feedback → app-shell）
- セキュア（各機能）: `/flow:secure --phase=design --scope=feature_<target>`
- 見積（2 回目、最初の 1 feature 完了直後）: `/flow:estimate`
- 完了ゲート: 全 001〜004 生成 / Critical/High 解決

### Phase 3: 実装
- 主コマンド: `/flow:tdd`（連続実装）+ `/flow:e2e`
- セキュア: `/flow:secure --phase=pre-impl` / `--phase=deps`
- 完了ゲート: 全 101/102/103 生成 / 全テスト green / Phase 単位コミット

### Phase 4: 公開準備
- 主コマンド: `/flow:audit` + `/flow:secure --phase=deps` + `/flow:release`
- 法務: §9 書類整備 / `/flow:wording` で UI 文言仕上げ / `/flow:promote` で告知文面
- 完了ゲート: PR マージ + 本番デプロイ

### Phase 5: 公開後運用（循環）
- feedback → `/flow:claim` 判定 → `/flow:fix` or `/flow:revise` → `/flow:tdd` → PR

## 4. 分岐ルール

| イベント | 切替先 | 戻り先 |
|---|---|---|
| Critical/High SEC finding | `/flow:revise` or `/flow:fix` | 元 Phase |
| ユーザークレーム | `/flow:claim` 判定 | 判定先 |
| 設計 drift（audit 発覚） | `/flow:revise` | 元 Phase |
| AI 生成コスト超過 | [論点-002] 解決（解像度段階化等）→ `/flow:revise` | 元 Phase |

## 5. 現在地カーソル

<!-- AUTO-GENERATED:BEGIN scenario-cursor -->
- 現在フェーズ: Phase 3 完了 → Phase 4 公開準備 — **release-pre 監査(§3.0c)完了 + audit High 全是正済、正当な Release gate 到達**
- 進行中ターゲット: Release 工程（実キー FILL + 実サービス検証 + デプロイ）= Class C/B、要人間
- 最終更新セッション: D20260618_001_resume_continuous
- 最終更新時刻: 2026-06-18
- 完了フェーズ: [Phase 1, 1.5, Phase 2(全18設計), Phase 3 no-key 実装(108テスト green, vite build green), Phase 4 release-pre 監査(full audit + secure; audit High 3=O22(B/D) auth churn+段階認証+favicon/PWA icon 404 を全是正 b982498/d9f0b9d; deps dev-only; 論点-001/002/003 resolved)]
- 次の推奨アクション: **/flow:release**（実キー FILL → 実 Clerk/Neon/R2/Stripe/AI 検証 → デプロイ、Class C/B = 要人間）。no-key Class A 枯渇証明済 + §3.0c release-pre ゲート充足、残りは実キー検証のみ

## 6. 変更履歴

- 2026-06-09: /flow:concept で初回生成
- 2026-06-09: Phase 1 に「GitHub リポジトリ整備」を追加（ユーザー要望 [flow]）
- 2026-06-09: /flow:auto 連続実行 — secure(design) / account 機能追加(SEC-001) / estimate(初回) / design SoT を完了。Phase 1 + 1.5 のデザイン SoT まで到達
- 2026-06-09: /flow:auto で Phase 2 全18設計 + Phase 3 統合レイヤ実装(78テスト green, deploy-ready) 完了。GitHub push(SeijiShii/michikusa-comic, 50 commits) 完了 = Phase 1 ゲート全 close
