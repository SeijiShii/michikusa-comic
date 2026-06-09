import { describe, it, expect } from "vitest";
import { photoKey, panelKey, exportKey, isOwnerKey } from "./keys.js";

describe("storage keys (SEC-004 ownerId 境界)", () => {
  it("N-1 各キーに ownerId が含まれる", () => {
    expect(photoKey("u1", "abc", "jpg")).toBe("photos/u1/abc.jpg");
    expect(photoKey("u1", "abc", ".png")).toBe("photos/u1/abc.png");
    expect(panelKey("u1", "c1", 2)).toBe("panels/u1/c1/2.png");
    expect(exportKey("u1", "c1", "high")).toBe("exports/u1/c1/high.png");
  });
  it("N: isOwnerKey 自分のキー→true", () => {
    expect(isOwnerKey("photos/u1/abc.jpg", "u1")).toBe(true);
    expect(isOwnerKey("panels/u1/c1/1.png", "u1")).toBe(true);
  });
  it("E-1: 他人のキー→false (SEC-004)", () => {
    expect(isOwnerKey("photos/u2/abc.jpg", "u1")).toBe(false);
    expect(isOwnerKey("bad-key", "u1")).toBe(false);
    expect(isOwnerKey("photos//abc.jpg", "u1")).toBe(false);
  });
});
