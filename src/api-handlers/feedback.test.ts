import { describe, it, expect, vi } from "vitest";
import { handleSubmitFeedback, type FeedbackDeps } from "./feedback.js";

function deps(): FeedbackDeps & { rows: any[] } {
  const rows: any[] = [];
  return { rows, insert: vi.fn(async (r) => { rows.push(r); }), genId: () => "fid" };
}

describe("handleSubmitFeedback (SEC-002/005)", () => {
  it("N: 有効入力で insert", async () => {
    const d = deps();
    const r = await handleSubmitFeedback(d, "u1", { kind: "reaction", reaction: "like", route: "/g" });
    expect(r.ok).toBe(true);
    expect(d.rows[0].reaction).toBe("like");
  });
  it("N: body は受信時も scrub (SEC-002 二重防御)", async () => {
    const d = deps();
    await handleSubmitFeedback(d, "u1", { kind: "bug_report", body: "連絡 a@b.com", route: "/g" });
    expect(d.rows[0].body).toContain("[メール]");
  });
  it("E: 不正入力は 400 相当", async () => {
    const d = deps();
    const r = await handleSubmitFeedback(d, "u1", { kind: "bad" });
    expect(r.ok).toBe(false);
  });
});
