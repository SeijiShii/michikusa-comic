import { describe, it, expect } from "vitest";
import { mapEventToStatus, IdempotencyGuard, verifyOrThrow, SignatureError } from "./webhook.js";

describe("payments webhook", () => {
  it("N-2 イベント→status マップ", () => {
    expect(mapEventToStatus("checkout.session.completed")).toBe("paid");
    expect(mapEventToStatus("payment_intent.payment_failed")).toBe("failed");
    expect(mapEventToStatus("charge.refunded")).toBe("refunded");
    expect(mapEventToStatus("unknown.event")).toBeNull();
  });
  it("E-2 冪等: 同イベントは1回だけ処理", () => {
    const g = new IdempotencyGuard();
    expect(g.shouldProcess("evt1")).toBe(true);
    expect(g.shouldProcess("evt1")).toBe(false);
    expect(g.shouldProcess("evt2")).toBe(true);
  });
  it("E-1 署名検証失敗→SignatureError(400)", () => {
    expect(() => verifyOrThrow(() => false)).toThrow(SignatureError);
    expect(() => verifyOrThrow(() => true)).not.toThrow();
  });
});
