<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — 道草コミック（プロダクト全体）

**レビュー日**: 2026-06-09
**レビュー実施者**: Claude (Opus 4.8)
**対象**: プロダクト全体（concept.md）
**入力**: docs/concept.md (§1.1 / §1.3 / §3 / §4.3 / §4.5 / §5 / §6 / §9)
**観点ソース**: ~/.claude/flow-data/perspectives.md (O23-O28 + O54)
**severity-threshold**: medium

## 1. PJ 性質判定
- ユーザー数: **複数ユーザー**（各ユーザーが自分のアカウント/作品を持つ公開アプリ）
- 公開範囲: **公開**（公開 PWA）
- 課金: **有償**（PWYW — 高画質書き出し買い切り / 投げ銭）
- 個人情報: **扱いあり**（写真 + 位置情報 EXIF + 課金）
- AI 利用: **あり**（OpenAI Vision + Gemini 2.5 Flash Image）
- 地域: **国内向け**（個人情報保護法）

## 2. 脆弱性パターン照合結果

### 2.1 サマリ
- Critical: 1 件（SEC-001、legal_required）
- High: 4 件（SEC-002〜005）
- Medium: 0 件
- 対応済み: 1 件（O25 秘密情報管理）
- 設計フェーズ skip: 1 件（O28 依存 — lockfile 不在、`--phase=deps` で後日）
- 法令必須: 2 件（O54 / O26、いずれも未充足 or 部分）

> scope=concept のため Critical/High はすべて **accepted-as-requirement** ルートで自動 dispatch（concept §3 NFR にセキュリティ要件として追記 + §8 に [論点] 登録 status=accepted-as-requirement）。

### 2.2 詳細（severity 降順）

#### [SEC-001] DSR（開示・削除請求）の履行可能性 — ゲスト認証下の窓口削除は履行不能 (O54_dsr_fulfillment_operability, severity=Critical, legal_required)
- **照合結果**: 未充足（履行手段不在 + 法務文言が anti-pattern）
- **検出根拠**:
  - §9.1 / §9.3 がプライバシーポリシーで「開示請求窓口」を約束、§4.1/§5/§1.1 は **Clerk ゲスト（匿名）認証**を採用（D20260609-005）
  - ゲスト/匿名ユーザーは運営がメール等で本人特定**不能**（email↔UUID 紐付けなし）→ 「窓口へ請求 → 運営が開示/削除」は**原理的に履行不能**
  - §1.3 機能フォルダに **セルフサービス全データ削除の導線が不在**（capture/compose/gallery/collection/share/export/feedback/legal はあるが account/data-deletion なし）。concept 自身の Q12.8 注記「全データ削除のセルフサービス導線は非交渉の必須」が未反映
- **PJ 性質との関連**: 公開 + PII 収集 + 有償 → require 該当（legal_required、個人情報保護法の削除・開示請求対応）
- **推奨対策（O54 定石）**:
  1. **in-app セルフサービス全データ削除を実動作化**（delete endpoint + 全ストア purge: Neon 行 + R2 画像の `DeleteObjectCommand`）。R2 残置を防ぐ purge を含める
  2. **開示 = gallery で自分の全作品を閲覧できることで履行**（別途バルク export は必須でない）
  3. **§9 法務文言を是正**: 「運営側で個人を特定できないため、データの確認・削除はアプリ内のセルフサービス機能でご自身で行える / アカウント連携後は窓口でも対応」と正直に明記。**窓口削除を約束しない**
  4. 非アクティブ匿名データの保持期限 / 自動 purge cron
  - **運用者向け admin lookup/delete ツールは作らない**（匿名では特定不能で incoherent）
- **route**: accepted-as-requirement（concept §3 NFR + §8 [論点-004]）。実装は §1.3 に **account（データ管理/削除）機能**を追加して `/flow:feature` で設計 → `/flow:tdd` で実装

#### [SEC-002] 個人情報のログ漏洩（位置情報・写真メタ） (O26_pii_logging, severity=High, legal_required)
- **照合結果**: 部分対応（§3 NFR にフィードバック PII scrub 記載あり、一般ログ/監視の PII マスク未記載）
- **検出根拠**: §3 NFR は「フィードバック送信は PII scrub（O40/O28）」のみ。写真 EXIF の**位置情報** + 課金情報が Sentry エラー/ログに混入しうるが、Sentry `beforeSend` での PII マスク・位置情報をログに出さない方針が未記載
- **PJ 性質との関連**: 公開 + 個人情報扱い → require（legal_required）
- **推奨対策**: Sentry `beforeSend` で email/位置/トークンをマスク。エラーメッセージに DB 内容・写真メタを含めない。アナリティクスイベントに位置/PII を入れない（Vercel Web Analytics は cookieless で匿名 ID）
- **route**: accepted-as-requirement（§3 NFR + §8 [論点-005]）

