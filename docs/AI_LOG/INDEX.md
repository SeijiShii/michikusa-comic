# AI_LOG インデックス — 道草コミック

**最終更新**: 2026-06-09
**総セッション数**: 1
**総 decision 数**: 11

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260609_001_concept_initial.md](./D20260609_001_concept_initial.md) | 2026-06-09 | /flow:concept | initial | D20260609-001〜011 | 完了 |

## decision_id 索引（grep 用、新しい順）

| ID | command | phase | chosen (短縮) | type | ファイル |
|---|---|---|---|---|---|
| D20260609-010 | /flow:concept | Step 5.47 SCENARIO | GitHub リポジトリ整備を Phase 1 に追加 | explicit-choice (command-feedback) | D20260609_001_concept_initial.md |
| D20260609-009 | /flow:concept | Step 5.5 | wants クリア | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-008 | /flow:concept | Q12.5 | 外部 AI 使う | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-007 | /flow:concept | Q12.6 | Vercel Web Analytics + 自前積算 | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-006 | /flow:concept | charter §1 | PWYW / Stripe 単発 | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-005 | /flow:concept | Q12.7(1) | Clerk ゲスト→段階認証 | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-004 | /flow:concept | Q12.12 | やわらか・温かみ | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-003 | /flow:concept | 自動判断 | セリフ=アプリ合成 | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-002 | /flow:concept | Q12.5 | Gemini 2.5 Flash Image | auto-recommended | D20260609_001_concept_initial.md |
| D20260609-001 | /flow:concept | データ層 | Neon + R2 | auto-recommended | D20260609_001_concept_initial.md |

## Open 論点（chosen_type=open、全期間横断）

| ID | 論点タイトル | 採番セッション | 関連 decision |
|---|---|---|---|
| 論点-001 | セリフ/コマ割りの焼き込み vs アプリ合成の最終線引き | D20260609_001 | D20260609-003 |
| 論点-002 | 1 作品あたり生成コスト上限・解像度段階化・キャッシュ | D20260609_001 | D20260609-002 |
| 論点-003 | 取り込み写真の著作権・肖像権 + 生成物権利帰属 + シェア注意喚起 | D20260609_001 | — |

## Superseded chain（旧 Open → 新解決）

| 旧 ID | 新 ID | 解決日 | 解決セッション |
|---|---|---|---|
| (なし) | | | |

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
