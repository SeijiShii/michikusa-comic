# _shared/helpers 実装計画書

> **入力**: `./001__shared_helpers_SPEC.md`, `../../concept.md` §1.4
> **最終更新**: 2026-06-09

---

## 1. 実装対象ファイル一覧（src/lib/）
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/lib/date.ts` | formatYearMonth 等 | — | 40 |
| `src/lib/area.ts` | resolveArea（ローカル地域テーブル） | — | 80 |
| `src/lib/image.ts` | extractExif / stripGeoExif / resizeImage / compositePanels | exifr, canvas | 200 |
| `src/lib/validation.ts` | validateImageFile（types DTO と整合） | types | 60 |
| `src/lib/privacy.ts` | scrubPII | — | 50 |
| `src/lib/index.ts` | re-export | 上記 | 15 |

## 2. 実装 Phase 分割（/flow:tdd）
### Phase 1: date / validation / privacy（純粋・依存少）
### Phase 2: area（ローカルテーブル）
### Phase 3: image（exif/resize/strip/composite — ブラウザ API、jsdom + canvas mock）

## 3. 依存関係順序
```
types → validation; (date/privacy/area 独立); image
```

## 4. 既存ファイルへの影響
- なし（基盤）

## 5. 横断への追加・変更
- capture/compose/share/feedback が import

## 6. リスク・注意点
- compositePanels は [論点-001] 依存 → 初版は最小（コマ 4 枚 + 矩形吹き出し）、確定後に拡張
- 画像処理ライブラリ（exifr / canvas）の選定は実装時、ブラウザ互換確認
- stripGeoExif は SEC-002 のため共有/書き出し経路で必ず通す（漏れ防止をレビュー）

## 7. 完了の定義（DoD）
- [ ] 全関数が純関数として実装・テスト green
- [ ] validateImageFile が types DTO 制約と一致
- [ ] scrubPII / stripGeoExif が PII を確実に除去（SEC-002）
- [ ] E2E: cross-cutting スキップ

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-09 | 初版作成 | /flow:feature |
