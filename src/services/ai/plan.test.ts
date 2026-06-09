import { describe, it, expect } from "vitest";
import { buildComicPlan } from "./plan.js";

describe("buildComicPlan (4コマの型 = 差別化)", () => {
  const u = { subjects: ["猫"], situation: "塀の上にいる" };
  it("N-1 4コマ構成（起承転結）を返す", () => {
    const p = buildComicPlan(u, "塀の上の猫");
    expect(p.panels).toHaveLength(4);
    expect(p.panels.map((x) => x.order)).toEqual([1, 2, 3, 4]);
    expect(p.panels.map((x) => x.role)).toEqual(["起", "承", "転", "結"]);
    expect(p.panels[0].speechDraft).toContain("猫");
  });
  it("B: caption 無しでも構成", () => {
    const p = buildComicPlan(u);
    expect(p.panels).toHaveLength(4);
    expect(p.panels[0].speechDraft.length).toBeGreaterThan(0);
  });
});
