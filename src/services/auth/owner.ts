import { mkOwnerId, type OwnerId } from "../../types/index.js";
import { peekIss, verifyGuestToken, GUEST_ISS } from "./guestToken.js";

// SessionProvider — 実装は Clerk backend (release 時に実キーで注入)。
// テストは mock provider を注入 (injectable、Class A)。
export interface SessionProvider {
  getOwnerId(): Promise<string | null>;
}

export class UnauthorizedError extends Error {
  status = 401 as const;
  constructor() {
    super("認証が必要です");
    this.name = "UnauthorizedError";
  }
}

export interface OwnerResolver {
  requireOwner(): Promise<OwnerId>;
  getOwnerId(): Promise<OwnerId | null>;
}

export function makeOwnerResolver(provider: SessionProvider): OwnerResolver {
  return {
    async requireOwner() {
      const id = await provider.getOwnerId();
      if (!id) throw new UnauthorizedError();
      return mkOwnerId(id);
    },
    async getOwnerId() {
      const id = await provider.getOwnerId();
      return id ? mkOwnerId(id) : null;
    },
  };
}

// resolveOwner — Authorization: Bearer <jwt> から owner を解決 (iss でルーティング)。
// guest JWT (iss=michikusa-guest) は verifyGuestToken で sub、それ以外は Clerk 検証に委譲。
// ⚠️ client 送信の生 owner_id は一切信用しない (SEC-001/SEC-004)。サーバ署名/検証済みのみ採用。
export interface ResolveDeps {
  guestSecret: string;
  // Clerk JWT を検証して userId を返す (実装は @clerk/backend、release で注入)。無効は null。
  verifyClerk(token: string): Promise<string | null>;
  now?: number;
}

export async function resolveOwner(
  authHeader: string | string[] | undefined,
  deps: ResolveDeps,
): Promise<OwnerId | null> {
  const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!raw) return null;
  const m = /^Bearer\s+(.+)$/i.exec(raw.trim());
  if (!m) return null;
  const token = m[1];
  try {
    if (peekIss(token) === GUEST_ISS) {
      const sub = verifyGuestToken(token, deps.guestSecret, deps.now);
      return mkOwnerId(sub);
    }
    const userId = await deps.verifyClerk(token);
    return userId ? mkOwnerId(userId) : null;
  } catch {
    return null; // 検証失敗 = 未認証 (requireOwner 側で 401)
  }
}

// SessionProvider をヘッダ + resolveOwner から構築 (api ハンドラ用)
export function sessionProviderFrom(
  authHeader: string | string[] | undefined,
  deps: ResolveDeps,
): SessionProvider {
  return { getOwnerId: () => resolveOwner(authHeader, deps) };
}

// withOwner — API ハンドララッパ。未認証は UnauthorizedError(401)、認証済は ownerId 注入 (SEC-004)
export function withOwner<T>(
  provider: SessionProvider,
  handler: (ownerId: OwnerId) => Promise<T>,
): () => Promise<T> {
  const resolver = makeOwnerResolver(provider);
  return async () => {
    const ownerId = await resolver.requireOwner();
    return handler(ownerId);
  };
}
