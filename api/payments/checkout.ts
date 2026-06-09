import { sessionFromReq, makeOwnerResolver } from "../_session.js";
import { createCheckout } from "../../src/services/payments/stripe.js";
import { CreatePaymentInput } from "../../src/types/index.js";

// POST /api/payments/checkout — Stripe 単発 Checkout (PWYW, withOwner)
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  let ownerId;
  try { ownerId = await makeOwnerResolver(sessionFromReq(req)).requireOwner(); }
  catch { return res.status(401).json({ error: "認証が必要です" }); }
  const parsed = CreatePaymentInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "入力が正しくありません" });
  const { url } = await createCheckout(ownerId, parsed.data);
  return res.status(200).json({ checkoutUrl: url });
}
