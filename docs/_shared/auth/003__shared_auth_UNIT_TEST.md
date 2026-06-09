# _shared/auth 単体テスト計画

> **入力**: `./001__shared_auth_SPEC.md`, `./002__shared_auth_PLAN.md`
> **最終更新**: 2026-06-09

---

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N-1 | withOwner（認証済） | ownerId 注入され handler が実行、200 |
| N-2 | getOwnerId（ゲスト） | 匿名 owner_id を返す |
| N-3 | **establishGuestSession（本番経路、P4.46）** | sign-in token 経路で匿名セッション確立 → 後続の保護 API が **200** |
| N-4 | linkAccount | ゲスト→連携で owner 引き継ぎ |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E-1 | withOwner（未認証） | セッション無し | **401** |
| E-2 | 他人リソース | owner_id 不一致 | 403/404 |
| E-3 | establishGuestSession | Clerk エラー | フォールバック/再試行案内 |

### 1.3 境界値・結合
| ID | 対象 | 内容 |
|---|---|---|
| B-1 | **匿名→authed 結合（P4.46 DoD）** | 匿名セッション確立直後に withOwner 保護 API を叩き **401 でなく 200** を確認 |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| Clerk セッション（owner resolver 単体） | mock | 401/200 分岐の単体検証 |
| **ゲスト本番経路（P4.46）** | **mock 注入のみで満たさない** — Clerk backend SDK の sign-in token を test/dev インスタンスで実経路検証（integration） | stub green が本番未実装を隠す事故防止 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 85% |
| 分岐 | 80%（認可分岐は網羅） |

## 4. 既存ユーティリティ依存
- `_shared/db`（users 行） / `_shared/types`（OwnerId）

## 5. テスト実行環境
- Vitest + Clerk test/dev インスタンス（P4.46 結合検証用）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
