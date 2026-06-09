# gallery 実装計画書
> **入力**: 001, concept §1.4 ／ 2026-06-09

## 1. ファイル（src/features/gallery/）
| ファイル | 責務 | LOC |
| `GalleryScreen.tsx` | 時系列/エリア別一覧 | 140 |
| `ComicDetail.tsx` | 詳細表示 | 90 |
| `useComics.ts` | 取得フック（TanStack Query, 無限スクロール） | 80 |
| `api/comics/index.ts` | 一覧（withOwner, cursor） | 60 |
| `api/comics/[id].ts` | 詳細（withOwner） | 40 |

## 2. Phase 分割
- Phase 1: API（一覧/詳細, withOwner, owner 境界）
- Phase 2: GalleryScreen + useComics（無限スクロール）
- Phase 3: ComicDetail + フィルタ（エリア/月）

## 3. 依存順序
db/auth/storage → api → useComics → GalleryScreen/ComicDetail

## 4-6. 影響/横断/リスク
- SEC-004 owner 境界、署名 URL で画像。開示履行（O54）

## 7. DoD
- [ ] 一覧/詳細/フィルタ動作・テスト green
- [ ] owner 境界テスト（SEC-004）
- [ ] design-system 準拠
- [ ] E2E green

## 8. 更新履歴
| 2026-06-09 | 初版 | /flow:feature |
