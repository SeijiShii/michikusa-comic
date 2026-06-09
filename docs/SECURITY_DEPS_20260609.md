<!-- auto-generated-start -->
# 依存ライブラリ脆弱性スキャン結果

**スキャン日**: 2026-06-09 / **スキャナ**: npm audit / **対象**: package-lock.json
**実行**: /flow:secure --phase=deps（via /flow:auto §3.0c release-pre）

## 1. サマリ
- 総検出: 5 件（4 moderate / 1 critical）
- **すべて dev dependencies（vite / vitest / @vitest/mocker / vite-node / esbuild）**
- **本番ランタイムへの出荷なし**（ビルドツールチェーン、デプロイ成果物に含まれない）

## 2. 詳細
- esbuild ≤0.24.2（GHSA、dev サーバー CORS、moderate→critical 連鎖）: **dev サーバー限定**、本番無関係
- vite / vitest / vite-node / @vitest/mocker: 上記 esbuild への推移的依存

## 3. 判定
- **本番影響なし**（dev-only）。production deploy 成果物には含まれない
- 対応: `npm audit fix --force`（vite/vitest メジャー bump 伴う、破壊的変更注意）は任意。Dependabot（.github/dependabot.yml）が継続監視
- リリースブロッカーではない

## 4. 次のステップ
- Dependabot 週次で追跡。vite/vitest メジャー更新時にまとめて解消
<!-- auto-generated-end -->
