# capture 実装計画書

> **入力**: `./001_capture_SPEC.md`, `../concept.md` §1.4
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/features/capture/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `CaptureScreen.tsx` | 取込 UI（写真選択 + ひとこと） | components, helpers | 120 |
| `usePhotoUpload.ts` | アップロードフック（presign→put→保存、TanStack Query） | services/storage | 90 |
| `offlineQueue.ts` | オフライン下書き（IndexedDB） | — | 80 |
| `api/photos/presign.ts` | 署名 URL（withOwner） | storage, auth | 40 |
| `api/photos/index.ts` | photo 作成（withOwner） | db, auth | 60 |

## 2. 実装 Phase 分割
### Phase 1: API（presign + 作成、withOwner）+ usePhotoUpload（mock）
### Phase 2: CaptureScreen UI（design-system トークン）
### Phase 3: offlineQueue（IndexedDB 下書き・同期）

## 3. 依存関係順序
```
storage/auth/db/helpers → api → usePhotoUpload → CaptureScreen → offlineQueue
```

## 4. 既存ファイルへの影響
- なし（先行は cross-cutting のみ）

## 5. 横断への追加・変更
- なし（cross-cutting は利用のみ）

## 6. リスク・注意点
- SEC-004: presign は所有者キーのみ / SEC-005: アップロード前検証 / SEC-002: 位置情報は本人領域
- オフライン同期は複雑 → MVP は簡素化（リトライ）も選択肢（[論点]）

## 7. 完了の定義（DoD）
- [ ] 取込→アップロード→photo 保存が動作・テスト green
- [ ] 検証（SEC-005）/ 所有者キー（SEC-004）テスト
- [ ] CaptureScreen が design-system 準拠
- [ ] E2E（004）green

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
| 2026-06-09 | 初版作成 | /flow:feature |
