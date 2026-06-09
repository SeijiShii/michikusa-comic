// scrubPII — フィードバック本文等の個人情報を除去 (SEC-002 / O40)
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE = /\b0\d{1,4}-?\d{1,4}-?\d{3,4}\b/g;          // 日本の電話番号(ハイフン任意)
const GEO = /\b-?\d{1,3}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}\b/g; // 緯度,経度
export function scrubPII(text: string): string {
  return text
    .replace(EMAIL, "[メール]")
    .replace(GEO, "[位置]")
    .replace(PHONE, "[電話番号]");
}
