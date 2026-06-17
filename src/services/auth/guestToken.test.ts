import { describe, it, expect } from "vitest";
import {
  genGuestSub,
  isGuestSub,
  signGuestToken,
  verifyGuestToken,
  peekIss,
  GUEST_ISS,
  GuestTokenError,
} from "./guestToken.js";

const SECRET = "test-secret-abc";

describe("guestToken (scaffold §1.7 自前署名 guest JWT)", () => {
  it("U1: sign→verify 往復で同 sub", () => {
    const sub = genGuestSub();
    const tok = signGuestToken(sub, SECRET);
    expect(verifyGuestToken(tok, SECRET)).toBe(sub);
  });

  it("genGuestSub は guest_<uuid> 形式", () => {
    expect(isGuestSub(genGuestSub())).toBe(true);
    expect(isGuestSub("clerk_user_123")).toBe(false);
  });

  it("peekIss は検証なしで iss を返す", () => {
    const tok = signGuestToken(genGuestSub(), SECRET);
    expect(peekIss(tok)).toBe(GUEST_ISS);
    expect(peekIss("not.a.jwt-ish")).toBeNull(); // 3 parts だが payload が不正 JSON
    expect(peekIss("bad")).toBeNull(); // parts 不足
  });

  it("U8: 改竄 token は GuestTokenError", () => {
    const tok = signGuestToken(genGuestSub(), SECRET);
    const tampered = tok.slice(0, -3) + "xxx";
    expect(() => verifyGuestToken(tampered, SECRET)).toThrow(GuestTokenError);
  });

  it("U8b: 別 secret では検証失敗", () => {
    const tok = signGuestToken(genGuestSub(), SECRET);
    expect(() => verifyGuestToken(tok, "other-secret")).toThrow(
      GuestTokenError,
    );
  });

  it("U9: 期限切れは GuestTokenError", () => {
    const sub = genGuestSub();
    const tok = signGuestToken(sub, SECRET, { ttlSec: 100, now: 1000 });
    expect(verifyGuestToken(tok, SECRET, 1050)).toBe(sub); // 期限内
    expect(() => verifyGuestToken(tok, SECRET, 2000)).toThrow(/期限/);
  });

  it("U10: iss 不一致 (他サービス token) は拒否", async () => {
    // iss を別物に差し替えた payload を手作り → 署名は正しいが iss が違う
    const sub = genGuestSub();
    const now = 1000;
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" }),
    ).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({ sub, iss: "other-service", iat: now, exp: now + 1000 }),
    ).toString("base64url");
    const { createHmac } = await import("node:crypto");
    const sig = createHmac("sha256", SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");
    expect(() =>
      verifyGuestToken(`${header}.${payload}.${sig}`, SECRET, now + 1),
    ).toThrow(/iss/);
  });

  it("secret 未設定で sign は throw", () => {
    expect(() => signGuestToken(genGuestSub(), "")).toThrow();
  });
});
