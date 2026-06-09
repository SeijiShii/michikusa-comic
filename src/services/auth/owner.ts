import { mkOwnerId, type OwnerId } from "../../types/index.js";

// SessionProvider — 実装は Clerk backend (release 時に実キーで注入)。
// テストは mock provider を注入 (injectable、Class A)。
export interface SessionProvider {
  getOwnerId(): Promise<string | null>;
}

export class UnauthorizedError extends Error {
  status = 401 as const;
  constructor() { super("認証が必要です"); this.name = "UnauthorizedError"; }
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
