export interface LegalFooterProps { onNavigate: (path: string) => void; }
export function LegalFooter({ onNavigate }: LegalFooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--border-soft)", color: "var(--text-secondary)" }}>
      <button type="button" onClick={() => onNavigate("/legal/privacy")}>プライバシーポリシー</button>
      <button type="button" onClick={() => onNavigate("/legal/terms")}>利用規約</button>
      <button type="button" onClick={() => onNavigate("/legal/specified-commercial-transactions")}>特定商取引法に基づく表記</button>
    </footer>
  );
}
