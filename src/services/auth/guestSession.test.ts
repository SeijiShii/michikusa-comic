import { describe, it, expect, vi } from "vitest";
import { establishGuestSession, type ClerkBackend } from "./guestSession.js";
import { makeOwnerResolver, type SessionProvider } from "./owner.js";

// 本番経路のロジックを mock Clerk で検証 (実キー検証は release)
describe("establishGuestSession (P4.46 本番経路)", () => {
  const clerk: ClerkBackend = {
    createAnonymousUser: vi.fn(async () => ({ id: "guest-xyz" })),
    createSignInToken: vi.fn(async (id) => ({ token: `ticket-${id}` })),
  };
  it("匿名 user 発行 + sign-in ticket 発行", async () => {
    const t = await establishGuestSession(clerk);
    expect(t.userId).toBe("guest-xyz");
    expect(t.token).toBe("ticket-guest-xyz");
    expect(clerk.createAnonymousUser).toHaveBeenCalledOnce();
    expect(clerk.createSignInToken).toHaveBeenCalledWith("guest-xyz");
  });
  it("確立したゲストセッション→保護 API が authed owner で通る(200相当, 401でない)", async () => {
    const t = await establishGuestSession(clerk);
    // 確立後、セッションは t.userId を返す (ticket 確立をシミュレート)
    const established: SessionProvider = { getOwnerId: async () => t.userId };
    const owner = await makeOwnerResolver(established).requireOwner();
    expect(owner).toBe("guest-xyz"); // 401 でなく authed owner
  });
});
