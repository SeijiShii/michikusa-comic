import { makeOwnerResolver, sessionProviderFrom, type SessionProvider, type ResolveDeps } from "../src/services/auth/owner.js";

// リクエストから ownerId を解決 (revise_001: guest JWT / Clerk JWT を iss で振り分け)。
// Authorization: Bearer <jwt> を resolveOwner に渡す。guest JWT は自前検証、Clerk JWT は verifyClerk に委譲。
// verifyClerk の実装は @clerk/backend (release で実キー注入)。現状は header フォールバックも許容。
export function sessionFromReq(
  req: { headers: Record<string, string | string[] | undefined> },
  deps?: Partial<ResolveDeps>,
): SessionProvider {
  const resolveDeps: ResolveDeps = {
    guestSecret: deps?.guestSecret ?? process.env.GUEST_TOKEN_SECRET ?? "",
    verifyClerk: deps?.verifyClerk ?? (async () => {
      // release で @clerk/backend の getAuth(req).userId に差し替え。
      // 暫定: Clerk middleware が付与する header を読む (未設定なら未認証)。
      const h = req.headers["x-clerk-user-id"];
      const id = Array.isArray(h) ? h[0] : h;
      return id ?? null;
    }),
    now: deps?.now,
  };
  return sessionProviderFrom(req.headers["authorization"], resolveDeps);
}
export { makeOwnerResolver };
