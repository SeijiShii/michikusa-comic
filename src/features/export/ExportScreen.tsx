export interface ExportScreenProps {
  priceJpy: number;
  onCheckout: () => void;
}
// O43: 金額+対価を CTA より前・ファーストビューに明示
export function ExportScreen({ priceJpy, onCheckout }: ExportScreenProps) {
  return (
    <section>
      <h2>高画質で残す</h2>
      <p>この 4 コマを高画質画像（印刷もできます）で書き出します。</p>
      <p data-testid="price" style={{ fontWeight: "bold" }}>{priceJpy}円で 1 作品を高画質書き出し</p>
      <button type="button" onClick={onCheckout} style={{ minHeight: "var(--tap-min)", background: "var(--brand-primary)", color: "var(--brand-primary-ink)" }}>
        購入して書き出す
      </button>
    </section>
  );
}