#### [SEC-003] AI 生成エンドポイントのレート制限（コスト爆発防止） (O27_rate_limit_scope, severity=High)
- **照合結果**: 未対応（生成エンドポイントのレート制限が設計に不在）
- **検出根拠**: §4.6.2 は無料枠超過アラート（事後検知）を持つが、**Gemini 画像生成（高単価）+ Vision を叩くエンドポイントのレート制限が未設計**。§4.3 は Turnstile を「フィードバックフォーム任意」としか位置づけておらず、生成 API の乱用→コスト爆発の防御が薄い
- **PJ 性質との関連**: 公開（単一ユーザー個人ツールではない）→ require。AI API を叩く公開エンドポイント = コスト爆発の温床（O27 notes、§4.6 コスト追跡と連動）
- **推奨対策**: 生成エンドポイントに IP/ユーザー単位レート制限（例: Upstash Ratelimit / Vercel Edge）。ゲストは特に厳しめ（N 回/日）。Turnstile を生成導線にも適用検討。§4.6.2 の事後アラートと二重防御
- **route**: accepted-as-requirement（§3 NFR + §8 [論点-006]）

#### [SEC-004] 認可（所有者チェック / 認可マトリクス） (O23_authorization_check, severity=High)
- **照合結果**: 部分対応（R2 私的バケット + 署名 URL + Clerk セッション + §5「所有権チェック」記載あり、全エンドポイント×全リソースの認可マトリクスは未設計）
- **検出根拠**: §3 NFR / §5 / §1.3.2 auth に所有権の意図はあるが、各 API（取込/生成/ギャラリー/書き出し/削除）で `ownerId = session.userId` を強制する**認可マトリクスが SPEC レベルで未文書化**。後付け実装は漏れやすい
- **PJ 性質との関連**: 複数ユーザー → require
- **推奨対策**: 全 API ルートハンドラで owner resolver（`withOwner`/`requireOwner`）を必須化。R2 署名 URL も所有者のオブジェクトキーのみ発行。feature 設計時に認可マトリクス（エンドポイント×操作×所有者）を文書化
- **route**: accepted-as-requirement（§3 NFR + §8 [論点-007]）

#### [SEC-005] 入力検証（アップロード/テキスト/SSRF） (O24_input_validation, severity=High)
- **照合結果**: 未対応（入力検証スキーマが設計に不在）
- **検出根拠**: 公開 PJ で写真アップロード（ファイル種別/サイズ/枚数）+ テキスト入力（ひとこと/セリフ）の検証スキーマが未記載。AI に写真を渡す経路あり（SSRF 観点）。生成画像/セリフのレンダリングで XSS（セリフを SVG/Canvas に描画 — 焼き込み時はエスケープ）
- **PJ 性質との関連**: 公開 → require
- **推奨対策**: Zod 等で API 入力スキーマ一元化（ファイル MIME/サイズ/枚数上限、テキスト長）。**ユーザー供給 URL を fetch しない**設計を維持（写真は R2 経由、外部 URL 取得時は内部アドレス除外で SSRF 防御）。セリフのアプリ側合成時は適切にエスケープ（[論点-001] と連携）
- **route**: accepted-as-requirement（§3 NFR + §8 [論点-008]）

#### [O25] 秘密情報管理 — 対応済み（finding なし）
- §4.5.3（`.env.example`/`.env.local`/`.gitignore`/pre-commit gitleaks）、§6（API キーはブラウザ非露出・server side）、§10.7（`.env*.local` を gitignore 除外）で網羅。`.gitignore` に `.env*` 追加済み。Vercel `VITE_` プレフィックス注意は実装時に L2 で確認

## 3. §8 未決事項に登録した論点

| 論点 ID | severity | title | status |
|---|---|---|---|
| [論点-004] | Critical | [SEC-001] DSR 履行可能性（ゲスト認証 × 窓口削除） | accepted-as-requirement |
| [論点-005] | High | [SEC-002] PII ログ漏洩（位置情報） | accepted-as-requirement |
| [論点-006] | High | [SEC-003] AI 生成エンドポイントのレート制限 | accepted-as-requirement |
| [論点-007] | High | [SEC-004] 認可マトリクス（所有者チェック） | accepted-as-requirement |
| [論点-008] | High | [SEC-005] 入力検証（アップロード/テキスト/SSRF） | accepted-as-requirement |

## 4. 次のステップ
- **[SEC-001] が最重要**: §1.3 に **account（データ管理/削除）機能フォルダ**を追加し、セルフサービス全データ削除（DB + R2 purge）を `/flow:feature` → `/flow:tdd` で実装。§9 法務文言をゲスト前提に是正（`/flow:concept` update or `/flow:feature legal`）
- SEC-002〜005 は §3 NFR セキュリティ要件として記録済み。各 feature 設計（`/flow:feature`）+ 実装前チェック（`/flow:secure --phase=pre-impl`）で具体化
- 依存スキャン（O28）は実装でロックファイル生成後に `/flow:secure --phase=deps`
- 実装後に Anthropic `security-review` スキル（L3）
- CI に npm audit / Dependabot 組み込み（L4-cont）
<!-- auto-generated-end -->
