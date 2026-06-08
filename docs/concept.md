# 道草コミック

> **一行で言うと**: 散歩や通勤で見つけた何でもない街の風景を、スマホから AI 補助で 4 コマ漫画に仕立てて残す・分かち合う。

| 項目 | 内容 |
|---|---|
| ユーザー | 絵心はないけど「この光景ちょっと面白い」と感じる散歩・道草好きの一般の人 |
| 解決する課題 | 街で見かけた小さな面白さが「写真だけ」では埋もれて見返さない／漫画化したいが絵が描けず既存アプリは重い |
| 提供価値 | 素人の道草をワンタップで気軽に 4 コマ化して残す軽量な受け皿。作品性より「気軽さ・面白がり」 |
| 現フェーズ | 企画 → MVP（初版 concept 作成） |
| 最終更新 | 2026-06-09 |

> **source_wants**: `./wants.md`（idea_id I20260522-025 / batch 20260522_001、飛地スコア 20.3、charter 適合: PWYW / social_good=3 / excluded_check=passed）

---

## 1. プロダクト概要

道草コミックは、散歩・通勤・道草の途中で見つけた「何でもないけどちょっと面白い街の風景」（看板のミス、行列、季節の風景、猫など）を、撮った写真からスマホ上で気軽に 4 コマ漫画へ仕立てて残すための軽量 PWA。絵心がなくても、写真を 1〜数枚選んでひとこと添えるだけで、AI が 4 コマ構成（コマ割り + セリフ案 + 絵柄 stylize）を提案する。作った 4 コマはギャラリーに時系列・エリア別に蓄積され、家族 LINE やゆるい SNS にも書き出してシェアできる。プロ向けの本格マンガ制作機能は持たず、「日常を面白がる」前向きな創作体験に振り切る。

### 1.1 主要ユースケース
1. **撮る → 4 コマ化**: 散歩中に撮った写真を 1〜数枚選び、ひとこと添える → AI が 4 コマ構成（コマ割り + セリフ案 + 絵柄）を提案 → 採用 or 微修正して保存。**セリフ・吹き出し・コマ枠はアプリ側で SVG/Canvas オーバーレイ合成**し、AI には各コマの絵柄 stylize までを担わせる（日本語描画の安定性・微修正容易性・生成コスト低減のため。[論点-001] で最終線引きを /flow:design にて確定）
2. **振り返る**: 保存した 4 コマをマイギャラリーで時系列・エリア別に振り返る
3. **分かち合う**: 気に入った 1 本を画像として書き出し、家族 LINE や SNS にシェア（OS 標準シェア / 画像書き出し。外部 SNS 直接 API 連携は初期スコープ外）
4. **まとめる**: 月末に「今月の道草」をまとめて眺める（自動コレクション）
5. **（任意）残す・印刷**: 高画質版を 1 作品単位で書き出して保存・印刷（PWYW 課金導線）

> **AI 価値検証観点（汎用 AI 直叩きとの差別化）**: 汎用画像生成 AI に「4 コマにして」と頼むよりも、(a) **ドメイン知識の組み込み**＝写真→コマ割り構成の型を持つ、(b) **UI 統合 + 文脈収集**＝結果がギャラリーに蓄積され街・日付・場所の文脈が紐づいて振り返れる、(c) **出力後処理**＝アプリ側でセリフ/吹き出しを編集可能な形に組み込む、点で体験を専用化する。差別化根拠は (b)(c)(e=UI 統合) に該当（perspectives O 系の差別化軸 a/b/c/d/e のうち b,c,e）。

### 1.2 スコープ
**含むもの**:
- 写真取り込み + ひとこと → AI 4 コマ生成（絵柄 stylize）+ アプリ側セリフ/吹き出し合成 + 微修正 + 保存
- マイギャラリー（時系列・エリア別）、月次自動コレクション
- 画像書き出し + OS 標準シェア、高画質書き出しの PWYW 課金
- ゲスト開始 → 課金/他端末同期時に段階認証（Clerk）

**含まないもの（明示除外）**:
- プロ/同人向けの本格マンガ制作機能（多ページ・トーン・ペン入れ等）
- 外部 SNS への直接 API 投稿連携（初期は OS 標準シェア / 画像書き出しのみ）
- コマ数可変の長編・ストーリー連載
- ユーザー間ソーシャル（フォロー・いいね数競争・公開タイムライン）— charter §2.2 中毒/競争回避

### 1.3 ドキュメントフォルダ分割設計

> ここで設計するのは `docs/` 配下の**ドキュメント置き場**の構造であり、実装コード（`src/`）の構造ではない（§1.4 参照）。

#### 1.3.1 機能フォルダ（業務ドメイン別）

