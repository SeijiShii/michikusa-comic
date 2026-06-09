import { makeOwnerResolver, type SessionProvider } from "../src/services/auth/owner.js";

// リクエストから ownerId を解決。実 Clerk は @clerk/backend で getAuth(req).userId を返す配線 (release)。
// 現状は Clerk middleware が付与する header を読む (未設定なら未認証)。
export function sessionFromReq(req: { headers: Record<string, string | string[] | undefined> }): SessionProvider {
  return {
    async getOwnerId() {
      const h = req.headers["x-clerk-user-id"];
      const id = Array.isArray(h) ? h[0] : h;
      return id ?? null;
    },
  };
}
export { makeOwnerResolver };
