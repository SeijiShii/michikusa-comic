# プロダクトドキュメントマップ (道草コミック)

**最終更新**: 2026-06-09
**最新コマンド**: /flow:concept (D20260609_001_concept_initial)
**統計**: 機能フォルダ 8 / 横断フォルダ 9 / 改修件数 0 / バグ修正件数 0 / クレーム判定件数 0 / Open 論点 3 件

> **このファイルは AI 用エントリポイント**。目的別に「どこから読めばいいか」「次に何を Read すべきか」を示す。

<!-- auto-generated-start -->

## 0. AI 用クイックアクセス（目的別）

| 目的 | 最初に Read | 次に Read | 注記 |
|---|---|---|---|
| プロダクト全体を理解する | `./concept.md` (§1, §1.3, §4.2) | `./INDEX.md` | 5 分で全体像 |
| 次に何をすべきか判断する | `./SCENARIO.md` (§5 現在地カーソル) | `./AI_LOG/INDEX.md` | `/flow:auto` 起動 |
| 特定機能を理解する | `./<feature>/README.md` | `./<feature>/INDEX.md` → `001_*_SPEC.md` | feature 一覧は §2 |
| 実装前の準備を確認する | `./PREREQUISITES.md` | `./concept.md §4.3` | API キー / アカウント |
| 設計判断の経緯を辿る | `./AI_LOG/INDEX.md` | 該当セッションファイル | decision_id 索引で grep |
| 未決論点を見る | `./concept.md §8` | `./AI_LOG/INDEX.md` Open 論点 | 同期済 |
| 工数感を知る | `./estimates/` | 機能別 estimate | `/flow:estimate` で生成 |
| 法務書類対応状況を見る | `./concept.md §9` | `./legal/` | 公開 + PWYW で必須 |

## 1. プロダクト全体

- **概念設計 (SoT)**: [./concept.md](./concept.md)
  - 一行で言うと: 散歩で見つけた何でもない街の風景を AI 補助で 4 コマ漫画に仕立てて残す・分かち合う
  - 現フェーズ: 企画 → MVP
  - 最終更新: 2026-06-09
- **プロジェクト INDEX (フラット一覧)**: [./INDEX.md](./INDEX.md)
- **実装前準備**: [./PREREQUISITES.md](./PREREQUISITES.md)
- **見積もり**: [./estimates/](./estimates/)

## 2. 機能フォルダ（業務ドメイン）

| 優先度 | 基盤 | フォルダ | 状態 | INDEX |
|---|---|---|---|---|
| 3 | ❌ | capture | 計画 | [INDEX](./capture/INDEX.md) |
| 3 | ❌ | legal | 計画 | [INDEX](./legal/INDEX.md) |
| 4 | ❌ | compose | 計画 | [INDEX](./compose/INDEX.md) |
| 4 | ❌ | gallery | 計画 | [INDEX](./gallery/INDEX.md) |
| 5 | ❌ | collection | 計画 | [INDEX](./collection/INDEX.md) |
| 5 | ❌ | share | 計画 | [INDEX](./share/INDEX.md) |
| 5 | ❌ | export | 計画 | [INDEX](./export/INDEX.md) |
| 5 | ❌ | feedback | 計画 | [INDEX](./feedback/INDEX.md) |

## 3. 横断フォルダ（_shared/*）

| 優先度 | フォルダ | 状態 | INDEX |
|---|---|---|---|
| 1 | _shared/types | 計画 | [INDEX](./_shared/types/INDEX.md) |
| 1 | _shared/helpers | 計画 | [INDEX](./_shared/helpers/INDEX.md) |
| 1 | _shared/db | 計画 | [INDEX](./_shared/db/INDEX.md) |
| 2 | _shared/auth | 計画 | [INDEX](./_shared/auth/INDEX.md) |
| 2 | _shared/storage | 計画 | [INDEX](./_shared/storage/INDEX.md) |
| 2 | _shared/ai | 計画 | [INDEX](./_shared/ai/INDEX.md) |
| 2 | _shared/cost-tracking | 計画 | [INDEX](./_shared/cost-tracking/INDEX.md) |
| 3 | _shared/payments | 計画 | [INDEX](./_shared/payments/INDEX.md) |
| 9 | _shared/app-shell | 計画 | [INDEX](./_shared/app-shell/INDEX.md) |

