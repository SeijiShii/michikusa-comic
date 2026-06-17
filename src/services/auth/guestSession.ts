// ゲストセッション確立の本番経路 (P4.46 + O22(D) owner churn 根絶、revise_001)。
// scaffold §1.7: owner-scoped local-first のため Clerk ticket 方式 (旧 establishGuestSession) は撤去。
// サーバ自前署名 guest JWT を発行し、owner = guest JWT の sub (Clerk セッション非依存)。
// → トークン失効/リロードでも owner が安定 = データ orphan 化が原理的に起きない。
import { genGuestSub, signGuestToken, type SignOpts } from "./guestToken.js";

// 匿名 user 行を DB に upsert する依存 (injectable、実 DB は release で注入)
export interface GuestStoreDeps {
  upsertGuestRow(sub: string): Promise<void>;
  secret: string;
  signOpts?: SignOpts;
}

export interface ProvisionedGuest {
  sub: string;
  guestToken: string;
}

// provisionGuest — sub 生成 → DB 匿名行 upsert → guest JWT 署名 → 返却。
// ⚠️ Clerk createUser は呼ばない (MAU 非消費、scaffold §1.7)。
export async function provisionGuest(deps: GuestStoreDeps): Promise<ProvisionedGuest> {
  const sub = genGuestSub();
  await deps.upsertGuestRow(sub);
  const guestToken = signGuestToken(sub, deps.secret, deps.signOpts);
  return { sub, guestToken };
}
