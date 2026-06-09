export interface ShareButtonProps {
  title: string;
  onExportBlob: () => Promise<Blob>; // stripGeoExif 済の合成画像 (SEC-002)
  share?: (data: { files: File[]; title: string }) => Promise<void>;
}
export function ShareButton({ title, onExportBlob, share }: ShareButtonProps) {
  async function handle() {
    const blob = await onExportBlob();
    const file = new File([blob], "michikusa.png", { type: "image/png" });
    if (share) await share({ files: [file], title });
  }
  return (
    <button type="button" onClick={handle} style={{ minHeight: "var(--tap-min)" }} aria-label="画像にして共有">
      画像にして共有
    </button>
  );
}
