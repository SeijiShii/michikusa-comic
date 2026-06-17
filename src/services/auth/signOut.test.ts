import { describe, it, expect, vi } from "vitest";
import { signOut, type SignOutDeps } from "./signOut.js";
import { storeGuestToken, getStoredGuestToken, type KVStore } from "./guestStore.js";

function memStore(): KVStore {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
  };
}

describe("signOut (O22(E) 両輪、audit step 3.10)", () => {
  it("U7: Clerk セッション破棄 → 旧 guest token 破棄 → 新ゲストへ", async () => {
    const store = memStore();
    storeGuestToken(store, "old-authed-leftover");
    const deps: SignOutDeps = {
      store,
      clerkSignOut: vi.fn(async () => {}),
      fetchGuestToken: vi.fn(async () => "new-guest-tok"),
    };
    const newTok = await signOut(deps);
    expect(deps.clerkSignOut).toHaveBeenCalledOnce();
    expect(newTok).toBe("new-guest-tok");
    expect(getStoredGuestToken(store)).toBe("new-guest-tok"); // ゲストへ戻れた (行き止まりでない)
  });
});
