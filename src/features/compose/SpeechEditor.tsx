import { useState } from "react";

export interface SpeechEditorProps {
  initial: string[]; // 4 コマのセリフ案
  onSave: (speeches: string[]) => void;
}
export function SpeechEditor({ initial, onSave }: SpeechEditorProps) {
  const [speeches, setSpeeches] = useState<string[]>(initial.slice(0, 4));
  return (
    <div>
      {speeches.map((s, i) => (
        <label key={i}>
          {i + 1}コマめのセリフ
          <input
            aria-label={`${i + 1}コマめのセリフ`}
            value={s}
            maxLength={200}
            onChange={(e) => setSpeeches((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))}
          />
        </label>
      ))}
      <button type="button" onClick={() => onSave(speeches)} style={{ minHeight: "var(--tap-min)", background: "var(--brand-primary)", color: "var(--brand-primary-ink)" }}>
        保存する
      </button>
    </div>
  );
}
