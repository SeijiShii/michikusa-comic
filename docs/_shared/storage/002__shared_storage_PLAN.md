# _shared/storage 実装計画書

> **入力**: `./001__shared_storage_SPEC.md`, `../../concept.md` §3.X SEC-004 / §4.3
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/services/storage/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/services/storage/r2.ts` | R2 クライアント（S3 互換 SDK）+ presign/put/delete | @aws-sdk/client-s3, @aws-sdk/s3-request-presigner | 120 |
| `src/services/storage/keys.ts` | キー設計（ownerId 含む path 生成・検証） | types | 50 |
| `src/services/storage/purge.ts` | purgeOwner（list + 一括 delete、DSR） | r2 | 70 |
| `api/storage/presign.ts` | 署名 URL 発行エンドポイント（withOwner 保護） | r2, auth | 50 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: keys（path 生成・ownerId 境界） + 単体テスト
### Phase 2: r2 client（presign/put/delete、interface + mock）
### Phase 3: purgeOwner（list+delete）+ 署名 API（withOwner 保護、所有権検証）

## 3. 依存関係順序
```
types → keys → r2 → purge/api(auth)
```

## 4. 既存ファイルへの影響
- なし（基盤）

## 5. 横断への追加・変更
- capture/compose/share/export/account が利用

## 6. リスク・注意点
- **SEC-004**: 署名 URL は所有者キーのみ。他人 ownerId のキーを発行しないことを auth と結合で検証
- **DSR purge**: account 削除で db cascade と R2 purge を協調（片方失敗時の整合性、結合テスト）
- R2 認証情報（PREREQUISITES §1）、私的バケット設定（public read 禁止）

## 7. 完了の定義（DoD）
- [ ] presign/put/delete/purgeOwner 実装 + mock テスト green
- [ ] キーに ownerId 境界 + 他人キー発行拒否テスト（SEC-004）
- [ ] purgeOwner が所有者全オブジェクトを削除（DSR、結合）
- [ ] E2E: capture/account 側でカバー

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
