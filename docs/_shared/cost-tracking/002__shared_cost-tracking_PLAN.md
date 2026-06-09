# _shared/cost-tracking 実装計画書

> **入力**: `./001__shared_cost-tracking_SPEC.md`, `../../concept.md` §4.6.2
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/services/cost/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/cost/pricing.ts` | `.env` 単価ロード + estimateCost | — | 60 |
| `src/services/cost/record.ts` | recordCall（ai_cost_logs 書き込み、非ブロッキング） | db | 70 |
| `src/services/cost/aggregate.ts` | aggregate（日次/月次・軸別） | db | 80 |
| `src/services/cost/alert.ts` | checkFreeTier（閾値 + 多重防止） | aggregate | 60 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: pricing（単価ロード + estimateCost）+ テスト
### Phase 2: record（積算記録、非ブロッキング）
### Phase 3: aggregate + alert（無料枠超過）

## 3. 依存関係順序
```
pricing → record → aggregate → alert
```

## 4. 既存ファイルへの影響
- なし（基盤）

## 5. 横断への追加・変更
- ai/storage が recordCall を呼ぶ。`.env.example` に COST_* 単価キーを追加

## 6. リスク・注意点
- 単価ハードコード禁止（§4.6.2）。`.env` 管理 + 変更日記録
- 記録が呼び出しをブロックしないこと（best-effort、失敗してもサービス継続）
- 月次で外部請求と突合し誤差確認（§4.6.2）

## 7. 完了の定義（DoD）
- [ ] estimateCost / recordCall / aggregate / checkFreeTier 実装 + テスト green
- [ ] `.env.example` に COST_* キー追加
- [ ] 閾値アラート多重防止
- [ ] E2E: cross-cutting スキップ

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
