# 道草コミック

散歩や通勤で見つけた何でもない街の風景を、スマホから AI 補助で 4 コマ漫画に仕立てて残す・分かち合う軽量 PWA。

## 概要

絵心がなくても、街で見かけた小さな面白さ（看板のミス、行列、季節の風景、猫）を撮った写真から、ワンタップで気軽に 4 コマ漫画へ。AI が 4 コマ構成（コマ割り + セリフ案 + 絵柄 stylize）を提案し、セリフ・吹き出しはアプリ側で重ねて微修正できる。作った 4 コマはギャラリーに時系列・エリア別に蓄積され、家族 LINE やゆるい SNS に書き出してシェアできる。プロ向けの本格マンガ制作機能は持たず、「日常を面白がる」前向きな創作体験に振り切る。

## 主要機能

- **撮る → 4 コマ化**: 写真 + ひとこと → AI が 4 コマ構成を提案 → 微修正して保存（capture / compose）
- **振り返る**: マイギャラリーで時系列・エリア別に振り返り（gallery）
- **まとめる**: 月末「今月の道草」自動コレクション（collection）
- **分かち合う**: 画像書き出し + OS 標準シェア（share）
- **残す（任意）**: 高画質書き出しの PWYW 課金（export）

## 技術スタック

- フロント: Vite + React + TypeScript（PWA）+ shadcn/ui + Tailwind
- バック: Vercel Functions（サーバーレス）
- DB / ORM: Neon (Postgres) + Drizzle
- ストレージ: Cloudflare R2（S3 互換、エグレス無料）
- 認証: Clerk（ゲスト → 課金/同期時に段階認証）
- 外部 AI: OpenAI Vision（写真理解）+ Google Gemini 2.5 Flash Image（4 コマ生成）
- 決済: Stripe（PWYW 単発）
- 監視/計測: Sentry + Vercel Web Analytics（cookieless）

## Getting Started (Local Development)

### 前提条件

- Node.js（nvm / asdf で管理）
- Vercel CLI（`npm i -g vercel`）
- `.env.local` の準備（`.env.example` をコピーして実値を埋める。詳細は [PREREQUISITES.md](./docs/PREREQUISITES.md)）

### 起動

```bash
# scripts/dev.sh が存在する場合
./scripts/dev.sh

# または個別に
npm run dev        # Vite フロント
vercel dev         # Functions emulation
```

### よく使うコマンド

| 用途 | コマンド |
|---|---|
| dev サーバー起動 | `./scripts/dev.sh` または `npm run dev` |
| DB マイグレーション | `npm run db:migrate`（Drizzle） |
| 型チェック | `npm run typecheck` |
| ユニットテスト | `npm run test` |

詳細: [docs/concept.md §4.5](./docs/concept.md)

## 開発状態

計画中（MVP 設計フェーズ）。進行は [docs/SCENARIO.md](./docs/SCENARIO.md) を参照。

## 設計ドキュメント

- [全体概念・要件・設計](./docs/concept.md) — プロジェクト中央書類（`/flow:concept` で生成・更新）
- [開発シナリオ](./docs/SCENARIO.md) — next-step 判断用ナラティブ
- [機能フォルダ INDEX](./docs/INDEX.md) — 全機能フォルダ + 横断フォルダのリスト
- [AI 用エントリポイント](./docs/DOC_MAP.md) — 目的別アクセスガイド
- [実装前準備チェックリスト](./docs/PREREQUISITES.md) — API キー / アカウント / 法務書類

## ライセンス

All Rights Reserved（公開後に再検討）
