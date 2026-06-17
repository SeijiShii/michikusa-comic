import { describe, it, expect, vi } from "vitest";
import { provisionGuest, type GuestStoreDeps } from "./guestSession.js";
import { verifyGuestToken, isGuestSub } from "./guestToken.js";
import { makeOwnerResolver, type SessionProvider } from "./owner.js";

const SECRET = "test-secret-abc";

// O22(D) churn 根絶: provisionGuest は guest JWT を発行し Clerk createUser を呼ばない
describe("provisionGuest (P4.46 本番経路 / scaffold §1.7)", () => {
  it("U2: 匿名行 upsert + guest JWT 発行、Clerk createUser は呼ばない", async () => {
    const deps: GuestStoreDeps = { upsertGuestRow: vi.fn(async () => {}), secret: SECRET };
    const g = await provisionGuest(deps);
    expect(isGuestSub(g.sub)).toBe(true);
    expect(deps.upsertGuestRow).toHaveBeenCalledWith(g.sub);
    expect(verifyGuestToken(g.guestToken, SECRET)).toBe(g.sub);
  });

  it("M2: guest JWT の sub → 保護 API が authed owner で通る (401 でない)", async () => {
    const deps: GuestStoreDeps = { upsertGuestRow: vi.fn(async () => {}), secret: SECRET };
    const g = await provisionGuest(deps);
    const established: SessionProvider = { getOwnerId: async () => g.sub };
    const owner = await makeOwnerResolver(established).requireOwner();
    expect(owner).toBe(g.sub);
  });

  it("D1: provision ごとに新規 sub (再利用は guestStore が担う、U5)", async () => {
    const deps: GuestStoreDeps = { upsertGuestRow: vi.fn(async () => {}), secret: SECRET };
    const a = await provisionGuest(deps);
    const b = await provisionGuest(deps);
    expect(a.sub).not.toBe(b.sub);
  });
});
