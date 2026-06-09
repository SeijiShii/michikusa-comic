export interface CollectionScreenProps {
  yearMonth: string;
  count: number;
  onOpen: () => void;
}
export function CollectionScreen({ yearMonth, count, onOpen }: CollectionScreenProps) {
  return (
    <section>
      <h2>{yearMonth} の道草</h2>
      {count === 0 ? <p style={{ color: "var(--text-secondary)" }}>この月の道草はまだありません。</p>
        : <button type="button" onClick={onOpen} style={{ minHeight: "var(--tap-min)" }}>{count} 本の道草をまとめて見る</button>}
    </section>
  );
}