| フォルダ | 含む機能 | 担当する画面 / API | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/capture/ | 写真取り込み + ひとこと添え + メタ（日付/位置/エリア）付与 | 撮影/取込画面・アップロード API | _shared/storage, _shared/auth, _shared/db | 3 | ❌ |
| docs/compose/ | AI 4 コマ生成（コマ割り提案 + セリフ案 + 絵柄 stylize）+ アプリ側セリフ/吹き出し合成 + 微修正 + 保存 | 生成・編集画面・生成 API | _shared/ai, _shared/storage, _shared/db, capture | 4 | ❌ |
| docs/gallery/ | マイギャラリー（時系列・エリア別振り返り） | ギャラリー一覧・詳細画面 | _shared/db, _shared/storage, _shared/auth | 4 | ❌ |
| docs/collection/ | 月末「今月の道草」自動コレクション | コレクション画面・集計バッチ | _shared/db, gallery | 5 | ❌ |
| docs/share/ | 画像書き出し + OS 標準シェア（合成画像レンダリング） | シェアシート・書き出し処理 | gallery, _shared/storage | 5 | ❌ |
| docs/export/ | 高画質書き出し + PWYW 課金導線（買い切り/投げ銭） | 課金・書き出し画面・Stripe 連携 | gallery, _shared/payments, _shared/storage | 5 | ❌ |
| docs/feedback/ | 好き嫌いリアクション + バグ報告ウィジェット（PII scrub）| フィードバック UI・送信 API | _shared/auth | 5 | ❌ |
| docs/legal/ | プライバシーポリシー / 利用規約 / 特商法表記の公開ページ | /legal/* 静的ページ | （なし） | 3 | ❌ |
| docs/account/ | アカウント/データ管理（ゲスト→連携の段階認証 UI、**セルフサービス全データ削除 = Neon 行 + R2 画像 purge**、開示=自分の全データ閲覧、AI 同意 ON/OFF）[SEC-001/O54 由来] | アカウント/設定/削除画面・削除 API・purge cron | _shared/auth, _shared/db, _shared/storage, gallery | 5 | ❌ |

#### 1.3.2 横断フォルダ（_shared/*）

| フォルダ | 責務 | 含む設計 | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/_shared/types/ | 共通型定義 | 作品/コマ/写真/ユーザー/課金の型 | （なし） | 1 | ✅ |
| docs/_shared/helpers/ | ヘルパ・ユーティリティ | 日付・エリア解決・画像リサイズ/EXIF・バリデーション | （なし） | 1 | ✅ |
| docs/_shared/db/ | DB スキーマ・マイグレーション | Neon Postgres + Drizzle スキーマ/制約/index | （なし） | 1 | ✅ |
| docs/_shared/auth/ | 認証・認可基盤 | Clerk ゲスト→段階認証・セッション・所有権制御 | _shared/db | 2 | ✅ |
| docs/_shared/storage/ | 画像ストレージ | Cloudflare R2（S3 互換）アップロード/署名 URL/キー設計 | _shared/db, _shared/types | 2 | ✅ |
| docs/_shared/ai/ | 外部 AI クライアントラッパ | OpenAI Vision（写真理解）+ Gemini 2.5 Flash Image（4 コマ生成）+ プロンプト/フォールバック | _shared/types, _shared/cost-tracking | 2 | ✅ |
| docs/_shared/cost-tracking/ | 外部 API コスト積算 | 呼び出しログ積算 + .env 単価 + 概算コスト + 無料枠アラート（§4.6.2） | _shared/db | 2 | ✅ |
| docs/_shared/payments/ | 課金基盤 | Stripe 単発（PWYW 買い切り/投げ銭）+ Webhook 署名検証 | _shared/db, _shared/auth | 3 | ✅ |
| docs/_shared/app-shell/ | **アプリ合成レイヤ**（部品を動く・デプロイ可能なアプリに組み立てる） | 合成ルート（main/App/router/providers）+ UI↔data 配線 + API ルートハンドラ層 + Clerk セッション確立 + PWA/deploy scaffold | **全 feature + _shared 全部** | **9（最後）** | ❌ |

> **⚠️ 合成レイヤ（app-shell）を必ず立てる（perspectives O57）**: features（葉）と _shared/db・auth 等（根）だけだと部品しか設計されず、全部品を 1 つの動く・デプロイ可能な PWA に組み立てる target が誰の担当でもなくなる。app-shell を §1.3.2 の最終 target（優先度 9 = 最後）として立て、全機能 + 全 _shared に依存させる。

#### 1.3.3 依存・優先度・基盤の定義
- **依存**: そのフォルダが先に必要とする他フォルダ。循環依存なし（検出済）
- **優先度**: topological sort 順（小さいほど先）。1 = 依存なし、9 = 全依存（app-shell）
- **基盤**: 横断は全て ✅。app-shell は合成 target のため最後だが基盤ではない（❌）

#### 1.3.4 優先度算出メモ
- 優先度 1: types / helpers / db（依存なしの根）
- 優先度 2: auth / storage / ai / cost-tracking（db・types に依存）
- 優先度 3: payments / capture / legal
- 優先度 4: compose / gallery
- 優先度 5: collection / share / export / feedback / account（[SEC-001] DSR 履行、O54）
- 優先度 9: app-shell（全依存、常に最後 — O57）
- 循環依存: なし

#### 1.3.5 命名規約
- 機能フォルダ: ケバブケース業務名（`capture`, `compose`）
- 横断フォルダ: `_shared/<技術領域>/`

### 1.4 実装コードフォルダ構成（たたき台）

> Q11 確定スタック（Vite + React + TypeScript PWA / Vercel Functions / Neon + Drizzle / R2 / Clerk / Gemini）に整合。あくまでたたき台。機能境界の名前は §1.3 と揃える。

```
src/
  features/            # 機能単位（§1.3 機能フォルダと命名統一）
    capture/
    compose/
    gallery/
    collection/
    share/
    export/
    feedback/
  components/          # 共通 UI 部品（shadcn/ui ベース）
  hooks/              # 共通フック（TanStack Query 等）
  lib/                # ユーティリティ（helpers 相当）
  services/           # 外部クライアントラッパ（ai / storage / payments / cost-tracking）
  db/                 # Drizzle スキーマ・クライアント（_shared/db 相当）
  types/              # 共通型
  routes/ or pages/   # ルーティング（PWA）
api/                  # Vercel Functions（生成 / アップロード / Stripe Webhook 等）
public/               # PWA manifest / service worker / アイコン
```

- 機能単位は名前を揃える（`docs/capture/` ↔ `src/features/capture/`）
- 横断は実装上 `src/lib/` `src/services/` `src/db/` `src/types/` に分散（言語慣習）

## 2. 前提条件・制約
- **業務前提**: 1 人開発の個人マイクロサービス。MVP 1〜2 ヶ月。商用化は任意支援（PWYW）位置づけで BEP を設けない
- **技術制約**: 無料枠厳守（Neon / Vercel Hobby / Clerk Free / R2 無料 / Sentry Free）。AI 生成は従量課金、1 作品あたり単価管理が要
- **体制・予算・納期**: 1 人、初期コスト極小、AI 従量 + 月固定費ゼロ（Stripe 手数料のみ）

## 3. 非機能要件

| 項目 | 目標値 | 根拠 |
|---|---|---|
| 性能 | 画像生成は非同期・数十秒待ち許容。待ち時間 UX を丁寧に（進捗/プレースホルダ） | wants NFR。生成は重い処理 |
| 可用性 | 個人サービス水準（SLA なし、ベストエフォート） | 1 人開発・無料枠 |
| セキュリティ | 投稿写真・生成画像は本人領域に保存（R2 私的バケット + 署名 URL）。公開はオプトイン。AI 送信前に位置/PII を扱う方針を明示。フィードバック送信は **PII scrub**（O40/O28） | wants セキュリティ + perspectives |
| 運用・監視 | Sentry でエラー監視。AI 呼び出しを自前積算（§4.6.2）+ 無料枠 80/100/120% アラート | §4.6 |
| スケール上限 | 同時数十〜数百を上限想定。重い同時生成は前提にしない（生成はキュー/レート制御） | wants 想定同時利用者数 |
| 出力品質 | 「4 コマらしさ」と絵柄一貫性の安定。解像度段階化でコスト/品質バランス（[論点-002]） | wants リスク |
| 権利配慮 | 取り込み写真の著作権/肖像権、生成物の権利帰属、シェア時注意喚起（[論点-003]、§9 連携） | wants 重点リスク |

<!-- auto-generated-start -->
### 3.X セキュリティ要件（auto-added by /flow:secure 2026-06-09）

> `/flow:secure --phase=design` の L1 設計レビューで検出した Critical/High を要件として追記。詳細は `SECURITY_REVIEW_20260609.md`、追跡は §8 [論点-004..008]。

- **[SEC-001] DSR 履行可能性（Critical, legal_required, O54）**: ゲスト/匿名認証では運営が本人特定不能。**in-app セルフサービス全データ削除（Neon 行 + R2 画像 purge）を非交渉の必須機能とする**。開示は gallery の自分の全作品閲覧で履行。§9 法務文言は「運営側で個人を特定できないためアプリ内セルフサービスで完結 / 連携後は窓口対応」と正直に明記し**窓口削除を約束しない**。非アクティブ匿名データの保持期限/自動 purge。運用者向け削除ツールは作らない（匿名で incoherent）
- **[SEC-002] PII ログ漏洩防止（High, legal_required, O26）**: Sentry `beforeSend` で email/**位置情報(写真 EXIF)**/トークンをマスク。エラー/ログ/アナリティクスに位置・PII を出さない（Vercel Web Analytics は匿名 ID）
- **[SEC-003] AI 生成エンドポイントのレート制限（High, O27）**: Gemini 画像生成 / Vision を叩く公開エンドポイントに IP/ユーザー単位レート制限（ゲストは厳しめ）。コスト爆発防止（§4.6.2 事後アラートと二重防御）。生成導線への Turnstile 適用検討
- **[SEC-004] 認可マトリクス（High, O23）**: 全 API ルートで owner resolver（`withOwner`/`requireOwner`）必須、`ownerId = session.userId` 強制。R2 署名 URL は所有者キーのみ発行。feature 設計時に認可マトリクス文書化
- **[SEC-005] 入力検証（High, O24）**: Zod 等で API 入力スキーマ一元化（写真 MIME/サイズ/枚数上限、テキスト長）。ユーザー供給 URL を fetch しない（SSRF）。セリフのアプリ側合成時はエスケープ
<!-- auto-generated-end -->

