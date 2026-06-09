import { describe, it, expect } from "vitest";
import { makeOwnerResolver, withOwner, UnauthorizedError, type SessionProvider } from "./owner.js";

const authed: SessionProvider = { getOwnerId: async () => "user-1" };
const guest: SessionProvider = { getOwnerId: async () => "guest-abc" };
const anon: SessionProvider = { getOwnerId: async () => null };

describe("owner resolver (SEC-004 / O23)", () => {
  it("N-1 requireOwner 認証済→ownerId", async () => {
    expect(await makeOwnerResolver(authed).requireOwner()).toBe("user-1");
  });
  it("N-2 getOwnerId ゲスト→匿名 ownerId", async () => {
    expect(await makeOwnerResolver(guest).getOwnerId()).toBe("guest-abc");
  });
  it("E-1 requireOwner 未認証→401", async () => {
    await expect(makeOwnerResolver(anon).requireOwner()).rejects.toBeInstanceOf(UnauthorizedError);
  });
  it("getOwnerId 未認証→null", async () => {
    expect(await makeOwnerResolver(anon).getOwnerId()).toBeNull();
  });
  it("withOwner 認証済→handler に ownerId 注入(200相当)", async () => {
    const h = withOwner(authed, async (o) => `ok:${o}`);
    expect(await h()).toBe("ok:user-1");
  });
  it("withOwner 未認証→401(handler 実行されない)", async () => {
    let ran = false;
    const h = withOwner(anon, async () => { ran = true; return "x"; });
    await expect(h()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(ran).toBe(false);
  });
});
