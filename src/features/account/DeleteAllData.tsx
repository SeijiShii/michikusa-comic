import { useState } from "react";

export interface DeleteAllDataProps {
  onConfirmDelete: () => void;  // 全データ削除 (db cascade + R2 purge, SEC-001/O54)
}

// セルフサービス全データ削除 — 二段階確認 (DSR 非交渉の必須、O54)
export function DeleteAllData({ onConfirmDelete }: DeleteAllDataProps) {
  const [confirming, setConfirming] = useState(false);
  return (
    <section>
      <h2>データの管理</h2>
      <p style={{ color: "var(--text-secondary)" }}>
        運営側ではあなたを特定できないため、データの確認・削除はこの画面からご自身で行えます。
      </p>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          style={{ minHeight: "var(--tap-min)", color: "var(--state-danger)", borderRadius: "var(--radius-lg)" }}
        >
          すべてのデータを削除
        </button>
      ) : (
        <div role="alertdialog" aria-label="削除の確認">
          <p>すべての作品・写真が消えます。元に戻せません。よろしいですか？</p>
          <button type="button" onClick={() => setConfirming(false)}>やめる</button>
          <button
            type="button"
            onClick={onConfirmDelete}
            style={{ background: "var(--state-danger)", color: "#fff", minHeight: "var(--tap-min)" }}
          >
            削除する
          </button>
        </div>
      )}
    </section>
  );
}
