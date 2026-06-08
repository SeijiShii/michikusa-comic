# 実装前準備チェックリスト

**最終更新**: 2026-06-09
**集約元**: §4.3 リソース選定 / §6 外部連携 / §9 法務 / §4.5 ローカル開発 / §4.4 コスト / perspectives O12 / O22 / O25 / O27
**生成元**: /flow:concept

> 開発運用者向け実装前準備チェックリスト。状態列は `<!-- user-edit -->` 区間で手動更新可。

<!-- auto-generated-start -->

## 1. 外部 API キー (環境変数 `.env.local`)

| サービス | 環境変数名 | 用途 | 取得 URL | プラン / 無料枠 | 推奨コスト管理 |
|---|---|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | 写真理解 Vision | platform.openai.com | 従量 | store=false / 自前積算 §4.6.2 |
| Google Gemini | `GEMINI_API_KEY` | 4 コマ画像生成 | aistudio.google.com | 従量（無料枠要確認） | 解像度段階化 / 生成上限 |
| Cloudflare R2 | `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_ACCOUNT_ID` | 画像保管 | dash.cloudflare.com → R2 | Free 10GB / エグレス無料 | 容量監視 |
| Clerk | `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | 認証 | clerk.com | Free 10k MAU | — |
| Neon | `DATABASE_URL` | Postgres | neon.tech | Free 0.5GB × 10 DB | dev ブランチ運用 |
| Stripe | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PUBLISHABLE_KEY` | PWYW 単発決済 | dashboard.stripe.com | 従量手数料のみ | live は本番後発行 |
| Sentry | `SENTRY_DSN` | エラー監視 | sentry.io | Free 5K events/月 | — |

## 2. BaaS / インフラアカウント (§4.3、charter §0 = Neon スタック)

| サービス | 用途 | 取得 URL | プラン | 制限 |
|---|---|---|---|---|
| Neon | DB (Postgres、本サービス専用 DB) | neon.tech | Free | 0.5 GB × 10 DB |
| Vercel | ホスティング + Functions | vercel.com | Hobby (Free) | 100 GB 帯域 |
| Clerk | Auth | clerk.com | Free | 10,000 MAU |
| Cloudflare R2 | Storage (S3 互換) | cloudflare.com → R2 | Free | 10 GB、エグレス無料 |

## 3. ドメイン (§4.7)

| 段階 | 内容 |
|---|---|
| 検証 | `michikusa-comic.vercel.app`（PaaS デフォルト、取得不要） |
| 公開（推奨） | 既存ドメインのサブドメ `michikusa.<existing-domain>`（あれば $0、撤退時 DNS 1 行削除） |
| 新規取得（任意） | ブランディング理由がある時のみ（Cloudflare Registrar 等、$10〜15/年） |

## 4. 認証プロバイダ設定 (perspectives O05 / O22)

| 項目 | 取得方法 | 必要性 | 備考 |
|---|---|---|---|
| Clerk App 作成 | clerk.com → New Application | 必須 | Publishable / Secret Key を .env.local |
| 匿名（ゲスト）有効化 | Clerk: Anonymous sign-in 有効化 | 必須（気軽さ） | 起動 → 即撮影 0 タップ（O22） |
| Google OAuth | console.cloud.google.com → Credentials | 段階認証（課金/同期時） | Clerk Social Provider に登録 |

## 5. 決済プロバイダ設定 (PWYW、§4.6 / charter §1)

| 項目 | 取得方法 | 必要性 | 備考 |
|---|---|---|---|
| Stripe アカウント本人確認 | dashboard.stripe.com | 有償導線公開時必須 | 個人事業主登記が要る場合あり |
| API キー (test / live) | dashboard.stripe.com/apikeys | 必須 | live は本番後 |
| Webhook 登録 | dashboard.stripe.com/webhooks | 単発決済必須 | 署名検証鍵を .env.local |

## 6. 法務書類準備 (§9)

| 書類 | 必要性 | 配置 URL | 作成方法 |
|---|---|---|---|
| プライバシーポリシー | 必須（写真 + AI 送信 + 位置 + 課金） | `/legal/privacy` | 自前ドラフト + 公開前確認 |
| 利用規約 | 必須（生成物権利帰属 + 取込写真自己責任） | `/legal/terms` | 同上（[論点-003]） |
| 特定商取引法表記 | 必須（国内 + PWYW 有償） | `/legal/specified-commercial-transactions` | 自前作成 |
| Cookie 同意 | 不要 | — | Vercel Web Analytics は cookieless |

## 7. 監視・アナリティクス (perspectives O01 / O02)

| サービス | 用途 | 取得 URL | プラン |
|---|---|---|---|
| Sentry | エラー監視 | sentry.io | Free (5,000 events/月) |
| Vercel Web Analytics | cookieless 流入計測 | vercel.com（プロジェクト設定） | Hobby 無料 |

## 8. ボット対策 (perspectives O27、公開フォームある時)

| サービス | 用途 | プラン |
|---|---|---|
| Cloudflare Turnstile (任意) | フィードバック/問い合わせフォームのスパム対策 | Free 1M req/月 |

## 9. ローカル開発環境準備 (§4.5)

| 項目 | コマンド / 手順 |
|---|---|
| Node.js ランタイム | nvm / asdf で管理 |
| Vercel CLI | `npm i -g vercel`（`vercel dev`） |
| Drizzle | `npm i drizzle-orm drizzle-kit` |
| `.env.example` 作成 | §1, §4, §5, §7 のキー名をダミー値付きで列挙 |
| `.env.local` 作成 | 実値入力、`.gitignore` 確認 |
| pre-commit hook | husky + gitleaks/detect-secrets で秘密情報コミット防止 |

## 10. コスト試算 (§4.4 由来)

- **初期コスト**: $0（固定インフラは全て無料枠）
- **月額目安（低利用時）**: $0〜$20（変動費は AI 生成のみ）
- **無料枠超過アラート設定** (perspectives O04): §4.6.2 で自前積算、80/100/120% 通知

## 11. 実装着手前 最終チェックリスト

- [ ] §1-§9 の必須キー/アカウント取得済み
- [ ] `.env.example` 作成、必須キー全定義
- [ ] `.gitignore` に `.env*.local` / `.env` 追加 (perspectives O25)
- [ ] 法務書類ドラフト作成（公開前最終確認用）
- [ ] `~/.claude/flow-data/preferences.md` に採用ベンダー記録
- [ ] `/flow:secure --phase=design` で L1 レビュー（Critical/High なし）
- [ ] CI に `npm audit` / Dependabot 組み込み

<!-- auto-generated-end -->

<!-- user-edit-start -->

## ユーザー手動メモ (auto-generated で保護)

| 項目 | 状態 | 取得日 / 備考 |
|---|---|---|
| OPENAI_API_KEY | ❌ | |
| GEMINI_API_KEY | ❌ | |
| Neon プロジェクト | ❌ | |
| Clerk App | ❌ | |
| Cloudflare R2 バケット | ❌ | |
| Stripe アカウント | ❌ | |

<!-- user-edit-end -->
