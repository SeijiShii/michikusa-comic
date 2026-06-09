import { useState } from "react";
import { LegalFooter } from "../components/LegalFooter.js";
import { CaptureScreen } from "../features/capture/CaptureScreen.js";
import { GalleryScreen } from "../features/gallery/GalleryScreen.js";
import { DeleteAllData } from "../features/account/DeleteAllData.js";
import { FeedbackWidget } from "../features/feedback/FeedbackWidget.js";
import { PrivacyPolicy } from "../features/legal/PrivacyPolicy.js";

export type Route = "/" | "/gallery" | "/account" | "/legal/privacy" | "/legal/terms" | "/legal/specified-commercial-transactions";

const APP_VERSION = "0.1.0";

// 合成レイヤ (O57): 実 feature コンポーネントを配線した動くアプリ
// ※ データ永続 (アップロード/生成/削除の実行) は SDK アダプタ + 実キー (release) で接続
export function App() {
  const [route, setRoute] = useState<Route>("/");
  const nav = (p: string) => setRoute(p as Route);
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <header>
        <button type="button" onClick={() => nav("/")} aria-label="ホーム">道草コミック</button>
        <nav>
          <button type="button" onClick={() => nav("/gallery")}>ギャラリー</button>
          <button type="button" onClick={() => nav("/account")}>設定</button>
        </nav>
      </header>
      <main data-route={route}>
        {route === "/" && (
          <CaptureScreen onSubmit={(files, caption) => { /* TODO: usePhotoUpload (storage/api, release) */ void files; void caption; nav("/gallery"); }} />
        )}
        {route === "/gallery" && (
          <GalleryScreen comics={[]} onOpen={(id) => { void id; /* TODO: useComics (db/api) */ }} />
        )}
        {route === "/account" && (
          <DeleteAllData onConfirmDelete={() => { /* TODO: api/account/delete (db cascade + R2 purge, release) */ }} />
        )}
        {route.startsWith("/legal") && <PrivacyPolicy />}
      </main>
      <FeedbackWidget route={route} appVersion={APP_VERSION} onSend={(p) => { void p; /* TODO: api/feedback */ }} />
      <LegalFooter onNavigate={nav} />
    </div>
  );
}
