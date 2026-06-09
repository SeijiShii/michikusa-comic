import { useState } from "react";
import { scrubPII } from "../../lib/privacy.js";

export interface FeedbackWidgetProps {
  route: string;
  appVersion: string;
  onSend: (payload: { kind: "reaction" | "bug_report"; reaction?: "like" | "dislike"; body?: string; route: string; appVersion: string }) => void;
}

// 好き嫌い + バグ報告 — 送信前に PII scrub (SEC-002/O40)
export function FeedbackWidget({ route, appVersion, onSend }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const base = { route, appVersion };
  return (
    <div>
      {!open ? (
        <button type="button" aria-label="フィードバック" onClick={() => setOpen(true)} style={{ minHeight: "var(--tap-min)" }}>
          ご意見
        </button>
      ) : (
        <div role="dialog" aria-label="フィードバック">
          <button type="button" aria-label="いいね" onClick={() => onSend({ kind: "reaction", reaction: "like", ...base })}>👍</button>
          <button type="button" aria-label="よくない" onClick={() => onSend({ kind: "reaction", reaction: "dislike", ...base })}>👎</button>
          <textarea aria-label="気づいたこと" value={body} maxLength={2000} onChange={(e) => setBody(e.target.value)} />
          <button
            type="button"
            onClick={() => onSend({ kind: "bug_report", body: scrubPII(body), ...base })}
          >
            送る
          </button>
        </div>
      )}
    </div>
  );
}
