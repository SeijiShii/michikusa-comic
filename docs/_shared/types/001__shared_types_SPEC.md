# _shared/types 仕様書（横断基盤）

> **役割**: 作品/コマ/写真/ユーザー/課金/コスト/フィードバックの共通型定義。Zod スキーマを単一ソースとし、型は `z.infer` で導出（型とバリデーションを一元化、SEC-005 入力検証の基盤）
> **タグ**: cross-cutting / foundation
> **最終更新**: 2026-06-09
> **入力アーティファクト**: `../../concept.md`（§5 データ設計 / §1.3.2）, `./README.md`
> **target_type**: cross-cutting（UI/E2E なし、提供インターフェースを記述）

---

## 1. 提供インターフェース（型 + スキーマ）

> 全エンティティは Zod スキーマで定義 → `export type X = z.infer<typeof XSchema>`。DB 層（_shared/db）はこの型を満たす行を返し、API 層は入力をこのスキーマで parse する。

### 1.1 列挙・基本型
- `ComicStatus` = `'draft' | 'saved'`
- `PaymentKind` = `'tip' | 'highres_export'`（投げ銭 / 高画質書き出し買い切り）
- `PaymentStatus` = `'pending' | 'paid' | 'failed' | 'refunded'`
- `AiProvider` = `'openai_vision' | 'gemini_image'`
- `FeedbackKind` = `'reaction' | 'bug_report'`
- `ReactionValue` = `'like' | 'dislike'`
- `OwnerId` = branded string（Clerk user id、ゲスト/認証共通の所有者識別子）
- `Iso8601` = string（ISO 日時、brand）

### 1.2 エンティティ（concept §5.1 由来）
| 型 | 主フィールド | 備考 |
|---|---|---|
| `User` | `id: OwnerId`, `isGuest: boolean`, `createdAt` | Clerk user の最小投影（所有権の主体） |
| `Photo` | `id`, `ownerId`, `r2Key`, `takenAt?`, `lat?`, `lng?`, `area?`, `caption?`, `createdAt` | 取込写真。位置は任意（PII、SEC-002） |
| `Comic` | `id`, `ownerId`, `title?`, `status: ComicStatus`, `area?`, `sourcePhotoIds: string[]`, `createdAt`, `updatedAt` | 4 コマ作品 |
| `Panel` | `id`, `comicId`, `order: 1..4`, `imageR2Key?`, `speech?: string`, `bubbleLayout?: BubbleLayout`, `stylePrompt?` | 各コマ。セリフ/吹き出しはアプリ側合成（[論点-001]） |
| `BubbleLayout` | `bubbles: { x,y,w,h,tailDir,text }[]` | SVG/Canvas 合成用の吹き出し配置 |
| `Collection` | `id`, `ownerId`, `yearMonth: 'YYYY-MM'`, `comicIds: string[]` | 月次自動コレクション |
| `AiCostLog` | `id`, `ownerId?`, `provider: AiProvider`, `metric`, `quantity`, `unitPriceVersion`, `estimatedUsd`, `createdAt` | コスト積算（§4.6.2） |
| `Payment` | `id`, `ownerId`, `kind: PaymentKind`, `status: PaymentStatus`, `amountJpy`, `comicId?`, `stripeRef`, `createdAt` | Stripe 単発 |
| `Feedback` | `id`, `ownerId?`, `kind: FeedbackKind`, `reaction?: ReactionValue`, `body?`, `route?`, `appVersion?`, `ua?`, `createdAt` | 好き嫌い + バグ報告（PII scrub 済本文、SEC-002） |

### 1.3 入力 DTO スキーマ（API 境界、SEC-005）
- `CreatePhotoInput`（MIME/サイズ上限は helpers の制約と整合、caption 長制限）
- `GenerateComicInput`（photoIds 1..N、ひとこと長制限）
- `UpdatePanelInput`（speech 長 / bubbleLayout）
- `CreatePaymentInput`（kind / amountJpy 範囲 / comicId）
- `SubmitFeedbackInput`（kind / reaction / body 長 / route）

## 2. 入出力
- **提供物**: 型 + Zod スキーマ（`export`）。副作用なし（純定義）
- **消費側**: _shared/db（行 → 型）、_shared/ai、各 feature の API 層（入力 parse）

## 3. データモデル
- 本モジュールは「型の SoT」。物理スキーマ（テーブル/制約/index）は `_shared/db` が本型に整合する形で定義する（重複定義を避け、db は types を参照）

## 4. バリデーション + エラーケース
| 対象 | ルール | 備考 |
|---|---|---|
| Zod parse 失敗 | `safeParse` で `{ success:false, error }` を返す | API 層が 400 にマップ（SEC-005） |
| branded type | OwnerId/Iso8601 は brand 関数経由でのみ生成 | 取り違え防止 |

## 5. 機能固有 NFR + 既存機能連携
### 5.1 NFR
- ビルド時型安全（実行時オーバーヘッドは Zod parse のみ、API 境界に限定）
### 5.2 連携
| 連携先 | 種別 | 依存内容 |
|---|---|---|
| _shared/db | 被参照 | 行型として本型を使用 |
| _shared/ai / payments / cost-tracking / 全 feature | 被参照 | DTO/エンティティ型 |

## 6. タグ別追加項目
（cross-cutting / foundation のため該当なし）

## 7. スコープ外
- 物理 DB スキーマ（_shared/db）
- バリデーションの実行配線（各 API 層）
- 画像処理ロジック（_shared/helpers）

## 8. 未決事項
- 現時点で論点なし（2026-06-09）。Panel の bubbleLayout 詳細スキーマは [論点-001]（compose/design）確定時に精緻化

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復6） |
