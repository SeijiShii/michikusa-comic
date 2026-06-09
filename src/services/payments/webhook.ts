import type { PaymentStatus } from "../../types/index.js";

// Stripe イベント → payment status マップ (冪等処理は呼び出し側が stripe_ref/event_id uniq で担保)
export function mapEventToStatus(eventType: string): PaymentStatus | null {
  switch (eventType) {
    case "checkout.session.completed":
    case "payment_intent.succeeded":
      return "paid";
    case "payment_intent.payment_failed":
      return "failed";
    case "charge.refunded":
      return "refunded";
    default:
      return null; // 関心のないイベントは無視
  }
}

// 冪等性: 処理済みイベント ID 集合で二重処理を防ぐ (実際は db uniq、ロジックを純粋化)
export class IdempotencyGuard {
  private seen = new Set<string>();
  shouldProcess(eventId: string): boolean {
    if (this.seen.has(eventId)) return false;
    this.seen.add(eventId);
    return true;
  }
}

export class SignatureError extends Error {
  status = 400 as const;
  constructor() { super("署名検証に失敗しました"); this.name = "SignatureError"; }
}
// verifySignature は実 Stripe SDK (stripe.webhooks.constructEvent) に委譲する想定。
// ここでは injectable verifier を受け、検証失敗を SignatureError に正規化。
export function verifyOrThrow(verifier: () => boolean): void {
  if (!verifier()) throw new SignatureError();
}
