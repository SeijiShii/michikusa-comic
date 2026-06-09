# _shared/storage 実装レポート（一部実装）
**実装日**: 2026-06-09 / /flow:tdd（反復30）
## 実装済（keys, 3 テスト green）
- `keys.ts`: photoKey/panelKey/exportKey（ownerId 境界）+ isOwnerKey（他人キー拒否、SEC-004）
## 未実装（後続、aws-sdk mock + 実 R2 キー）
- `r2.ts` presign/put/delete / `purge.ts` purgeOwner（DSR）/ `api/storage/presign.ts`
## DoD
- [x] キー設計 + ownerId 境界 + 他人キー拒否テスト（SEC-004）
- [ ] R2 client（presign/put/delete/purgeOwner）— aws-sdk-client-mock で後続
