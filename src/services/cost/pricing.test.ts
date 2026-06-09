import { describe, it, expect } from "vitest";
import { loadPriceTable, estimateCost, checkFreeTier } from "./pricing.js";

describe("pricing (§4.6.2)", () => {
  const env = {
    COST_GEMINI_IMAGE_PER_GEN: "0.02",
    COST_OPENAI_GPT4O_MINI_PER_1K_INPUT: "0.00015",
    OTHER: "ignore",
    COST_BAD: "not-a-number",
  };
  it("N-1 loadPriceTable は COST_ のみ拾う", () => {
    const t = loadPriceTable(env);
    expect(t.COST_GEMINI_IMAGE_PER_GEN).toBe(0.02);
    expect(t.OTHER).toBeUndefined();
    expect(t.COST_BAD).toBeUndefined();
  });
  it("N-2 estimateCost = 単価×数量", () => {
    const t = loadPriceTable(env);
    expect(estimateCost(t, "COST_GEMINI_IMAGE_PER_GEN", 10)).toBeCloseTo(0.2);
  });
  it("E-1 単価未設定→null", () => {
    expect(estimateCost(loadPriceTable(env), "COST_UNKNOWN", 5)).toBeNull();
  });
  it("checkFreeTier 80/100/120% 境界", () => {
    expect(checkFreeTier(7.9, 10)).toBe("ok");
    expect(checkFreeTier(8, 10)).toBe("warn80");
    expect(checkFreeTier(10, 10)).toBe("over100");
    expect(checkFreeTier(12, 10)).toBe("over120");
    expect(checkFreeTier(5, 0)).toBe("ok");
  });
});