## 4. 全体アーキテクチャ

```
[スマホ PWA (Vite+React+TS)]
   │  撮影/取込 → R2 署名 URL アップロード
   │  生成リクエスト
   ▼
[Vercel Functions (api/)]
   ├─ Clerk セッション検証（ゲスト/認証）
   ├─ _shared/ai: OpenAI Vision (写真理解) + Gemini 2.5 Flash Image (4 コマ絵柄生成)
   ├─ _shared/cost-tracking: 呼び出しログ積算 → Neon
   ├─ _shared/storage: Cloudflare R2 (画像本体)
   ├─ _shared/payments: Stripe 単発 Webhook
   ▼
[Neon (Postgres) + Drizzle]  … 作品/コマ/写真メタ/コスト/課金
[Cloudflare R2]              … 写真原本・生成コマ画像・書き出し画像
```

### 4.1 主要コンポーネント
| 名前 | 責務 | 技術領域（例示） |
|---|---|---|
| PWA フロント | 撮影/取込・生成 UI・セリフ合成・ギャラリー | Vite + React + TS + shadcn/ui + TanStack Query |
| API 層 | 生成・アップロード・課金・コスト記録 | Vercel Functions（サーバーレス） |
| AI ラッパ | 写真理解 + 4 コマ生成 + フォールバック | OpenAI Vision / Google Gemini |
| データ層 | メタデータ永続化 | Neon (Postgres) + Drizzle |
| ストレージ | 画像本体（私的 + 署名 URL）| Cloudflare R2 |
| 認証 | ゲスト→段階認証・所有権 | Clerk |
| 課金 | PWYW 単発 | Stripe |

### 4.2 技術スタック（方向性）
- フロント: PWA SPA（例: Vite + React + TypeScript + shadcn/ui + Tailwind）
- バック: サーバーレス関数（例: Vercel Functions）
- データ層: マネージド Postgres + 型安全 ORM（例: Neon + Drizzle）/ オブジェクトストレージ（例: Cloudflare R2）
- 外部 AI: 写真理解 Vision + 画像生成（例: OpenAI Vision + Google Gemini 2.5 Flash Image）
- インフラ: ホスティング一体（例: Vercel Hobby）
- 監視・ログ: エラー監視（例: Sentry）+ cookieless アナリティクス（例: Vercel Web Analytics）+ 自前コスト積算

