// resolveArea — 緯度経度 → 大まかな地域名 (MVP: ローカル簡易テーブル, 外部逆ジオなし)
// 日本の大まかな緯度帯による簡易判定 (プライバシー配慮・コストゼロ)
export function resolveArea(lat?: number, lng?: number): string {
  if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "エリア未設定";
  }
  if (lat < 24 || lat > 46 || lng < 122 || lng > 154) return "エリア未設定"; // 日本域外
  if (lat >= 40) return "北海道・東北";
  if (lat >= 35.5) return "関東・甲信越";
  if (lat >= 34) return "中部・近畿";
  if (lat >= 33) return "中国・四国";
  return "九州・沖縄";
}
