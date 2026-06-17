# 依存ライブラリ脆弱性スキャン結果

**スキャン日**: 2026-06-18
**対象**: package-lock.json
**スキャナ**: npm audit
**契機**: §3.0c release-pre 必須監査ペア（audit→secure）。revise_001 は node:crypto のみで新規 npm 依存追加なし。

## 1. サマリ
- 総検出: 5 件（critical 1 / high 1 / moderate 3）
- **すべて dev/build ツール（devDependencies、本番ランタイム非搭載）** → prod 影響なし
- 2026-06-09 前回スキャンと同一構成（新規 prod 脆弱性なし）

## 2. 詳細（全件 dev-only）

| severity | パッケージ | 内容 | fix |
|---|---|---|---|
| critical | vitest | Vitest UI server listening 時に任意ファイル read/exec | 4.1.9（major） |
| high | vite | dev: Path Traversal（optimized deps .map）/ launch-editor NTLM / fs.deny bypass（Windows） | 6.4.3（major） |
| moderate | esbuild | dev サーバが任意サイトからのリクエストを許す | 6.4.3 |
| moderate | @vitest/mocker | （vitest 連鎖） | 4.1.9 |
| moderate | vite-node | （vitest 連鎖） | 4.1.9 |

## 3. 判定（accepted-risk: dev-only、前回と同一）
- **本番無関係**: vitest/vite/esbuild は build/test ツール。プロダクションバンドル（Vercel deploy 成果物）には含まれない。Vitest UI server / dev server はローカル開発時のみ起動。
- **修正は major bump**（vite 5→6、vitest 2→4）で破壊的変更リスク。prod 影響ゼロのため**リリースブロッカーにしない**。
- **推奨（任意・低優先）**: 余裕のあるタイミングで `vite@6 + vitest@4` への major bump 保守 revise（CI/ローカルの dev セキュリティ向上）。新規 §8 論点は起こさない（dev-only accepted-risk、前回 2026-06-09 と同方針継続）。

## 4. 継続監視
- Dependabot（concept §10.5、Phase 1 で有効化方針）が prod 依存の CVE を継続検知。