### 4.3 リソース選定たたき台

> 各サービスの pricing は変動。採用判断時は必ず最新の公式 pricing を確認。

| カテゴリ | 推奨具体名 | 代替候補 | 選定根拠 | 想定単価 (USD/月、桁感) |
|---|---|---|---|---|
| フロント FW | Vite + React + TS（PWA） | Next.js | preferences §2.1（6 PJ）/ SPA 主体・SEO は LP のみ | $0 ※ {{2026-06 時点想定、最新 pricing 要確認}} |
| UI | shadcn/ui + Tailwind | MUI | preferences §2.14（7 PJ）/ やわらか路線にも好適 | $0 ※ {{2026-06 時点想定、要確認}} |
| 状態/データ取得 | TanStack Query | SWR | preferences §2.15（3 PJ）/ 生成ポーリングに好適 | $0 ※ {{2026-06}} |
| バック | Vercel Functions | Cloudflare Workers | preferences §2.2（6 PJ）/ ホスティング一体 | $0（Hobby 内） ※ {{2026-06、要確認}} |
| DB | Neon (Postgres) | Supabase(NG) | preferences §2.3 / charter §0 / 無料 10 DB | $0（Free） ※ {{2026-06、要確認}} |
| ORM | Drizzle | Prisma | preferences §2.13（6 PJ） | $0 ※ {{2026-06}} |
| ストレージ | Cloudflare R2 | Vercel Blob / S3 | エグレス無料・10GB 無料・画像主体に有利 | $0〜$5 ※ {{2026-06、要確認}} |
| 認証 | Clerk | Auth.js | preferences §2.4（6 PJ）/ ゲスト→段階認証 O22 | $0（Free 10k MAU） ※ {{2026-06、要確認}} |
| 写真理解 AI | OpenAI gpt-4o-mini Vision | Gemini Vision | preferences §2.10 / 安価・store=false | 〜$10（従量、利用次第） ※ {{2026-06、要確認}} |
| 画像生成 AI | Gemini 2.5 Flash Image | OpenAI gpt-image-1 / Replicate | 複数画像一貫性・低単価・参照編集（[D20260609-002]） | $10〜$50（従量、生成数次第） ※ {{2026-06、要確認・単価桁感は要検証}} |
| 決済 | Stripe（単発） | Paddle | preferences §2.19 / 月固定費ゼロ・手数料のみ | $0 + 従量手数料 ※ {{2026-06}} |
| 監視 | Sentry (Free) | — | preferences §2.6（7 PJ） | $0（5K events/月） ※ {{2026-06、要確認}} |
| アナリティクス | Vercel Web Analytics (cookieless) | PostHog | consent 不要・公開 LP 流入計測 | $0（Hobby） ※ {{2026-06、要確認}} |
| CI/CD | GitHub Actions + Vercel Preview | — | preferences §2.8（7 PJ） | $0 ※ {{2026-06}} |
| メール（任意） | Resend | — | 月次まとめ通知等が要る場合のみ（MVP 不要） | $0（3,000 通/月） ※ {{2026-06、要確認}} |
| ドメイン | 既存ドメインのサブドメ運用 | 新規取得 | perspectives O29 / 撤退リスク最小 | $0〜$15/年（既存なら $0） ※ {{2026-06}} |

> **同時稼働マイクロサービス数**: 連発前提（charter §0）。Neon でサービスごとに DB 完全分離。Supabase 無料 2 プロジェクト制約は採用しないことで回避済。

### 4.4 想定コストサマリ

| 区分 | 月額目安 (USD) | 内訳の例 |
|---|---|---|
| 個人・無料枠 | $0〜$20 | Neon Free + Vercel Hobby + Clerk Free + R2 無料 + Sentry Free + **AI 従量（低利用時）** |
| PoC・小規模公開 (DAU 〜100) | $20〜$80 | 上記 + AI 生成従量増 + R2 容量/転送増 |
| 中規模 (DAU 1,000〜) | $100〜$500+ | AI 生成コストが支配的（解像度段階化・キャッシュで抑制必須）+ R2 容量増 |

**本プロジェクトのレンジ**: **個人・無料枠厳守**（根拠: 1 人開発・MVP・PWYW 任意支援）。固定インフラは無料枠内に収め、**変動費は AI 生成のみ**。AI コストは §4.6.2 で自前積算し、無料枠超過に近づいたら §4.3 代替候補（解像度段階化 / 生成回数上限 / Replicate へ切替）で対応。月固定費は Stripe 手数料を除きゼロを維持。

### 4.5 ローカル開発環境計画

#### 4.5.1 開発スタイル
**サーバーレス emulation 中心 + 外部 BaaS は実サービス接続**。Vite dev server（フロント）+ `vercel dev`（Functions emulation）。Neon / R2 / Clerk / AI はキー注入で実サービスに接続（軽量、ローカル docker 不要）。

**本 PJ の選定**: サーバーレス emulation（コンテナ不要寄り）
**理由**: BaaS（Neon / R2 / Clerk）採用で重いローカルスタック不要。Vite + `vercel dev` で十分。

#### 4.5.2 必要サービス（ローカル）
| サービス | 役割 | ローカル起動方式 | ポート | 永続化 |
|---|---|---|---|---|
| Vite dev | フロント | `npm run dev` | 5173 | host-fs |
| Vercel Functions | API emulation | `vercel dev` | 3000 | — |
| Neon | DB | クラウド実接続（dev ブランチ推奨） | — | クラウド |
| Cloudflare R2 | 画像 | クラウド実接続（dev バケット） | — | クラウド |
| Clerk | 認証 | クラウド実接続（dev インスタンス） | — | クラウド |

