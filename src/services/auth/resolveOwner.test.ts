import { describe, it, expect, vi } from "vitest";
import { resolveOwner, type ResolveDeps } from "./owner.js";
import { signGuestToken, genGuestSub } from "./guestToken.js";

const SECRET = "test-secret-abc";

describe("resolveOwner (iss ルーティング)", () => {
  const verifyClerk = vi.fn(async (t: string) => (t === "clerk-valid" ? "clerk_user_1" : null));
  const deps: ResolveDeps = { guestSecret: SECRET, verifyClerk };

  it("U3: guest JWT (iss=michikusa-guest) → sub を owner に", async () => {
    const sub = genGuestSub();
    const tok = signGuestToken(sub, SECRET);
    expect(await resolveOwner(`Bearer ${tok}`, deps)).toBe(sub);
  });

  it("U4: Clerk JWT → verifyClerk の userId", async () => {
    expect(await resolveOwner("Bearer clerk-valid", deps)).toBe("clerk_user_1");
  });

  it("U11: Bearer 無は null", async () => {
    expect(await resolveOwner(undefined, deps)).toBeNull();
    expect(await resolveOwner("Basic xxx", deps)).toBeNull();
  });

  it("無効 Clerk token は null (401 化)", async () => {
    expect(await resolveOwner("Bearer clerk-invalid", deps)).toBeNull();
  });

  it("改竄 guest JWT は null (検証失敗を握りつぶさず未認証扱い)", async () => {
    const tok = signGuestToken(genGuestSub(), SECRET).slice(0, -2) + "xx";
    expect(await resolveOwner(`Bearer ${tok}`, deps)).toBeNull();
  });

  it("配列ヘッダ (複数値) は先頭を採用", async () => {
    const tok = signGuestToken(genGuestSub(), SECRET);
    expect(await resolveOwner([`Bearer ${tok}`, "Bearer other"], deps)).toBeTruthy();
  });
});
