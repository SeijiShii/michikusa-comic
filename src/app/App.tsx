import { useState } from "react";
import { LegalFooter } from "../components/LegalFooter.js";

export type Route = "/" | "/gallery" | "/account" | "/legal/privacy" | "/legal/terms" | "/legal/specified-commercial-transactions";

// 合成レイヤ (O57): 全画面を 1 つの動くアプリに組み立てる最小ルーター + フッタ導線(O55)
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
        {route === "/" && <p>散歩で見つけた風景を、4 コマにして残すアプリ</p>}
        {route === "/gallery" && <h1>ギャラリー</h1>}
        {route === "/account" && <h1>設定</h1>}
        {route.startsWith("/legal") && <h1>法務</h1>}
      </main>
      <LegalFooter onNavigate={nav} />
    </div>
  );
}
