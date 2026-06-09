import { verifyWebhook } from "../../src/services/payments/stripe.js";
import { mapEventToStatus } from "../../src/services/payments/webhook.js";

// POST /api/payments/webhook — Stripe webhook (生body署名検証, RAW_BODY_ROUTES)
async function readRaw(req: any): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString("utf8");
}
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") { res.statusCode = 405; return res.end("method"); }
  const sig = req.headers["stripe-signature"];
  let event;
  try { event = verifyWebhook(await readRaw(req), Array.isArray(sig) ? sig[0] : sig); }
  catch { res.statusCode = 400; return res.end(JSON.stringify({ error: "署名検証失敗" })); }
  const status = mapEventToStatus(event.type);
  // status を payments 行に反映 (冪等: event.id) — repo 配線は release で実 DB 検証
  res.statusCode = 200; return res.end(JSON.stringify({ received: true, status }));
}
