# 統合スペックレビュー（Phase 2 全 18 target、tdd 着手前ゲート P3.7）

**レビュー日**: 2026-06-09
**対象**: 全 18 target（横断 9 + 機能 9）の 001-004 設計文書
**実行者**: /flow:spec-review（auto-pick、via /flow:auto 反復25）
**前提**: greenfield（実コードなし）→ 実コード照合の代わりに**設計間の横断整合性**を検査

> 通常 spec-review は実コード調査だが、本 PJ は実装前 greenfield のため、設計文書間の整合（依存グラフ / SEC 要件カバレッジ / 命名 / 責務境界）を検査する。

---

## 1. 依存グラフ整合性 ✅
- topological 順序に循環なし（concept §1.3.3 検証済）。各 PLAN の「依存順序」が concept §1.3 の依存列と一致
- 横断は features より先（優先度 1-3 → 4-5）、app-shell が最後（O57）
- **指摘なし**

## 2. SEC 要件カバレッジ（§3.X SEC-001..005 → 各設計への反映）✅
| SEC | 要件 | 反映先設計 | 状態 |
|---|---|---|---|
| SEC-001 (Critical, O54 DSR) | セルフ全データ削除 + R2 purge + 文言是正 | account（delete cascade+purge）/ db（cascade）/ storage（purgeOwner）/ legal（文言） | ✅ 全反映 |
| SEC-002 (PII ログ) | 位置/PII マスク | helpers（scrubPII/stripGeoExif）/ feedback / share / 監視（Sentry beforeSend、app-shell 配線） | ✅ |
| SEC-003 (レート制限) | 生成エンドポイント制限 | ai（ratelimit）/ compose（API） | ✅ |
| SEC-004 (認可) | owner resolver / 所有者キー | auth（withOwner）/ db（owner_id 規約）/ storage（キー境界）/ 全 feature API | ✅ |
| SEC-005 (入力検証) | Zod スキーマ | types（DTO）/ helpers（validateImageFile）/ capture / compose | ✅ |

- **指摘なし**（全 SEC が具体設計に落ちている）

## 3. 命名整合性 ✅
- docs フォルダ ↔ src 実装フォルダの命名一致（§1.4）。型は types を単一ソースに db/各層が import（重複定義なし）
- **指摘なし**

## 4. 責務境界 ✅
- types=型 / db=スキーマ / helpers=純関数 / storage=I/O / ai=生成 / cost-tracking=積算 / payments=課金 / auth=認証 / app-shell=合成
- 機能は横断を利用、ロジック重複なし。app-shell が全配線（O57）
- **指摘なし**

## 5. 論点トレーサビリティ ✅
- [論点-001]（セリフ合成）→ compose/helpers/ai/design に一貫参照
- [論点-002]（生成コスト/解像度）→ ai/compose/export に参照
- [論点-003]（写真権利）→ share/legal/capture に参照
- いずれも実装フェーズで確定する旨が各 SPEC §8 に明記

## 6. P4.46 Auth-impl gate 事前確認 ✅
- auth SPEC/PLAN/UNIT に「ゲスト本番経路（establishGuestSession）+ 匿名→authed 200 結合検証」が DoD として明記。stub auth で満たさない旨も記載 → ハードゲート対応済

## 7. 総合判定
- **全 18 target の設計は横断整合が取れており、tdd 着手可能**。指摘事項なし（greenfield のため実コード drift もなし）
- auto-pick: 設計判断の追加修正なし（全 SPEC §8 の論点は実装フェーズ確定として妥当）

## 8. 次のステップ
- Phase 3 実装: プロジェクト scaffold（Vite+React+TS / package.json / deps）→ /flow:tdd で優先度順実装（types→...→app-shell）→ /flow:e2e
- Phase 4: /flow:design --review-only（画面実装後の視覚レビュー）+ /flow:release
