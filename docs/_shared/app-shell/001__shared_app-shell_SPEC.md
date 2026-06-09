# _shared/app-shell 仕様書（横断・合成レイヤ O57）

> **役割**: 全部品を 1 つの動く・デプロイ可能な PWA に組み立てる合成レイヤ。合成ルート + UI↔data 配線 + API ルートハンドラ層 + Clerk セッション確立 + PWA/deploy scaffold
> **タグ**: cross-cutting / composition-root / 最終 target ／ 2026-06-09
> **入力**: concept §1.3.2 app-shell / 全 feature + 全 _shared / perspectives O57/O36/O37
> **target_type**: cross-cutting（ただし app 全体の smoke E2E を持つ）

## 1. 提供インターフェース（合成）
- **合成ルート**: `main.tsx` / `App.tsx` / router / providers（AuthProvider, TanStack QueryClient, design-system theme）
- **ルーティング**: 全 feature 画面 + /legal/* + /account を配線（O55 到達性、フッタ/ナビ）
- **API ルートハンドラ層**: 全 feature の api/* を withOwner で統一ラップ（auth）+ Vercel Functions として公開
- **Clerk セッション確立**: 起動時に establishGuestSession（auth、P4.46 本番経路）
- **PWA scaffold**: manifest.json / service worker / アイコン（design-system ブランドマーク）
- **deploy scaffold**: vercel 設定 / 環境変数配線（O36 dev.sh, O37 CI 連携済）

## 2. 入出力
- アプリの entry。全部品を import して配線（自身はロジックを持たず合成のみ）

## 3. データモデル
- なし（合成）

## 4. バリデーション/エラー
- グローバルエラーバウンダリ / 404 ルート / オフライン fallback（PWA）

## 5. NFR + 連携
- **全 feature + 全 _shared に依存（優先度最後）**。起動 → ゲスト確立 → 即撮影（0 タップ）が成立すること
- 連携: 全モジュール

## 6. タグ別
- composition-root: 全部品の組み立て。これが無いと「部品はあるが動くアプリが無い」（O57）

## 7. スコープ外
- 各 feature のロジック（feature 側）/ 本番 deploy 実行（Class B、release）

## 8. 未決事項
- ルーティング詳細（タブ構成）は design/実装時。MVP は capture/gallery/account/legal の最小ナビ

## 9. 更新履歴
| 2026-06-09 | 初版 | /flow:feature（反復23） |
