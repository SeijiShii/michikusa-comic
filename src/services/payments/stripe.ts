import Stripe from "stripe";
import type { CreatePaymentInput } from "../../types/index.js";

let _s: Stripe | null = null;
function stripe(): Stripe {
  if (_s) return _s;
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) throw new Error("STRIPE_SECRET_KEY 未設定 (release で FILL)");
  _s = new Stripe(k);
  return _s;
}
const BASE = () => process.env.APP_BASE_URL || "http://localhost:5173";

export async function createCheckout(ownerId: string, input: CreatePaymentInput): Promise<{ url: string }> {
  const name = input.kind === "tip" ? "道草コミックへの投げ銭" : "高画質書き出し";
  const s = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "jpy", unit_amount: input.amountJpy, product_data: { name } }, quantity: 1 }],
    success_url: `${BASE()}/export/done`,
    cancel_url: `${BASE()}/`,
    metadata: { ownerId, kind: input.kind, comicId: input.comicId ?? "" },
  });
  return { url: s.url! };
}
export function verifyWebhook(rawBody: string, sig: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET 未設定");
  return stripe().webhooks.constructEvent(rawBody, sig, secret);
}
