import { describe, it, expect } from "vitest";
import { formatYearMonth } from "./date.js";
import { scrubPII } from "./privacy.js";
import { resolveArea } from "./area.js";
import { validateImageFile, validatePhotoCount } from "./validation.js";

describe("formatYearMonth", () => {
  it("N-1 Date→YYYY-MM", () => {
    expect(formatYearMonth(new Date("2026-06-09T10:00:00Z"))).toBe("2026-06");
    expect(formatYearMonth(new Date("2026-01-01T00:00:00Z"))).toBe("2026-01");
  });
});

describe("scrubPII (SEC-002)", () => {
  it("N-5 メール/電話/位置をマスク", () => {
    expect(scrubPII("連絡は a@b.com まで")).toContain("[メール]");
    expect(scrubPII("電話 090-1234-5678")).toContain("[電話番号]");
    expect(scrubPII("35.681, 139.767 で発見")).toContain("[位置]");
  });
  it("B-2 PII 無しは無変更", () => {
    expect(scrubPII("猫が可愛い")).toBe("猫が可愛い");
  });
});

describe("resolveArea", () => {
  it("N: 関東", () => { expect(resolveArea(35.68, 139.76)).toBe("関東・甲信越"); });
  it("N: 北海道東北", () => { expect(resolveArea(43.06, 141.35)).toBe("北海道・東北"); });
  it("E-3: 不正/域外→未設定", () => {
    expect(resolveArea(undefined, undefined)).toBe("エリア未設定");
    expect(resolveArea(NaN, 10)).toBe("エリア未設定");
    expect(resolveArea(0, 0)).toBe("エリア未設定");
  });
});

describe("validateImageFile (SEC-005)", () => {
  it("N-4 有効", () => { expect(validateImageFile({ type: "image/jpeg", size: 1000 }).ok).toBe(true); });
  it("E-1 不正MIME/サイズ超過/空", () => {
    expect(validateImageFile({ type: "application/pdf", size: 1000 }).ok).toBe(false);
    expect(validateImageFile({ type: "image/png", size: 20 * 1024 * 1024 }).ok).toBe(false);
    expect(validateImageFile({ type: "image/png", size: 0 }).ok).toBe(false);
  });
  it("B-3 サイズ上限ちょうど/+1", () => {
    expect(validateImageFile({ type: "image/jpeg", size: 15 * 1024 * 1024 }).ok).toBe(true);
    expect(validateImageFile({ type: "image/jpeg", size: 15 * 1024 * 1024 + 1 }).ok).toBe(false);
  });
  it("B-1 枚数 1/上限/上限+1", () => {
    expect(validatePhotoCount(1).ok).toBe(true);
    expect(validatePhotoCount(4).ok).toBe(true);
    expect(validatePhotoCount(5).ok).toBe(false);
    expect(validatePhotoCount(0).ok).toBe(false);
  });
});