#### 4.5.3 環境変数・シークレット管理
- `.env.example`（ダミー値・コミット可）/ `.env.local`（実値・`.gitignore` 必須）
- 平文コミット禁止: Clerk Secret / Neon URL / R2 アクセスキー / OpenAI / Gemini キー / Stripe Secret・Webhook 署名
- pre-commit hook（gitleaks/detect-secrets 推奨）で誤コミット検知

#### 4.5.4 起動・停止コマンド
| 操作 | 抽象表現 | 例 |
|---|---|---|
| 起動 | 全サービス起動 | `./scripts/dev.sh`（Vite + vercel dev）|
| 停止 | 全停止 | Ctrl+C / `./scripts/stop.sh` |
| DB マイグレーション | スキーマ適用 | `npm run db:migrate`（Drizzle） |
| リセット | dev DB リセット | Neon dev ブランチ再作成 |

#### 4.5.5 留意点
- 初回: 依存インストール + Neon dev ブランチ + R2 dev バケット + Clerk dev インスタンス作成
- スマホ実機確認: WSL2 は port-forward / firewall 設定（/flow:release Phase 2 で案内）
- AI 生成はキー必須なので、生成系は実キー注入後に確認（無料枠/コスト注意）

#### 4.5.6 CI/CD との関係
- CI（GitHub Actions）: lint / typecheck / unit。E2E はローカル headless（/flow:e2e）
- 本番との差異: AI はモック可（生成テストは実呼び出しを最小化）

### 4.6 コスト・収益追跡と継続判断ループ

#### 4.6.1 PJ 性質別の必要レベル
**本 PJ の該当レベル**: **個人ツール / 無料枠**（コスト追跡 ✅必須 / 無料枠超過アラート ✅必須 / 収益指標 ❌不要 / BEP ❌不要 / レビュー 四半期推奨 / 撤退判断 必須 / 判断主体 本人）

#### 4.6.2 コスト集計メカニズム（必須）
外部請求ダッシュボードは遅延があるため、**システム内部で能動的に積算**:
1. **呼び出しログ積算**: Gemini 画像生成（生成枚数/解像度）、OpenAI Vision（リクエスト/トークン）、R2（アップロード回数/バイト）を 1 件ごとに Neon の専用テーブルへ記録
2. **単価表は `.env` で管理**（ハードコード禁止、変更日も記録）:
   ```
   COST_GEMINI_IMAGE_PER_GEN=<USD>          # 要確認
   COST_OPENAI_GPT4O_MINI_PER_1K_INPUT=0.00015
   COST_OPENAI_GPT4O_MINI_PER_1K_OUTPUT=0.0006
   COST_R2_STORAGE_PER_GB_PER_MONTH=0.015
   COST_R2_CLASS_A_PER_1K_OPS=0.0045
   ```
3. **概算コスト算出**: `ログ件数 × 単価`、機能別/日次・月次集計
4. **精度検証**: 月次で外部請求と突合、誤差 >10% で単価再調査
5. **アラート閾値**: 無料枠/予算の 80% / 100% / 120% で通知

#### 4.6.3 追跡するコスト指標
| 指標 | 集計頻度 | 集計元 |
|---|---|---|
| 画像生成コスト（Gemini） | 日次/月次 | 内部ログ × .env 単価 |
| Vision コスト（OpenAI） | 日次/月次 | 内部ログ × .env 単価 |
| R2 ストレージ/転送 | 日次 | R2 ダッシュボード + 自前ログ |
| インフラ総額（合算） | 月次 | 上記合算 |

#### 4.6.4 収益指標
**本 PJ では不要**（PWYW 任意支援、BEP を設けない）。将来商用化判断時に §4.6.4 を有効化。

#### 4.6.7 継続 / 縮退 / 撤退判断基準
| 判断 | 基準 | 対応 |
|---|---|---|
| 継続 | AI 含む総コストが無料枠 + 許容従量内、自分が使っている | 通常運用 |
| 縮退 | 生成コストが許容超過 | 解像度段階化 / 生成回数上限 / Replicate 切替（[論点-002]） |
| 撤退 | 無料枠超過の代替も無く、利用も低調 | §4.7.5 撤退手順（registry status=retired） |

**本 PJ の撤退基準**: 月 AI コストが個人許容（例: 数千円）を継続超過し、かつ高画質書き出し課金で回収できず、自分の利用も止まったとき。

#### 4.6.8 判断主体
本人。判断ログは AI_LOG / 運用メモに記録。

### 4.7 公開戦略・ドメイン・リバースプロキシ（perspectives O29）

#### 4.7.1 ドメイン情報
- **既存ドメイン**: 要確認（あれば `michikusa.<existing-domain>` サブドメ運用を推奨、撤退時 DNS 1 行削除）。無ければ MVP は `michikusa-comic.vercel.app`（PaaS デフォルト）で開始
- **本サービスの公開 URL**: サブドメ運用 or vercel.app（検証段階）

#### 4.7.2 公開構成パターン
**採用: (A) PaaS 完結**（Vercel フロント + Functions、Neon / R2 / Clerk は BaaS）。運用負担ゼロ、リバースプロキシ不要。

#### 4.7.3 リバースプロキシ
**なし**（PaaS 完結）。SSL は Vercel 自動。

#### 4.7.5 撤退時の手順
1. ユーザーに事前通知（アプリ内バナー）
2. データエクスポート機能提供（自分の作品を画像 ZIP で持ち出し）
3. Stripe 単発のため課金停止は不要（サブスクなし）
4. DNS レコード削除（サブドメ運用時）/ vercel.app は project 削除
5. R2 バックアップを 6 ヶ月保管 → DB / バケット削除
6. registry の adopted_pj を status=retired に更新（将来）

