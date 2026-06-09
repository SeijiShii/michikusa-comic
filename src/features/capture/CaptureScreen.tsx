import { useState } from "react";
import { validateImageFile, validatePhotoCount } from "../../lib/validation.js";

export interface CaptureScreenProps {
  onSubmit: (files: File[], caption: string) => void;
}

// 取込画面 — 写真選択 + ひとこと (design-system 準拠、O38 やさしいコピー)
export function CaptureScreen({ onSubmit }: CaptureScreenProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleFiles(list: FileList | null) {
    const arr = Array.from(list ?? []);
    const countCheck = validatePhotoCount(arr.length);
    if (!countCheck.ok) { setError(countCheck.error!); return; }
    for (const f of arr) {
      const v = validateImageFile(f);
      if (!v.ok) { setError(v.error!); return; }
    }
    setError(null);
    setFiles(arr);
  }

  return (
    <main style={{ background: "var(--bg-base)", color: "var(--text-primary)", padding: "var(--space-4)" }}>
      <p style={{ color: "var(--text-secondary)" }}>散歩で見つけた風景を、4 コマにして残すアプリ</p>
      <h1 style={{ fontSize: 24 }}>道草を 4 コマに</h1>
      <label>
        写真をえらぶ
        <input
          type="file" accept="image/*" multiple
          aria-label="写真をえらぶ"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      <textarea
        aria-label="ひとこと"
        placeholder="ひとこと（任意）"
        value={caption}
        maxLength={500}
        onChange={(e) => setCaption(e.target.value)}
        style={{ background: "var(--bg-sunken)", borderRadius: "var(--radius-md)" }}
      />
      {error && <p role="alert" style={{ color: "var(--state-danger)" }}>{error}</p>}
      <button
        type="button"
        disabled={files.length === 0}
        onClick={() => onSubmit(files, caption)}
        style={{ minHeight: "var(--tap-min)", background: "var(--brand-primary)", color: "var(--brand-primary-ink)", borderRadius: "var(--radius-lg)" }}
      >
        4 コマにする
      </button>
    </main>
  );
}