## 4. 設計判断の経緯

- **AI_LOG インデックス**: [./AI_LOG/INDEX.md](./AI_LOG/INDEX.md)
- **最新セッション**: D20260609_001_concept_initial（完了、decision 9 件）
- **Open 論点**: 3 件（concept §8 と同期）
- **Superseded chain**: 0 件

## 5. 観点・選好データ（PJ 外部参照）

- **観点 SoT**: `~/.claude/flow-data/perspectives.md`
- **開発者選好**: `~/.claude/flow-data/preferences.md`（学習元 PJ 9 件、強い選好: Neon スタック）

## 6. ファイル種別ガイド（番号体系）

| 種別 | 番号 / パターン | パス例 | 生成元 |
|---|---|---|---|
| 機能 SPEC | `001_*_SPEC.md` | `./compose/001_compose_SPEC.md` | `/flow:feature` |
| 機能 PLAN | `002_*_PLAN.md` | `./compose/002_compose_PLAN.md` | `/flow:feature` |
| 単体テスト計画 | `003_*_UNIT_TEST.md` | `./compose/003_compose_UNIT_TEST.md` | `/flow:feature` |
| E2E テスト計画 | `004_*_E2E_TEST.md` | `./compose/004_compose_E2E_TEST.md` | `/flow:feature` |
| 改修サブフォルダ | `revise_<id>_<date>_<slug>/` | `./compose/revise_.../001_REVISE_SPEC.md` | `/flow:revise` |
| バグ修正サブフォルダ | `fix_<id>_<date>_<slug>/` | `./compose/fix_.../000_調査レポート.md` | `/flow:fix` |
| クレーム判定 | `claim_<id>_<date>_<slug>/` | `./compose/claim_.../001_TRIAGE.md` | `/flow:claim` |
| AI_LOG セッション | `D<date>_<sess>_<cmd>_<target>.md` | `./AI_LOG/D20260609_001_concept_initial.md` | 各 flow コマンド |

## 7. 依存・優先度グラフ（concept §1.3.3 から導出）

```
_shared/types        (優先度 1, 基盤 ✅)
_shared/helpers      (優先度 1, 基盤 ✅)
_shared/db           (優先度 1, 基盤 ✅)
_shared/auth         (優先度 2, 基盤 ✅) ← db
_shared/storage      (優先度 2, 基盤 ✅) ← db, types
_shared/cost-tracking(優先度 2, 基盤 ✅) ← db
_shared/ai           (優先度 2, 基盤 ✅) ← types, cost-tracking
_shared/payments     (優先度 3, 基盤 ✅) ← db, auth
capture              (優先度 3) ← storage, auth, db
legal                (優先度 3) ← なし
compose              (優先度 4) ← ai, storage, db, capture
gallery              (優先度 4) ← db, storage, auth
collection           (優先度 5) ← db, gallery
share                (優先度 5) ← gallery, storage
export               (優先度 5) ← gallery, payments, storage
feedback             (優先度 5) ← auth
_shared/app-shell    (優先度 9, 最後) ← 全 feature + 全 _shared
```

循環依存: なし

## 8. コマンド使い分けガイド

| やりたいこと | コマンド | 入力 | 主要出力 |
|---|---|---|---|
| 概念設計（本書） | `/flow:concept` | wants.md | `./concept.md` + 各 INDEX + AI_LOG |
| 全体見積もり | `/flow:estimate` | concept.md | `estimates/` |
| デザインシステム | `/flow:design` | concept.md | `design/design-system.md` |
| 新規機能を設計 | `/flow:feature <feature>` | concept + README | `001_SPEC` 〜 `004_E2E_TEST` |
| TDD 実装 | `/flow:tdd` | 設計 4 文書 | `101_IMPL_REPORT` |
| 次の一手を自動実行 | `/flow:auto` | SCENARIO + AI_LOG | 次フェーズ自動 dispatch |

## 9. 履歴サマリ

- **改修件数 (累計)**: 0 件
- **バグ修正件数 (累計)**: 0 件
- **クレーム判定件数 (累計)**: 0 件

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
