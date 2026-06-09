import type { Comic } from "../../types/index.js";

export interface GalleryScreenProps {
  comics: Pick<Comic, "id" | "title" | "area" | "createdAt">[];
  onOpen: (id: string) => void;
}
export function GalleryScreen({ comics, onOpen }: GalleryScreenProps) {
  if (comics.length === 0) {
    return <p style={{ color: "var(--text-secondary)" }}>まだ道草がありません。さんぽで見つけた風景を 4 コマにしてみましょう。</p>;
  }
  return (
    <ul style={{ display: "grid", gap: "var(--space-3)", listStyle: "none", padding: 0 }}>
      {comics.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => onOpen(c.id)} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", minHeight: "var(--tap-min)", width: "100%", textAlign: "left" }}>
            <span>{c.title || "無題の道草"}</span>
            {c.area && <small style={{ color: "var(--text-secondary)" }}> ・{c.area}</small>}
          </button>
        </li>
      ))}
    </ul>
  );
}
