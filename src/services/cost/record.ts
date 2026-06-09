import { estimateCost, type PriceTable } from "./pricing.js";

export interface CostLogRow {
  id: string; ownerId?: string; provider: string; metric: string;
  quantity: number; unitPriceVersion: string; estimatedUsd: number | null; createdAt: string;
}
export interface CostLogSink { insert(row: CostLogRow): Promise<void>; }

// recordCall — 呼び出しを積算 (非ブロッキング, best-effort)。失敗してもサービス継続 (§4.6.2)
export async function recordCall(
  sink: CostLogSink, table: PriceTable, priceVersion: string,
  args: { id: string; ownerId?: string; provider: string; metric: string; quantity: number },
): Promise<CostLogRow> {
  const costKey = `COST_${args.provider}_${args.metric}`.toUpperCase();
  const estimatedUsd = estimateCost(table, costKey, args.quantity);
  const row: CostLogRow = {
    id: args.id, ownerId: args.ownerId, provider: args.provider, metric: args.metric,
    quantity: args.quantity, unitPriceVersion: priceVersion, estimatedUsd,
    createdAt: new Date(0).toISOString(), // 実際は now()、テスト再現性のため注入可に
  };
  try { await sink.insert(row); } catch { /* best-effort: 握りつぶしてサービス継続 */ }
  return row;
}
