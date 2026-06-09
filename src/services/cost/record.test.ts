import { describe, it, expect } from "vitest";
import { recordCall, type CostLogRow, type CostLogSink } from "./record.js";

function makeSink() {
  const rows: CostLogRow[] = [];
  const sink: CostLogSink = { insert: async (r) => { rows.push(r); } };
  return { sink, rows };
}
const table = { COST_GEMINI_PER_GEN: 0.02 };

describe("cost record (§4.6.2)", () => {
  it("N-2 recordCall は estimatedUsd を算出して insert", async () => {
    const { sink, rows } = makeSink();
    const row = await recordCall(sink, table, "v1", { id: "r1", provider: "gemini", metric: "per_gen", quantity: 5 });
    expect(row.estimatedUsd).toBeCloseTo(0.1);
    expect(rows).toHaveLength(1);
  });
  it("E-1 単価未設定→estimatedUsd=null でも記録継続", async () => {
    const { sink, rows } = makeSink();
    const row = await recordCall(sink, table, "v1", { id: "r2", provider: "unknown", metric: "x", quantity: 3 });
    expect(row.estimatedUsd).toBeNull();
    expect(rows).toHaveLength(1);
  });
  it("E-2 sink 失敗でも throw しない (best-effort)", async () => {
    const sink: CostLogSink = { insert: async () => { throw new Error("db down"); } };
    await expect(recordCall(sink, table, "v1", { id: "r3", provider: "gemini", metric: "per_gen", quantity: 1 })).resolves.toBeDefined();
  });
});
