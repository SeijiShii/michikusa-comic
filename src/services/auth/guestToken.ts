// 自前署名 guest JWT (scaffold §1.7、owner churn 根絶)。
// owner-scoped local-first PJ では Clerk セッション(失効する)を owner にせず、
// サーバ署名済みの不透明 token の sub を owner にする → 失効/リロードでも owner 安定。
// HS256 を node:crypto の HMAC で最小実装 (依存追加なし = 可逆、原則14)。
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const GUEST_ISS = "michikusa-guest";
export const GUEST_SUB_PREFIX = "guest_";
const DEFAULT_TTL_SEC = 180 * 24 * 60 * 60; // 180 日 (長命、scaffold §1.7)

export function genGuestSub(): string {
  return `${GUEST_SUB_PREFIX}${randomUUID()}`;
}

export function isGuestSub(sub: string): boolean {
  // guest_<uuid> 形式のみ owner 採用 (U14 境界)
  return /^guest_[0-9a-f-]{36}$/i.test(sub);
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

interface GuestClaims {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface SignOpts {
  ttlSec?: number;
  now?: number; // テスト用 (epoch sec)
}

export function signGuestToken(sub: string, secret: string, opts: SignOpts = {}): string {
  if (!secret) throw new Error("GUEST_TOKEN_SECRET が未設定です");
  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const claims: GuestClaims = {
    sub,
    iss: GUEST_ISS,
    iat: now,
    exp: now + (opts.ttlSec ?? DEFAULT_TTL_SEC),
  };
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify(claims));
  const sig = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export class GuestTokenError extends Error {
  status = 401 as const;
  constructor(msg: string) { super(msg); this.name = "GuestTokenError"; }
}

// iss を検証前に peek (owner resolver のルーティング用、署名検証はしない)
export function peekIss(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return typeof payload.iss === "string" ? payload.iss : null;
  } catch { return null; }
}

// 署名/iss/exp を検証して sub を返す。不正は GuestTokenError(401)。
export function verifyGuestToken(token: string, secret: string, now?: number): string {
  const parts = token.split(".");
  if (parts.length !== 3) throw new GuestTokenError("token 形式が不正です");
  const [header, payload, sig] = parts;
  const expected = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new GuestTokenError("署名検証に失敗しました");
  let claims: GuestClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch { throw new GuestTokenError("payload が不正です"); }
  if (claims.iss !== GUEST_ISS) throw new GuestTokenError("iss が一致しません");
  const t = now ?? Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp < t) throw new GuestTokenError("token が期限切れです");
  if (!isGuestSub(claims.sub)) throw new GuestTokenError("sub 形式が不正です");
  return claims.sub;
}
