# compose 単体テスト計画

> **入力**: 001/002 ／ **最終更新**: 2026-06-09

## 1. テストケース
### 正常系
- N-1: generate（ai mock）→ comic(draft)+panels 作成、コスト積算
- N-2: PanelCanvas 合成（4コマ+吹き出し→画像、可読）
- N-3: セリフ編集 PATCH → panel 更新
- N-4: save → status saved
### 異常系
- E-1: rate limit 超過 → 429（SEC-003）
- E-2: 生成失敗 → フォールバック（下書き保持）
- E-3: 未認証 → 401 / 他人 comic → 403
- E-4: セリフ XSS → エスケープ（SEC-005）
### 境界値
- B-1: photoIds 1/N、解像度プレビュー低/高（[論点-002]）

## 2. Mock 方針
- ai/storage/db mock、Canvas は jsdom+node-canvas、rate limit mock

## 3. カバレッジ目標
行 80% / 分岐 75%

## 4-5. 依存/環境
- _shared/ai,helpers,storage,db,auth / Vitest+jsdom+canvas

## 6. 更新履歴
| 2026-06-09 | 初版作成 | /flow:feature |
