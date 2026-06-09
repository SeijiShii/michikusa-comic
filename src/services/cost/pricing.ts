// 単価は .env で管理 (ハードコード禁止、§4.6.2)。キーは `${provider}.${metric}`
export type PriceTable = Record<string, number>;

// 環境変数 COST_<PROVIDER>_<METRIC>=<USD> から単価表を構築
export function loadPriceTable(env: Record<string, string | undefined>): PriceTable {
  const table: PriceTable = {};
  for (const [k, v] of Object.entries(env)) {
    if (!k.startsWith("COST_") || v == null) continue;
    const num = Number(v);
    if (Number.isFinite(num)) table[k] = num;
  }
  return table;
}

// 概算コスト = 単価 × 数量。単価未設定は null (記録は継続、§4.6.2)
export function estimateCost(table: PriceTable, costKey: string, quantity: number): number | null {
  const unit = table[costKey];
  if (unit == null) return null;
  return Math.round(unit * quantity * 1e6) / 1e6;
}

// 無料枠超過判定 (80/100/120%)
export type AlertLevel = "ok" | "warn80" | "over100" | "over120";
export function checkFreeTier(usedUsd: number, freeTierUsd: number): AlertLevel {
  if (freeTierUsd <= 0) return "ok";
  const ratio = usedUsd / freeTierUsd;
  if (ratio >= 1.2) return "over120";
  if (ratio >= 1.0) return "over100";
  if (ratio >= 0.8) return "warn80";
  return "ok";
}