### 4.8 サービス公開周知 / マーケティング戦略（perspectives O31）

#### 4.8.1 チャネル使い分け（本 PJ 確定）
| 優先度 | チャネル | 本 PJ の採用 |
|---|---|---|
| ★★★ 必須 | 製品内グロース（作った 4 コマを書き出してシェア）+ SEO/ASO | 採用（§4.8.2 / §4.8.3） |
| ★★★ 必須 | note（汎用ブログ、月 1 記事目安） | 採用 |
| ★★ 推奨 | 一般 SNS（視覚映え）: Instagram / X | X を軸（既存）+ ビジュアルは Instagram 検討 |
| ★ 既存維持 | X 開発者クラスタ（Build in Public） | 既存活動継続 |

#### 4.8.2 製品内グロース設計（★、§1.1 UC3/UC5 に反映）
- **シェアしたくなる成果物**: 1 本の 4 コマ画像 / 月次「今月の道草」まとめ
- **シェア導線**: 強制シェアモーダルは置かない（charter §2.2）。書き出し画像末尾に控えめにサービス名 + URL。OG カード動的生成
- **UGC 外部流出**: 家族 LINE / Instagram に 4 コマが流れ「これ何のアプリ?」と聞かれる構造
- **アンチパターン回避（NG）**: シェアでガチャ/特典解放、強制シェア、招待数ランキング、数字煽り

#### 4.8.3 SEO / ASO
- 狙うキーワード: 「散歩 記録 アプリ」「写真 4コマ」「日常 漫画 作る」等ロングテール
- 技術 SEO: OGP/JSON-LD、sitemap、Core Web Vitals、モバイル対応（公開 LP は SEO 重視で Next.js 化も検討 — preferences §3.1 条件分岐）

#### 4.8.4 Build in Public ストーリー軸
- 「AI 駆動で週 1 ペースの新サービス公開」「散歩を漫画にする小さな道具を作る」過程を素材化

#### 4.8.5 OGP / Twitter Card
- `og:title/description/image/url` 全設定、`twitter:card=summary_large_image`、動的 OG（生成した 4 コマをサムネに）

#### 4.8.7 コンテンツペース
- 最小: 月 1 note + 週 1 X。疲弊しない継続を優先。

## 5. データ設計（高レベル）

### 5.1 主要エンティティ
- **user**: Clerk user（ゲスト/認証）、所有権の主体
- **photo**: 取り込み写真（R2 キー、撮影日時、位置/エリア、EXIF メタ、ひとこと）
- **comic**: 4 コマ作品（タイトル、作成日時、エリア、状態=draft/saved、元 photo 参照）
- **panel**: 各コマ（comic への FK、順序 1-4、生成画像 R2 キー、セリフテキスト、吹き出し配置 JSON）
- **collection**: 月次自動コレクション（年月、含む comic の集合）
- **ai_cost_log**: 外部 API 呼び出し積算（provider、metric、数量、概算コスト、単価バージョン、日時）
- **payment**: Stripe 単発（買い切り/投げ銭、金額、対象 comic、status）
- **feedback**: 好き嫌い + バグ報告（画面/version/UA、PII scrub 済本文）

> **監査ログ**: 単一ユーザー個人ツール主体のため共同編集監査は不要。所有権チェックで足りる（Q12.7(4) 非該当）。

### 5.2 データフロー
取込写真 → R2 アップロード（署名 URL）+ photo メタ → Vision で写真理解 → Gemini で 4 コマ絵柄生成 → panel 画像を R2 へ → アプリ側でセリフ/吹き出し合成 → comic 保存 → ギャラリー表示 → 書き出し（R2 合成画像）→ シェア。各 AI 呼び出しは ai_cost_log に積算。

## 6. 外部連携

| 連携先 | 用途 | 方式 | 認証 |
|---|---|---|---|
| OpenAI（Vision） | 取り込み写真の理解（被写体/状況把握→コマ割り素材） | REST API（server side） | API キー（.env、ブラウザ非露出、store=false） |
| Google Gemini 2.5 Flash Image | 4 コマ各コマの絵柄 stylize 生成 | REST API（server side） | API キー（.env、ブラウザ非露出） |
| Cloudflare R2 | 写真原本・生成画像・書き出し画像の保管 | S3 互換 API + 署名 URL | アクセスキー（.env） |
| Clerk | 認証（ゲスト→段階認証） | SDK | Publishable / Secret |
| Stripe | PWYW 単発決済 | SDK + Webhook | API キー + Webhook 署名 |
| Vercel Web Analytics | cookieless 流入計測 | SDK | プロジェクト紐付け |
| Sentry | エラー監視 | SDK | DSN |

> **外部 AI サービス利用: あり**（Q12.5 で「使う」と明示確認、本サービスの核）。プライバシー方針: 写真・生成画像は本人領域（R2 私的バケット）に保存、AI 送信は機能上必須だが学習拒否オプション（OpenAI store=false 等）を使用。AI 利用は本サービスの中核機能のため ON/OFF トグルは設けず、プライバシーポリシーで AI 送信を明示し同意取得（[論点-003] と連携）。フォールバック: 生成 API ダウン/レート超過時は「時間をおいて再試行」を案内し下書き保持。
>
> **アナリティクス・計測ツール利用: あり**（Q12.6 で「使う」と明示確認）。Vercel Web Analytics は cookieless のため consent banner 不要。AI コストは自前積算（§4.6.2）。GDPR/個人情報保護法: 日本国内主体想定、写真メタの位置情報は本人領域に留め第三者提供しない。

## 7. 決定事項ログ

