# _shared/types 実装計画書

> **入力**: `./001__shared_types_SPEC.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/types/ または src/lib/schemas/）

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `src/types/enums.ts` | ComicStatus / PaymentKind / Status / AiProvider / FeedbackKind / ReactionValue | zod | 40 |
| `src/types/branded.ts` | OwnerId / Iso8601 brand + 生成関数 | zod | 30 |
| `src/types/entities.ts` | User/Photo/Comic/Panel/BubbleLayout/Collection/AiCostLog/Payment/Feedback スキーマ + infer 型 | enums, branded, zod | 220 |
| `src/types/dto.ts` | Create/Update/Submit 入力スキーマ（SEC-005） | entities, zod | 90 |
| `src/types/index.ts` | re-export | 上記 | 20 |

> スタック: TypeScript + Zod（concept §4.3、SEC-005 入力検証基盤）。実体は `src/types/` 配下（§1.4 では `src/types/`）。

## 2. 実装 Phase 分割（/flow:tdd 連携）

### Phase 1 (RED→GREEN→IMPROVE): enums + branded
- enums.ts / branded.ts + brand 生成関数のテスト

### Phase 2: entities スキーマ
- 全エンティティ Zod スキーマ + infer 型。各スキーマの parse 正常/異常テスト

### Phase 3: dto スキーマ
- 入力 DTO（境界値: MIME/サイズ上限値、テキスト長上限、photoIds 0/1/N）

## 3. 依存関係順序
```
enums + branded → entities → dto → index
```

## 4. 既存ファイルへの影響
- なし（新規基盤、優先度 1）

## 5. 横断フォルダへの追加・変更
- 本モジュールが SoT。`_shared/db` は本型を import して行型に使用（db 側で重複定義しない）

## 6. リスク・注意点
- Panel.bubbleLayout の詳細は [論点-001]（compose/design）に依存 → 初版は最小スキーマ、確定後に精緻化（後方互換に注意）
- branded type は過剰設計にしない（OwnerId/Iso8601 のみ）

## 7. 完了の定義（DoD）
- [ ] 全スキーマ + infer 型が export される
- [ ] Zod parse の正常/異常/境界テスト green（カバレッジ目標達成）
- [ ] typecheck green
- [ ] E2E: **cross-cutting のためスキップ**（統合は各 feature 側 E2E でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
