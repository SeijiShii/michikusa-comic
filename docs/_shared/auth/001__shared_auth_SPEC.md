# _shared/auth 仕様書（横断基盤）

> **役割**: Clerk ゲスト（匿名）→ 段階認証（O22）+ owner resolver（SEC-004/O23）+ ゲストセッション確立の本番経路（P4.46 ハードゲート）
> **タグ**: cross-cutting / foundation / auth-required
> **最終更新**: 2026-06-09
> **入力**: `../../concept.md`（§3.X SEC-004, §4.1, §1.1）, charter §1.1, perspectives O22
> **target_type**: cross-cutting（E2E は capture/account 側でカバー、ただし「匿名→authed API 200」結合は本基盤で検証）

---

## 1. 提供インターフェース
| 関数/フロー | 責務 |
|---|---|
| `establishGuestSession()` | **匿名ゲストセッションの本番経路**（P4.46 非交渉）。Clerk Anonymous sign-in を確立し OwnerId を発行 |
| `linkAccount({ provider })` | ゲスト → Google OAuth 連携（段階認証、課金/同期時）。ゲストデータを引き継ぐ |
| `withOwner(handler)` | API ルートハンドララッパ。セッション検証 → `ownerId` を注入。未認証は 401 |
| `requireOwner()` | サーバー側で現在の ownerId を取得（無ければ 401） |
| `getOwnerId()` | 現在のセッションの ownerId（ゲスト/認証共通） |

## 2. 認証フロー（O22 progressive auth）
1. **初回起動**: アカウント不要。`establishGuestSession()` で匿名セッション確立 → 即撮影可能（0 タップ）
2. **クラウド同期 / 課金 / 公開時**: `linkAccount` で Google OAuth 連携 → 匿名データを引き継ぎ（owner_id 維持 or マージ）
3. **全 API**: `withOwner` で保護、`ownerId = session.userId` を強制（SEC-004）

> **P4.46 ハードゲート対応**: 本 SPEC は「ownerId を fake 注入する service テスト」では満たさない。**本番で実セッションが張れる経路**（Clerk Anonymous / sign-in token）の実コード + 「匿名セッション確立 → 保護 API が 200（401 でない）」の結合検証を DoD に含む。

## 3. データモデル
- `users` 行（_shared/db）: id（Clerk user id）, is_guest。匿名→連携時に is_guest=false に更新
- セッションは Clerk 管理（DB に独自セッション表は持たない）

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| 未認証 API アクセス | 401（withOwner） |
| 他人リソースアクセス | owner_id 不一致 → 403/404（リポジトリ層 + withOwner） |
| ゲスト→連携時のデータ衝突 | 引き継ぎ戦略（匿名 owner_id を連携後 owner に移管 or マージ） |

## 5. NFR + 連携
- **NFR**: セッション検証は各 API で低レイテンシ（Clerk middleware）。フィッシング耐性（Clerk 標準）
- **連携**: 全 feature API（withOwner）/ db（users 行・所有権）/ account（linkAccount/削除）/ payments（課金時は認証必須）

## 6. タグ別追加項目（auth-required）
- **ロール**: 単一ユーザー所有モデル（admin ロールなし、各自が自分のデータのみ）
- **所有者チェック**: 全 API で owner_id = session.userId（SEC-004 認可マトリクスの中核）
- **ゲスト権限**: ゲストは自分のデータ CRUD 可、課金は連携後

## 7. スコープ外
- パスキー（v2、preferences §5 に倣い MVP 見送り）
- 管理者ダッシュボード（単一ユーザーモデルのため不要）

## 8. 未決事項
- [論点] ゲスト→連携時のデータ引き継ぎ詳細（owner_id 移管 vs マージ）。capture/account 実装時に確定（推奨: Clerk anonymous→linked で同一 user 維持できるなら移管不要）

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature（via /flow:auto 反復9） |
