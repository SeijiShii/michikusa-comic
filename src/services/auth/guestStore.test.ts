import { describe, it, expect, vi } from "vitest";
import {
  getStoredGuestToken, storeGuestToken, clearGuestToken, ensureGuestToken,
  GUEST_TOKEN_KEY, type KVStore,
} from "./guestStore.js";

function memStore(): KVStore {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
  };
}

describe("guestStore (client 永続)", () => {
  it("store→get 往復", () => {
    const s = memStore();
    storeGuestToken(s, "tok-1");
    expect(getStoredGuestToken(s)).toBe("tok-1");
    expect(s.getItem(GUEST_TOKEN_KEY)).toBe("tok-1");
  });

  it("U5: 既存 token あり → ensureGuestToken は fetch せず再利用 (no-op)", async () => {
    const s = memStore();
    storeGuestToken(s, "existing");
    const fetchToken = vi.fn(async () => "fresh");
    const got = await ensureGuestToken(s, fetchToken);
    expect(got).toBe("existing");
    expect(fetchToken).not.toHaveBeenCalled();
  });

  it("token 無 → fetch して永続", async () => {
    const s = memStore();
    const fetchToken = vi.fn(async () => "fresh");
    const got = await ensureGuestToken(s, fetchToken);
    expect(got).toBe("fresh");
    expect(fetchToken).toHaveBeenCalledOnce();
    expect(getStoredGuestToken(s)).toBe("fresh");
  });

  it("clear で削除", () => {
    const s = memStore();
    storeGuestToken(s, "x");
    clearGuestToken(s);
    expect(getStoredGuestToken(s)).toBeNull();
  });
});
