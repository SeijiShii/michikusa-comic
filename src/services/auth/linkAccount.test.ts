import { describe, it, expect, vi } from "vitest";
import {
  isExistingAccountError, decideAfterCallback, handleLinkCallback, startLinkGoogle,
  type LinkDeps,
} from "./linkAccount.js";
import { getStoredGuestToken, storeGuestToken, type KVStore } from "./guestStore.js";

function memStore(): KVStore {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
  };
}

describe("linkAccount (O22(B) scaffold §1.6)", () => {
  it("isExistingAccountError: external_account_exists 系を検知", () => {
    expect(isExistingAccountError("external_account_exists")).toBe(true);
    expect(isExistingAccountError("identification_claimed")).toBe(true);
    expect(isExistingAccountError(null)).toBe(false);
    expect(isExistingAccountError("oauth_access_denied")).toBe(false);
  });

  it("decideAfterCallback: 新規=linked / 既存=fallback / 既 fallback=loop-stop", () => {
    expect(decideAfterCallback(null, false)).toBe("linked");
    expect(decideAfterCallback("external_account_exists", false)).toBe("signin-fallback");
    expect(decideAfterCallback("external_account_exists", true)).toBe("loop-stop"); // U13
  });

  function deps(): LinkDeps {
    return {
      store: memStore(),
      startGoogleLink: vi.fn(async () => {}),
      signInWithGoogle: vi.fn(async () => {}),
      flags: memStore(),
    };
  }

  it("U6: 新規連携成功 → guest token クリア", async () => {
    const d = deps();
    storeGuestToken(d.store, "guest-tok");
    const outcome = await handleLinkCallback(d, null);
    expect(outcome).toBe("linked");
    expect(getStoredGuestToken(d.store)).toBeNull();
  });

  it("U12: 既存アカウント → sign-in fallback 呼び出し + フラグ立て", async () => {
    const d = deps();
    const outcome = await handleLinkCallback(d, "external_account_exists");
    expect(outcome).toBe("signin-fallback");
    expect(d.signInWithGoogle).toHaveBeenCalledOnce();
    expect(d.flags.getItem("michikusa.linkFallback")).toBe("1");
  });

  it("U13: 既に fallback 済なら loop-stop (二重リダイレクト抑止)", async () => {
    const d = deps();
    d.flags.setItem("michikusa.linkFallback", "1");
    const outcome = await handleLinkCallback(d, "external_account_exists");
    expect(outcome).toBe("loop-stop");
    expect(d.signInWithGoogle).not.toHaveBeenCalled();
  });

  it("startLinkGoogle は createExternalAccount を起動", async () => {
    const d = deps();
    await startLinkGoogle(d);
    expect(d.startGoogleLink).toHaveBeenCalledOnce();
  });
});