| 日付 | 決定内容 | 根拠 | 影響セクション | decision_id |
|---|---|---|---|---|
| 2026-06-09 | データ層 = Neon (Postgres) + Drizzle + Cloudflare R2 | 設計判断 / preferences charter §0 | §4.3 §5 | [D20260609-001](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | 4 コマ画像生成 = Gemini 2.5 Flash Image | Q12.5 | §4.3 §6 | [D20260609-002](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | 日本語セリフ = アプリ側オーバーレイ合成 | 自動判断 | §1.1 §5 | [D20260609-003](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | デザイン方向 = やわらか・温かみ・遅い遊び心 | Q12.12 | §1 / design | [D20260609-004](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | 認証 = Clerk ゲスト→段階認証 | Q12.7(1) | §4.1 | [D20260609-005](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | 収益 = PWYW / Stripe 単発 | charter §1 | §4.6 export | [D20260609-006](./AI_LOG/D20260609_001_concept_initial.md#decisions) |
| 2026-06-09 | アナリティクス = Vercel Web Analytics + 自前コスト積算 | Q12.6 | §4.6 §6 | [D20260609-007](./AI_LOG/D20260609_001_concept_initial.md#decisions) |

## 8. 未決事項（論点リスト）

### [論点-001] セリフ/コマ割りの「画像焼き込み」vs「アプリ合成」最終線引き
- **影響範囲**: compose / share / _shared/ai / design
- **詰めるべき問い**: どこまでを AI 生成画像に含め、どこからアプリ側 SVG/Canvas 合成にするか（吹き出し形状、コマ枠、フォント、書き出し時のレンダリング）
- **候補案**:
  - 案 A: AI は各コマ絵柄のみ、コマ枠/吹き出し/セリフは全てアプリ合成 ／ 利点: 日本語安定・編集容易・低コスト ／ 欠点: 合成 UI 実装量増
  - 案 B: AI に簡易コマ割り含む 1 枚生成、セリフのみアプリ ／ 利点: 合成簡素 ／ 欠点: コマ割り固定化・編集しづらい
- **推奨**: 案 A（[D20260609-003] と整合）。理由: 微修正容易・コスト低・日本語可読性
- **判断期限**: Phase 1.5 /flow:design
- **担当**: 本人

### [論点-002] 1 作品あたり生成コスト上限・解像度段階化・キャッシュ方針
- **影響範囲**: _shared/ai / _shared/cost-tracking / compose / export
- **詰めるべき問い**: プレビューは低解像度、高画質書き出し時のみ高解像度再生成にするか／生成回数上限／同一写真の再生成キャッシュ
- **候補案**:
  - 案 A: 2 段階（プレビュー低解像度 → 課金時高解像度）／ 利点: コスト圧縮 ／ 欠点: 二度生成
  - 案 B: 一律標準解像度 + 書き出しはアップスケール ／ 利点: 生成 1 回 ／ 欠点: 画質頭打ち
- **推奨**: 案 A。理由: PWYW 回収導線（高画質書き出し）とコスト管理が両立
- **判断期限**: compose / export の /flow:feature 設計時
- **担当**: 本人

### [論点-003] 取り込み写真の著作権・肖像権・生成物の権利帰属 + シェア時注意喚起
- **影響範囲**: §3 NFR / §9 法務 / capture / share / legal
- **詰めるべき問い**: 第三者・店舗看板・通行人・商標が写る写真の扱い、生成物の権利帰属（ユーザー帰属を規約明記）、シェア前の注意喚起 UI の要否・文言
- **候補案**:
  - 案 A: 利用規約で「アップロードは自己責任・第三者権利に配慮」、シェア前に軽い注意喚起 + 生成物はユーザー帰属を明記 ／ 利点: 実装軽・明確 ／ 欠点: 自動検出はしない
  - 案 B: 顔/商標の自動ぼかし機能を追加 ／ 利点: 安全側 ／ 欠点: MVP には重い
- **推奨**: 案 A（MVP）、案 B は v2 論点。理由: 個人 MVP で実装コストと安全性のバランス
- **判断期限**: legal / capture の設計時（§9 と同期）
- **担当**: 本人

### [論点-004] [SEC-001] DSR（開示・削除請求）の履行可能性 — ゲスト認証 × 窓口削除: Critical
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-09 open → 2026-06-09 accepted-as-requirement（/flow:secure design、§3.X SEC-001 に要件化）
- **影響範囲**: §1.1 / §1.3（account 機能追加） / §3 NFR / §5 / §9
- **観点 ID**: O54_dsr_fulfillment_operability（legal_required）
- **severity**: Critical
- **検出根拠**: §9 がゲスト認証下で「開示請求窓口」を約束しているが運営は本人特定不能。§1.3 にセルフサービス削除導線が不在
- **詰めるべき問い**: (1) account（データ管理/削除）機能を §1.3 に追加するか（推奨: する）(2) §9 文言をゲスト前提に是正するか（推奨: する）
- **推奨**: §1.3 に account 機能追加 + セルフ全データ削除（DB + R2 purge）実装 + §9 文言是正（窓口削除を約束しない）
- **判断期限**: feature 設計着手前（最優先）
- **担当**: 本人
- **L1 レポート**: `./SECURITY_REVIEW_20260609.md#sec-001`

### [論点-005] [SEC-002] PII ログ漏洩（位置情報・写真メタ）: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-09 open → 2026-06-09 accepted-as-requirement（§3.X SEC-002）
- **影響範囲**: §3 NFR / 監視（Sentry） / アナリティクス
- **観点 ID**: O26_pii_logging（legal_required）
- **severity**: High
- **推奨**: Sentry beforeSend で PII/位置マスク、ログ/イベントに位置・PII を出さない
- **判断期限**: 監視組込時
- **L1 レポート**: `./SECURITY_REVIEW_20260609.md#sec-002`

### [論点-006] [SEC-003] AI 生成エンドポイントのレート制限: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-09 open → 2026-06-09 accepted-as-requirement（§3.X SEC-003）
- **影響範囲**: §3 NFR / §4.3 / §4.6.2 / compose / _shared/ai
- **観点 ID**: O27_rate_limit_scope
- **severity**: High
- **推奨**: 生成エンドポイントに IP/ユーザー単位レート制限（ゲスト厳しめ）+ Turnstile 検討、コスト爆発防止
- **判断期限**: compose / _shared/ai 設計時
- **L1 レポート**: `./SECURITY_REVIEW_20260609.md#sec-003`

### [論点-007] [SEC-004] 認可マトリクス（所有者チェック）: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-09 open → 2026-06-09 accepted-as-requirement（§3.X SEC-004）
- **影響範囲**: §3 NFR / §5 / §6 / _shared/auth / 全 feature API
- **観点 ID**: O23_authorization_check
- **severity**: High
- **推奨**: 全 API で owner resolver 必須、R2 署名 URL は所有者キーのみ、認可マトリクス文書化
- **判断期限**: _shared/auth + 各 feature 設計時
- **L1 レポート**: `./SECURITY_REVIEW_20260609.md#sec-004`

### [論点-008] [SEC-005] 入力検証（アップロード/テキスト/SSRF）: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-09 open → 2026-06-09 accepted-as-requirement（§3.X SEC-005）
- **影響範囲**: §3 NFR / §5 / §6 / capture / compose
- **観点 ID**: O24_input_validation
- **severity**: High
- **推奨**: Zod で入力スキーマ一元化（MIME/サイズ/枚数/テキスト長）、ユーザー供給 URL を fetch しない、セリフ合成時エスケープ
- **判断期限**: capture / compose 設計時
- **L1 レポート**: `./SECURITY_REVIEW_20260609.md#sec-005`

## 9. 法務・コンプライアンス書類

> 公開 PJ（写真アップロード + AI 送信 + PWYW 金銭授受あり）。プライバシーポリシー必須、有償導線があるため特商法表記も必須。

### 9.1 必須書類チェックリスト
| 書類 | 必要性 | 状態 | 配置パス / URL | 備考 |
|---|---|---|---|---|
| プライバシーポリシー | ✅ | 未作成 | `/legal/privacy` | 写真アップロード・**AI 送信**・位置情報・課金を明示。AI 送信は中核機能のため明示同意 |
| 利用規約 | ✅ | 未作成 | `/legal/terms` | **生成物の権利帰属（ユーザー）**・取込写真の自己責任・第三者権利配慮・禁止行為（[論点-003]） |
| 特定商取引法に基づく表記 | ✅ | 未作成 | `/legal/specified-commercial-transactions` | 日本国内 + PWYW 有償導線で必須。個人事業主の住所は「請求あれば遅滞なく開示」記載で省略可 |
| Cookie ポリシー | ❌（不要） | — | — | Vercel Web Analytics は cookieless |

### 9.2 対応地域法規
| 法規 | 対象 | 対応方針 |
|---|---|---|
| 個人情報保護法（日本） | ✅ | 取得目的明示（写真/位置/AI 送信）、第三者提供なし、開示請求窓口 |
| GDPR / CCPA | ❌（国内主体想定） | 海外公開時に再評価 |

### 9.3 書類作成方針
- 作成手段: 自前ドラフト（テンプレ参考）+ 公開前に内容確認。`docs/legal/` に原稿、公開時 `/legal/*`
- 公開導線: フッタリンク + 初回起動時の AI 送信同意（写真を AI に送る旨を明示）
- 改訂時: AI プロバイダ追加 / 取得項目変更で再告知
- **⚠️ ゲスト認証下の DSR 履行（[SEC-001] / O54、Critical）**: ゲスト/匿名ユーザーは運営が本人特定不能のため、プラポリは「運営側で個人を特定できないため、データの確認・削除はアプリ内のセルフサービス機能でご自身で行える / アカウント連携後は窓口でも対応」と正直に明記し、**窓口削除を約束しない**。これに伴い §1.3 に **account（データ管理/削除）機能**を追加（in-app セルフ全データ削除 = Neon 行 + R2 画像 purge、開示は gallery の自分の全作品閲覧で履行）。非アクティブ匿名データの保持期限/自動 purge を設ける

### 9.4 特定商取引法（日本国内 + 有償）
- 販売事業者 / 代表者 / 所在地（請求時開示で省略可）/ 連絡先 / 価格・支払・引渡・返品条件 → 有償導線（高画質書き出し買い切り）公開前に整備

## 10. Git リポジトリ・運用

### 10.1 リポジトリ情報
| 項目 | 値 |
|---|---|
| リポジトリ URL | 未設定（要作成、GitHub private 推奨） |
| 可視性 | private |
| ホスティング | GitHub |
| デフォルトブランチ | main |

### 10.2 ブランチ戦略
- Trunk-based + Protected main（推奨）。protected_branches: `[main]`、auto_branch_prefix: `flow/`

### 10.3 コミット規約
- Conventional Commits。flow コマンド自動コミット: `docs(flow:<command>): ...`

### 10.4 リリースタグ規約
- semver（`v0.1.0` から）

### 10.5 CI / CD
- `.github/workflows/`: lint / typecheck / unit（PR ごと）、Vercel preview/production（マージ時）、Dependabot

### 10.6 flow コマンド自動コミット方針
```yaml
auto_commit: true
branch_strategy: trunk-based
commit_message_lang: ja
protected_branches: [main]
auto_branch_prefix: "flow/"
staging_extra_paths: []
staging_exclude_paths: []
```

### 10.7 セキュリティ
- `.env*.local` / 秘密情報を `.gitignore` 除外。pre-commit で gitleaks/detect-secrets

## 11. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成（wants.md I20260522-025 由来） | /flow:concept |
